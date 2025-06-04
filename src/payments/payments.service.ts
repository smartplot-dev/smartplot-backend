import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { StartTrxResponseDto } from 'src/dto/start-trx-response.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Invoice } from 'src/entities/invoice.entity';
import { WebpayPlus } from 'transbank-sdk';
import { UsersService } from 'src/users/users.service';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { PaymentMethod } from 'src/enums/payment-methods.enum';
import { InvoiceStatus } from 'src/enums/invoice-status.enum';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly invoiceService: InvoiceService,
        private readonly usersService: UsersService,
    ) {}

    // callback URL for commiting webpay transactions
    // use a real URL in production, ngrok or similar for testing
    private readonly callbackUrl = process.env.TRANSBANK_RETURN_URL

    /**
     * Inicia una transacción con Webpay
     * @param createPaymentDto - DTO que contiene detalles del pago.
     * @returns DTO que contiene el token y la URL para completar el pago.
     * @throws BadRequestException si hay un error al crear la transacción o si las notas de cobro no son válidas.
     */
    async startWebpayPayment(
        createPaymentDto: CreatePaymentDto,
        userId: number,
    ): Promise<StartTrxResponseDto> {
        if (!createPaymentDto.invoices || createPaymentDto.invoices.length === 0) {
            throw new BadRequestException('At least one invoice must be provided for Webpay payments');
        }

        if(!this.callbackUrl || this.callbackUrl === '') {
            throw new InternalServerErrorException('Callback URL for Webpay transactions is not configured. Please set the TRANSBANK_RETURN_URL environment variable.');
        }

        const payment = new Payment();
        payment.payment_method = PaymentMethod.Webpay;
        payment.payment_date = new Date();
        payment.notes = createPaymentDto.notes || 'N/A';
        payment.status = PaymentStatus.Pending;

        // get user from userId
        const user = await this.usersService.findUserById(userId);
        if (!user || !userId) {
            throw new BadRequestException('User not found, cannot create payment');
        }

        payment.user = user;

        const invoiceEntities = new Array<Invoice>();
        for (const inv of createPaymentDto.invoices) {
            const invoice = await this.invoiceService.findInvoiceById(inv);
            if (!invoice) {
                throw new BadRequestException(`Invoice with ID ${inv} not found`);
            }
            invoiceEntities.push(invoice);
        }
        payment.invoices = invoiceEntities;
        const totalAmount = invoiceEntities.reduce((sum, invoice) => sum + invoice.amount, 0);
        payment.amount = totalAmount;

        const savedPayment = await this.paymentRepository.save(payment);

        const internalReferenceNumber = 'WP-' + savedPayment.id.toString();
        savedPayment.internal_reference_number = internalReferenceNumber;
        await this.paymentRepository.save(savedPayment);

        const trx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                Environment.Integration
            )
        );

        const trx_response = await trx.create(
            savedPayment.internal_reference_number,
            savedPayment.internal_reference_number,
            totalAmount,
            this.callbackUrl,
        );

        if (trx_response) {
            savedPayment.reference_number = trx_response.token;
            await this.paymentRepository.save(savedPayment);
        } else {
            savedPayment.status = PaymentStatus.Failed;
            await this.paymentRepository.save(savedPayment);
            throw new BadRequestException('Failed to create Webpay transaction');
        }

        return {
            token: trx_response.token,
            url: trx_response.url,
        };
    }

    /**
     * Confirma una transacción de Webpay utilizando el token proporcionado y actualiza las notas de cobro asociadas.
     * Este endpoint debe ser llamado solamente por el callback de Webpay después de que el usuario complete el pago.
     * (no debe ser llamado directamente por el cliente/frontend)
     * @param token - Token de la transacción Webpay.
     * @returns Objeto Payment actualizado con el estado de la transacción.
     * @throws BadRequestException si el token es inválido o si la transacción falla.
     * @throws BadRequestException si no se encuentra el pago asociado al token.
     */
    async commitWebpayPayment(token: string): Promise<Payment> {
        if (!token) {
            throw new BadRequestException('Token is required to commit the transaction');
        }

        const payment = await this.paymentRepository.findOne({
            where: { reference_number: token },
            relations: ['invoices'],
        });

        if (!payment) {
            throw new BadRequestException(`Payment not found for transaction token: ${token}`);
        }
        
        const trx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                Environment.Integration
            )
        );

        const commitResponse = await trx.commit(token);

        if (!commitResponse) {
            payment.status = PaymentStatus.Failed;
            await this.paymentRepository.save(payment);
            throw new BadRequestException('Failed to commit Webpay transaction');
        }

        if (commitResponse.response_code !== 0) {
            payment.status = PaymentStatus.Failed;
            payment.notes = `Webpay transaction failed with response code: ${commitResponse.response_code}`;
            throw new BadRequestException(`Webpay transaction failed with response code: ${commitResponse.response_code}`);
        } 

        payment.status = PaymentStatus.Completed;
        payment.invoices.forEach(invoice => {
            invoice.status = InvoiceStatus.Paid;
            this.invoiceService.updateInvoice(invoice.id, { status: 'paid' });
        });
        payment.transaction_date = commitResponse.transaction_date;
        payment.transaction_status = commitResponse.status;
        payment.authorization_code = commitResponse.authorization_code;
        payment.card_last_four = commitResponse.card_detail.card_number;
        payment.amount = commitResponse.amount;
        return await this.paymentRepository.save(payment);
    }

    async findAllPayments(): Promise<Payment[]> {
        return await this.paymentRepository.find({ relations: ['invoices'] });
    }

    async findPaymentById(id: number): Promise<Payment | null> {
        if (!id) {
            throw new BadRequestException('Payment ID is required');
        }
        return await this.paymentRepository.findOne({
            where: { id: id },
            relations: ['invoices'],
        });
    }

    async findPaymentsByInvoice(invoiceId: number): Promise<Payment[]> {
        if (!invoiceId) {
            throw new BadRequestException('Invoice ID is required');
        }
        return await this.paymentRepository.find({
            where: { invoices: { id: invoiceId } },
            relations: ['invoices'],
        });
    }

    async findPaymentsByUser(userId: number): Promise<Payment[]> {
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        return await this.paymentRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'invoices'],
        });
    }

    async createManualPayment(
        createPaymentDto: CreatePaymentDto,
        userId: number,
    ): Promise<Payment> {
        if (!userId) {
            throw new BadRequestException('User ID is required to create a manual payment');
        }
        // if createPaymentDto is not provided, throw an error
        if (!createPaymentDto || Object.keys(createPaymentDto).length === 0) {
            throw new BadRequestException('CreatePaymentDto is required to create a manual payment');
        }

        const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new BadRequestException('User not found, cannot create payment');
        }

        const payment = new Payment();
        if(createPaymentDto.payment_method === PaymentMethod.Webpay) {
            throw new BadRequestException('Cannot create manual payment with Webpay method');
        }

        if (!createPaymentDto.invoices || createPaymentDto.invoices.length === 0) {
            throw new BadRequestException('At least one invoice must be provided for manual payments');
        }

        // get 2 first characters of the payment method to generate an internal reference number
        const methodPrefix = createPaymentDto.payment_method.slice(0, 2).toUpperCase();
        const internalReferenceNumber = `${methodPrefix}-${Date.now()}`;
        payment.internal_reference_number = internalReferenceNumber;

        payment.payment_method = createPaymentDto.payment_method;
        payment.payment_date = new Date();
        payment.notes = createPaymentDto.notes || 'N/A';
        payment.status = createPaymentDto.status || PaymentStatus.Pending; // Assuming manual payments are completed immediately
        payment.user = user;

        const invoiceEntities = new Array<Invoice>();
        for (const inv of createPaymentDto.invoices) {
            const invoice = await this.invoiceService.findInvoiceById(inv);
            if (!invoice) {
                throw new BadRequestException(`Invoice with ID ${inv} not found`);
            }
            invoiceEntities.push(invoice);
        }
        payment.invoices = invoiceEntities;
        const totalAmount = invoiceEntities.reduce((sum, invoice) => sum + invoice.amount, 0);
        payment.amount = totalAmount;

        // update invoices status to paid
        payment.invoices.forEach(invoice => {
            invoice.status = InvoiceStatus.Paid;
            this.invoiceService.updateInvoice(invoice.id, { status: InvoiceStatus.Paid });
        });
    
        return await this.paymentRepository.save(payment);
    }
}
