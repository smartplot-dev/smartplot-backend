export class CreateUserDto {
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string;
    correo: string;
    telefono?: number;
    rut: string;
    password: string;
}