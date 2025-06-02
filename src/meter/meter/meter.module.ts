import { Module, forwardRef } from '@nestjs/common';
import { MeterController } from './meter.controller';
import { MeterService } from './meter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meter } from '../../entities/meter.entity';  
import { ParcelModule } from 'src/parcel/parcel.module';
import { MeterReadingModule } from 'src/meterReading/meter-reading/meter-reading.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meter]), ParcelModule, 
  forwardRef(()=> MeterReadingModule)],
  controllers: [MeterController],
  providers: [MeterService],
  exports: [MeterService],
})
export class MeterModule {}
