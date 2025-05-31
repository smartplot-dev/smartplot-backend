import { Body, Controller, Get, Post, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { Payment } from 'src/entities/payment.entity';
import { StartTrxResponseDto } from 'src/dto/start-trx-response.dto';
import { Public } from 'src/decorators/public.decorator';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('payments')
@Roles(Role.Admin, Role.ParcelOwner)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @ApiOperation({
        summary: 'Iniciar una transacción de pago con Webpay',
        description: 'Permite iniciar una transacción de pago utilizando Webpay. Requiere los datos del pago (ver CreatePaymentDto). Administradores y propietarios de parcelas pueden iniciar transacciones.',
    })
    @Post('webpay/start-trx')
    async startTransaction(
        @Body() createPaymentDto: CreatePaymentDto): Promise<StartTrxResponseDto> {
        return this.paymentsService.startWebpayPayment(createPaymentDto);
    }

    @ApiOperation({
        summary: 'Confirmar una transacción de pago con Webpay (uso interno)',
        description: 'Permite confirmar una transacción de pago utilizando Webpay. Requiere el token de la transacción. Importante: este endpoint debe ser llamado únicamente por Transbank, no desde el frontend. Este endpoint es público.',
    })
    @Public()
    @Get('webpay/commit-trx')
    async commitTransaction(@Query('token_ws') token: string): Promise<Payment> {
        return this.paymentsService.commitWebpayPayment(token);
    }

    @ApiOperation({
        summary: 'Obtener todos los pagos',
        description: 'Retorna un array de todos los pagos registrados en el sistema. Este endpoint es accesible solo para administradores.',
    })
    @Get()
    @Roles(Role.Admin)
    async getAllPayments(): Promise<Payment[]> {
        return this.paymentsService.findAllPayments();
    }

    @ApiOperation({
        summary: 'Obtener un pago por ID',
        description: 'Retorna un pago específico por su ID. Si no se encuentra, retorna null. Este endpoint es accesible para administradores y propietarios de parcelas.',
    })
    @Get(':id')
    async getPaymentById(@Param('id', ParseIntPipe) id: number): Promise<Payment | null> {
        return this.paymentsService.findPaymentById(id);
    }
}
