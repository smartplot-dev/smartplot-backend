import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from 'src/entities/notice.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), UsersModule],
  providers: [NoticesService],
  controllers: [NoticesController],
  exports: [NoticesService],
})
export class NoticesModule {}
