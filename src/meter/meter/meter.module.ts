import { Module } from '@nestjs/common';
import { MeterController } from './meter.controller';
import { MeterService } from './meter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meter } from '../../entities/meter.entity';  
import { ParcelModule } from 'src/parcel/parcel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meter]), ParcelModule],
  controllers: [MeterController],
  providers: [MeterService],
  exports: [MeterService],
})
export class MeterModule {}
