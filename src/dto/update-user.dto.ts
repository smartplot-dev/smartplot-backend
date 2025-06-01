import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {

    @ApiProperty({ type: String, example: 'Javier Andrés', description: 'Nombre(s) del usuario', required: false })
    name?: string;

    @ApiProperty({ example: 'Marín', description: 'Apellido paterno del usuario', required: false })
    paternal_surname?: string;

    @ApiProperty({ example: 'Millán', description: 'Apellido materno del usuario', required: false })
    maternal_surname?: string;

    @ApiProperty({ example: 'joti@smartplot.cl', description: 'Correo electrónico del usuario', required: false })
    email?: string;

    @ApiProperty({ example: 56912345678, description: 'Número de teléfono del usuario (sin +)', required: false })
    phone_number?: number;

    @ApiProperty({ example: '20441061-5', description: 'RUT del usuario (sin puntos y con guión)', required: false })
    rut?: string;

    @ApiProperty({ example: 'sm4r7pl07', description: 'Contraseña del usuario', required: false })
    password?: string;

    @ApiProperty({ example: 'parcel_owner', description: 'Rol del usuario', enum: ['"admin"', '"employee"', '"parcel_owner"'], required: false })
    role?: string;
}