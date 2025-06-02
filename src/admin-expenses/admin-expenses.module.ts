import { Module } from '@nestjs/common';
import { AdminExpensesService } from './admin-expenses.service';
import { AdminExpensesController } from './admin-expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminExpenses } from '../entities/admin-expenses.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminExpenses]), UsersModule],
  providers: [AdminExpensesService],
  controllers: [AdminExpensesController]
})
export class AdminExpensesModule {}
