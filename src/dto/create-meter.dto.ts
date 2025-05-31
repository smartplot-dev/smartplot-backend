import { ApiProperty } from "@nestjs/swagger";

export class CreateMeterDto {

    @ApiProperty({ type: String, example: 'Agua', description: 'tipo de medidor registrado'})
    meter_type: string;
    @ApiProperty({ type: Number, example: 30, description: 'Cantidad de consumo entre el mes y el anterior', required: false })
    current_consumption: number;

}