import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CreateInvoiceDto {

    @ApiProperty({
        type: String,
        example: 'Gastos comunes',
        description: 'Tipo/categoría de la nota de cobro'
    })
    invoice_category: string;

    @ApiProperty({
        type: String,
        example: 'Gastos comunes del mes de septiembre',
        description: 'Descripción de la nota de cobro',
        required: false
    })
    invoice_description?: string;

    @ApiProperty({
        type: Number,
        example: 25000,
        description: 'Monto de la nota de cobro'
    })
    amount: number;

    @ApiProperty({
        type: Date,
        example: '2023-09-01T00:00:00Z',
        description: 'Fecha de emisión de la nota de cobro (opcional, si no se especifica, se asume la fecha actual)',
        required: false
    })
    invoice_date: Date;

     @ApiProperty({
        type: String,
        example: '2023-09-30T00:00:00Z',
        description: 'Fecha de vencimiento de la nota de cobro'
    })
    @IsDateString()
    due_date: string;

    @ApiProperty({
        type: String,
        example: 'pending',
        description: 'Estado de la nota de cobro (ejemplo: pending, paid, overdue)',
        enum: ['pending', 'paid', 'overdue'],
    })
    status: string;
}