import { Inject, Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Remuneration } from 'src/entities/remuneration.entity';
import { UsersService } from 'src/users/users.service';
import { CreateRemunerationDto } from 'src/dto/create-remuneration.dto';

@Injectable()
export class RemunerationService {

    constructor(
        @InjectRepository(Remuneration)
        private readonly remunerationRepository: Repository<Remuneration>,
        private readonly usersService: UsersService,
    ){}

    async createRemuneration(createRemunerationDto: CreateRemunerationDto, user_id: number): Promise<Remuneration>
    {
        if (!createRemunerationDto || Object.keys(createRemunerationDto).length === 0) {
            throw new BadRequestException('CreateRemunerationDto cannot be empty');
        }

        const requiredFields = ['description', 'amount', 'employee_name', 'employee_paternal_surname', 'employee_rut'];
        for (const field of requiredFields) {
            if (!createRemunerationDto[field]) {
                throw new BadRequestException(`Missing required field: ${field}`);
            }
        }

        if( !user_id) {
            throw new BadRequestException('User ID must be a valid number');
        }

        const user = await this.usersService.findUserById(user_id);

        if (!user) {
            throw new InternalServerErrorException('Admin creating remuneration does not exist?');
        }

        const remuneration = this.remunerationRepository.create({
            ...createRemunerationDto,
            registered_by: user,
        });

        return await this.remunerationRepository.save(remuneration);
    }

    async getAllRemunerations(): Promise<Remuneration[]> {
        const remunerations = await this.remunerationRepository.find({
            relations: ['registered_by'],
            order: { date: 'DESC' },
        });

        if (!remunerations || remunerations.length === 0) {
            throw new NotFoundException('No remunerations found');
        }

        return remunerations;
    }

    async getRemunerationById(id: number): Promise<Remuneration> {
        if (!id) {
            throw new BadRequestException('ID must be a valid number');
        }

        const remuneration = await this.remunerationRepository.findOne({
            where: { id },
            relations: ['registered_by'],
        });

        if (!remuneration) {
            throw new NotFoundException(`Remuneration with ID ${id} not found`);
        }

        return remuneration;
    }

    async getRemunerationsByEmployeeRut(employee_rut: string): Promise<Remuneration[]> {
        if (!employee_rut || typeof employee_rut !== 'string') {
            throw new BadRequestException('Employee RUT must be a valid string');
        }

        const remunerations = await this.remunerationRepository.find({
            where: { employee_rut },
            relations: ['registered_by'],
            order: { date: 'DESC' },
        });

        if (!remunerations || remunerations.length === 0) {
            throw new NotFoundException(`No remunerations found for employee RUT ${employee_rut}`);
        }

        return remunerations;
    }

    async deleteRemuneration(id: number): Promise<void> {
        if (!id) {
            throw new BadRequestException('ID must be a valid number');
        }

        const result = await this.remunerationRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Remuneration with ID ${id} not found`);
        }
    }

    async updateRemuneration(id: number, updateData: Partial<CreateRemunerationDto>): Promise<Remuneration> {
        if (!id) {
            throw new BadRequestException('ID must be a valid number');
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            throw new BadRequestException('Update data cannot be empty');
        }

        const remuneration = await this.getRemunerationById(id);

        Object.assign(remuneration, updateData);

        return await this.remunerationRepository.save(remuneration);
    }

    async getRemunerationsByMonthAndYear(month: string, year: number): Promise<Remuneration[]> {
        if (!month || typeof month !== 'string' || !year) {
            throw new BadRequestException('Month must be a valid string and year must be a valid number');
        }

        const remunerations = await this.remunerationRepository.find({
            where: { month, year },
            relations: ['registered_by'],
            order: { date: 'DESC' },
        });

        if (!remunerations || remunerations.length === 0) {
            throw new NotFoundException(`No remunerations found for month ${month} and year ${year}`);
        }

        return remunerations;
    }

    async getRemunerationsByYear(year: number): Promise<Remuneration[]> {
        if (!year) {
            throw new BadRequestException('Year must be a valid number');
        }

        const remunerations = await this.remunerationRepository.find({
            where: { year },
            relations: ['registered_by'],
            order: { date: 'DESC' },
        });

        if (!remunerations || remunerations.length === 0) {
            throw new NotFoundException(`No remunerations found for year ${year}`);
        }

        return remunerations;
    }

    async getRemunerationsByEmployeeNameAndSurname(employee_name: string, employee_paternal_surname: string): Promise<Remuneration[]> {
        if (!employee_name || typeof employee_name !== 'string' || !employee_paternal_surname || typeof employee_paternal_surname !== 'string') {
            throw new BadRequestException('Employee name and surname must be valid strings');
        }

        const remunerations = await this.remunerationRepository.find({
            where: {
                employee_name,
                employee_paternal_surname,
            },
            relations: ['registered_by'],
            order: { date: 'DESC' },
        });

        if (!remunerations || remunerations.length === 0) {
            throw new NotFoundException(`No remunerations found for employee ${employee_name} ${employee_paternal_surname}`);
        }

        return remunerations;
    }

}
