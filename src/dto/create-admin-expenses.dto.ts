import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminExpensesDto {
  @ApiProperty({ type: String, example: "Compra de herramientas para mantencion", description: 'Compras realizadas por la administracion' })
  desc: string;
  
  @ApiProperty({ type: Number, example: 2349.345, description: 'Valor del gasto realizado' })
  amount: number;
}