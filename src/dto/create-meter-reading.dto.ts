import { ApiProperty } from '@nestjs/swagger';

export class CreateMeterReadingDto {
  @ApiProperty({ type: Number, example: 1, description: 'ID del medidor' })
  meterReadingId: number;

  @ApiProperty({ type: String, example: '1', description: 'Numero del mes del medidor' })
  month: number;
  @ApiProperty({ type: String, example: '2025', description: 'Fecha de la lectura (YYYY-MM-DD)' })
  year: number;

  @ApiProperty({ type: Number, example: 123.45, description: 'Valor de la lectura del medidor' })
  reading: number;
}