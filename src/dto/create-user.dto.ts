export class CreateUserDto {
    name: string;
    paternal_surname: string;
    maternal_surname?: string;
    email: string;
    phone_number?: number;
    rut: string;
    password: string;
}