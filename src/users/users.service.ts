import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.name = createUserDto.name;
        user.paternal_surname = createUserDto.paternal_surname;
        if(createUserDto.maternal_surname) {
            user.maternal_surname = createUserDto.maternal_surname;
        }
        user.email = createUserDto.email;
        if(createUserDto.phone_number) {
            user.phone_number = createUserDto.phone_number;
        }
        // TODO: ensure RUT is unique and properly formatted (ex: 12345678-9)
        user.rut = createUserDto.rut;
        user.password = await this.hashPassword(createUserDto.password);
        user.is_active = true;

        return await this.userRepository.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    findUserById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy( { id } );
    }

    findUserByRut(rut: string): Promise<User | null> {
        return this.userRepository.findOneBy({ rut });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.paternal_surname) {
            user.paternal_surname = updateUserDto.paternal_surname;
        }
        if (updateUserDto.maternal_surname) {
            user.maternal_surname = updateUserDto.maternal_surname;
        }
        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }
        if (updateUserDto.phone_number) {
            user.phone_number = updateUserDto.phone_number;
        }
        if (updateUserDto.rut) {
            user.rut = updateUserDto.rut;
        }
        if (updateUserDto.password) {
            user.password = await this.hashPassword(updateUserDto.password);
        }
        
        // if no fields are provided, throw bad request error
        if (!Object.keys(updateUserDto).length) {
            throw new BadRequestException('No fields to update were provided');
        }

        return await this.userRepository.save(user);
    }

    async removeUser(id: number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id });
        if (user) {
            await this.userRepository.remove(user);
        }
    }

}
