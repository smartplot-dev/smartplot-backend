import { Module, forwardRef } from '@nestjs/common';
import { MeterReadingService } from './meter-reading.service';
import { MeterReadingController } from './meter-reading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterReading } from '../../entities/meterReading.entity';
import { MeterModule } from 'src/meter/meter/meter.module';
import { Meter } from 'src/entities/meter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterReading,Meter]), 
  forwardRef(()=> MeterModule)],
  providers: [MeterReadingService],
  controllers: [MeterReadingController],
  exports: [MeterReadingService],
})
export class MeterReadingModule {}
