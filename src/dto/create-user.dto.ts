import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ type: String, example: 'Victor Raul', description: 'Nombre(s) del usuario' })
    name: string;

    @ApiProperty({ example: 'Magnatera', description: 'Apellido paterno del usuario' })
    paternal_surname: string;

    @ApiProperty({ example: 'Sarabia', description: 'Apellido materno del usuario', required: false })
    maternal_surname?: string;

    @ApiProperty({ example: 'victor.magnatera@smartplot.cl', description: 'Correo electrónico del usuario' })
    email: string;

    @ApiProperty({ example: 56912345678, description: 'Número de teléfono del usuario (sin +)', required: false })
    phone_number?: number;

    @ApiProperty({ example: '21280416-9', description: 'RUT del usuario (sin puntos y con guión)' })
    rut: string;

    @ApiProperty({ example: 'sm4r7pl07', description: 'Contraseña del usuario' })
    password: string;

    @ApiProperty({ example: 'parcel_owner', description: 'Rol del usuario', enum: ['"admin"', '"employee"', '"parcel_owner"'] })
    role: string;

    @ApiProperty({ example: '[1, 2, 3]', description: 'Array de ids de las parcelas asociadas al usuario',required: false })
    parcel_ids: number[]; 
}