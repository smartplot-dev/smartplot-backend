import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Parcel } from 'src/entities/parcel.entity';
import { ParcelService } from 'src/parcel/parcel.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Parcel)
        private readonly parcelRepository: Repository<Parcel>,
         // Assuming you have a ParcelService to handle parcels
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
        if (createUserDto.parcel_ids && createUserDto.parcel_ids.length > 0) {
        user.parcels = await this.parcelRepository.findByIds(createUserDto.parcel_ids);
        } 
        else {
        user.parcels = [];}

        return await this.userRepository.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find({ relations: ['parcels'] });
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
    async updateUserParcels(userId: number, parcelIds: number[]): Promise<User> {
        const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['parcels'],
        });
        if (!user) throw new Error('User not found')
        user.parcels = await this.parcelRepository.find({
        where: { id_parcel: In(parcelIds) }
        });
        return this.userRepository.save(user);
    }
    async removeParcelFromUser(userId: number, parcelId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['parcels'],
        });
        if (!user) throw new Error('User not found');

        // Filtra la parcela a eliminar
        user.parcels = user.parcels.filter(parcel => parcel.id_parcel !== parcelId);

        return this.userRepository.save(user);
    }
    async addParcelToUser(userId: number, parcelId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['parcels'],
        });
        if (!user) throw new Error('User not found');

        const parcel = await this.parcelRepository.findOneBy({ id_parcel: parcelId });
        if (!parcel) throw new Error('Parcel not found');

        // Solo agrega si no existe ya la relación
        if (!user.parcels.some(p => p.id_parcel === parcelId)) {
            user.parcels.push(parcel);
        }

        return this.userRepository.save(user);
    }
}
