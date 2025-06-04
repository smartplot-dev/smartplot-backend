import { ApiProperty } from '@nestjs/swagger';

export class CreateRemunerationDto {

    @ApiProperty({
        type: String,
        example: 'Pago mensual de septiembre por servicios prestados',
        required: true,
        description: 'Descripción de la remuneración',
    })
    description: string;

    @ApiProperty({
        type: Number,
        example: 500000,
        required: true,
        description: 'Monto de la remuneración en pesos chilenos',
    })
    amount: number;

    @ApiProperty({
        type: Date,
        example: '2023-09-01T00:00:00Z',
        required: true,
        description: 'Fecha de la remuneración (opcional, si no se especifica se asume la fecha actual)',
    })
    date?: Date;

    @ApiProperty({
        type: String,
        example: 'Sebastián',
        required: true,
        description: 'Nombre del empleado que recibe la remuneración',
    })
    employee_name: string;

    @ApiProperty({
        type: String,
        example: 'Berríos',
        required: true,
        description: 'Apellido paterno del empleado que recibe la remuneración',
    })
    employee_paternal_surname: string;

    @ApiProperty({
        type: String,
        example: 'Sarabia',
        required: false,
        description: 'Apellido materno del empleado que recibe la remuneración (opcional)',
    })
    employee_maternal_surname?: string;

    @ApiProperty({
        type: String,
        example: '12345678-9',
        required: true,
        description: 'RUT del empleado que recibe la remuneración (formato: 12345678-9)',
    })
    employee_rut: string;

    @ApiProperty({
        type: String,
        example: 'septiembre',
        required: true,
        description: 'Mes de la remuneración',
    })
    month: string;

    @ApiProperty({
        type: Number,
        example: 2023,
        required: true,
        description: 'Año de la remuneración',
    })
    year: number;
}