import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {

    @ApiProperty({
        type: String,
        example: 'webpay',
        description: 'Método de pago utilizado (ejemplo: webpay, transferencia, efectivo)',
    })
    payment_method: string;

    @ApiProperty({
        type: Date,
        example: '2023-09-01T00:00:00Z',
        description: 'Fecha en que se realizó el pago (opcional, si no se especifica se asume la fecha actual)',
        required: false
    })
    payment_date?: Date;

    @ApiProperty({
        type: String,
        example: 'pendiente',
        description: 'Estado del pago (ejemplo: pendiente, completado, fallido). Si no se especifica, se asume "pendiente"',
        required: false
    })
    status?: string;

    @ApiProperty({
        type: String,
        example: 'Pago realizado el 1 de septiembre',
        description: 'Notas adicionales sobre el pago (opcional)',
        required: false
    })
    notes?: string;

    @ApiProperty({
        type: [Number],
        example: [1, 2, 3],
        description: 'Lista de IDs de notas de cobro asociadas al pago',
    })
    invoices: number[];
}