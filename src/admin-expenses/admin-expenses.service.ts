import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminExpenses } from '../entities/admin-expenses.entity';
import { UsersService } from 'src/users/users.service';
import { CreateAdminExpensesDto } from 'src/dto/create-admin-expenses.dto';

@Injectable()
export class AdminExpensesService {
  constructor(
    @InjectRepository(AdminExpenses)
    private adminExpensesRepo: Repository<AdminExpenses>,
    private readonly usersService: UsersService,
  ) {}

  async create(id:number ,data: CreateAdminExpensesDto): Promise<AdminExpenses> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new Error('User not found');    
    }
    const expense = this.adminExpensesRepo.create({
        ...data,
        user: user,
        });
    return this.adminExpensesRepo.save(expense);
  }

  async findAll(): Promise<AdminExpenses[]> {
    return this.adminExpensesRepo.find( {
      relations: ['user']}) // Include user relation if needed);
  }

  async findOne(id: number): Promise<AdminExpenses> {
    const expense = await this.adminExpensesRepo.findOne({ where: { id } , relations: ['user'] });
    if (!expense) {
        throw new Error('Expense not found');
        }
    return expense;
  }

  async update(id: number, data: Partial<AdminExpenses>): Promise<AdminExpenses> {
    const expense = await this.findOne(id);
    if (!expense) {
        throw new Error('Expense not found');
        }
    Object.assign(expense, data);
    return this.adminExpensesRepo.save(expense);
  }

  async remove(id: number): Promise<void> {
    await this.adminExpensesRepo.delete(id);
  }
}