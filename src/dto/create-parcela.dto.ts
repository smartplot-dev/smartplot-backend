import { ApiProperty } from "@nestjs/swagger";

export class CreateParcelDto {
    @ApiProperty({
        type: String,
        example: '90-A',
        description: 'Número de la parcela (puede incluir letras y números). Debe ser único.',
        uniqueItems: true,
    })
    numero_parcela: string;
}