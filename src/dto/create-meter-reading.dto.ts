import { ApiProperty } from '@nestjs/swagger';

export class CreateMeterReadingDto {
  @ApiProperty({ type: Number, example: 1, description: 'ID del medidor' })
  meterReadingId: number;

  @ApiProperty({ type: Number, example: 1, description: 'Numero del mes del al realizar la lectura' })
  month: number;
  @ApiProperty({ type: Number, example: 2025, description: 'Año en la que se realiza la lectura' })
  year: number;

  @ApiProperty({ type: Number, example: 123.45, description: 'Valor de la lectura del medidor' })
  reading: number;
}