import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Parcel } from 'src/entities/parcel.entity';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';
import { MeterModule } from 'src/meter/meter/meter.module';
import { Meter } from 'src/entities/meter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcel]), 
  forwardRef(()=> MeterModule)], // Asegúrate de que MeterModule es el módulo correcto para manejar los medidores
  controllers: [ParcelController],
  providers: [ParcelService],
  exports: [ParcelService],
})
export class ParcelModule {}
