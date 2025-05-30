import { Body, Controller, Get, Post, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { Payment } from 'src/entities/payment.entity';
import { StartTrxResponseDto } from 'src/dto/start-trx-response.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Public()
    @Post('webpay/start-trx')
    async startTransaction(
        @Body() createPaymentDto: CreatePaymentDto): Promise<StartTrxResponseDto> {
        return this.paymentsService.startWebpayPayment(createPaymentDto);
    }

    @Public()
    @Get('webpay/commit-trx')
    async commitTransaction(@Query('token_ws') token: string): Promise<Payment> {
        return this.paymentsService.commitWebpayPayment(token);
    }

    @Get()
    async getAllPayments(): Promise<Payment[]> {
        return this.paymentsService.findAllPayments();
    }

    @Get(':id')
    async getPaymentById(@Param('id', ParseIntPipe) id: number): Promise<Payment | null> {
        return this.paymentsService.findPaymentById(id);
    }
}
