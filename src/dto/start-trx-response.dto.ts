import { ApiProperty } from "@nestjs/swagger";

export class StartTrxResponseDto {
    @ApiProperty({
        type: String,
        example: '01ab5631ce0b2192271b79d8b481b0331755e2bcc8c8431b439e1d81af4729b1',
        description: 'Token de transacción generado por Webpay',
    })
    token: string;

    @ApiProperty({
        type: String,
        example: 'https://webpay3gint.transbank.cl/webpayserver/initTransaction',
        description: 'URL del formulario de pago de Webpay',
    })
    url: string;
}