import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminExpensesDto {
  @ApiProperty({ type: Number, example: 1, description: 'ID del medidor' })
  meterReadingId: number;

  @ApiProperty({ type: String, example: "Compra de herramientas para mantencion", description: 'Compras realizadas por la administracion' })
  desc: string;
  @ApiProperty({ type: Number, example: 2349.345, description: 'Valor del gasto realizado' })
  amount: number;

  @ApiProperty({ type: Number, example: 123.45, description: 'Valor de la lectura del medidor' })
  reading: number;
}