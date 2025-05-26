import { Injectable } from '@nestjs/common';
import { Usuario } from 'src/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository: Repository<Usuario>,
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async createUser(createUserDto: CreateUserDto): Promise<Usuario> {
        const user = new Usuario();
        user.nombre = createUserDto.nombre;
        user.apellido_paterno = createUserDto.apellido_paterno;
        if(createUserDto.apellido_materno) {
            user.apellido_materno = createUserDto.apellido_materno;
        }
        user.correo = createUserDto.correo;
        if(createUserDto.telefono) {
            user.telefono = createUserDto.telefono;
        }
        // TODO: ensure RUT is unique and properly formatted (ex: 12345678-9)
        user.rut = createUserDto.rut;
        user.password = await this.hashPassword(createUserDto.password);
        user.is_active = true;

        return await this.userRepository.save(user);
    }

    async findAllUsers(): Promise<Usuario[]> {
        return await this.userRepository.find();
    }

    findUserById(id: number): Promise<Usuario | null> {
        return this.userRepository.findOneBy( { id } );
    }

    findUserByRut(rut: string): Promise<Usuario | null> {
        return this.userRepository.findOneBy({ rut });
    }

    async updateUser(id: number, updateUserDto: CreateUserDto): Promise<Usuario | null> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            return null; // User not found
        }

        user.nombre = updateUserDto.nombre;
        user.apellido_paterno = updateUserDto.apellido_paterno;
        if (updateUserDto.apellido_materno) {
            user.apellido_materno = updateUserDto.apellido_materno;
        }
        user.correo = updateUserDto.correo;
        if (updateUserDto.telefono) {
            user.telefono = updateUserDto.telefono;
        }
        user.rut = updateUserDto.rut;
        user.password = await this.hashPassword(updateUserDto.password);

        return await this.userRepository.save(user);
    }

    async removeUser(id: number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id });
        if (user) {
            await this.userRepository.remove(user);
        }
    }

}
