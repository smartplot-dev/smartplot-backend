import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { StartTrxResponseDto } from 'src/dto/start-trx-response.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Invoice } from 'src/entities/invoice.entity';
import { WebpayPlus } from 'transbank-sdk';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly invoiceService: InvoiceService,
    ) {}

    async startWebpayPayment(
        createPaymentDto: CreatePaymentDto
    ): Promise<StartTrxResponseDto> {
        const payment = new Payment();
        payment.payment_method = 'webpay';
        payment.payment_date = new Date();
        payment.notes = createPaymentDto.notes || 'N/A';
        payment.status = 'pending';

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
            'https://eda1-2800-300-6a51-5170-8590-9ede-56cf-3e2f.ngrok-free.app/payments/webpay/commit-trx/',
        );

        if (trx_response) {
            savedPayment.reference_number = trx_response.token;
            await this.paymentRepository.save(savedPayment);
        } else {
            savedPayment.status = 'failed';
            await this.paymentRepository.save(savedPayment);
            throw new BadRequestException('Failed to create Webpay transaction');
        }

        return {
            token: trx_response.token,
            url: trx_response.url,
        };
    }

    async commitWebpayPayment(token: string) {
        const trx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                Environment.Integration
            )
        );

        console.log('Committing transaction with token:', token);
        if (!token) {
            throw new BadRequestException('Token is required to commit the transaction');
        }

        const commitResponse = await trx.commit(token);
        // revisar

        if (!commitResponse) {
            throw new BadRequestException('Failed to commit Webpay transaction');
        }

        console.log('Commit response:', commitResponse);

        if (commitResponse.response_code !== 0) {
            throw new BadRequestException(`Webpay transaction failed with response code: ${commitResponse.response_code}`);
        }

        const payment = await this.paymentRepository.findOne({
            where: { reference_number: token },
            relations: ['invoices'],
        });

        if (!payment) {
            throw new BadRequestException('Payment not found for the provided token');
        }

        payment.status = 'completed';
        payment.invoices.forEach(invoice => {
            invoice.status = 'paid';
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
        return await this.paymentRepository.findOne({
            where: { id: id },
            relations: ['invoices'],
        });
    }

}
