import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ParcelModule } from 'src/parcel/parcel.module'; // Import the ParcelModule
import { Parcel } from 'src/entities/parcel.entity';

@Module({
  imports: [ParcelModule,TypeOrmModule.forFeature([User,Parcel])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
