import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remuneration } from 'src/entities/remuneration.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { RemunerationService } from './remuneration.service';
import { RemunerationController } from './remuneration.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Remuneration]),
    UsersModule 
  ],
  providers: [RemunerationService],
  controllers: [RemunerationController],
  exports: [RemunerationService], 
})
export class RemunerationModule {}
