import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter } from '../../entities/meter.entity';
import { MeterReading } from '../../entities/meterReading.entity';
import { promises } from 'dns';
import { CreateMeterDto } from 'src/dto/create-meter.dto';
import { Parcel } from '../../entities/parcel.entity';
import { ParcelService } from 'src/parcel/parcel.service';

@Injectable()
export class MeterService {
    constructor(
    @InjectRepository(Meter)
    private meterRepo: Repository<Meter>,
    private readonly parcelService: ParcelService,
  ) {}

  async createMeter(CreateMeterDto:CreateMeterDto , parcel_id:number) : Promise<Meter> {
    const parcel = await this.parcelService.findParcelById(parcel_id);
    if (!parcel) {
      throw new Error('Parcel not found');
    }
    const meter = this.meterRepo.create({
      ...CreateMeterDto,
      parcel: parcel,
    });
    return await this.meterRepo.save(meter);
  }

  async findAll() {
    return this.meterRepo.find({ relations: ['parcel'] });
  }

  async findOne(id: number) {
    return this.meterRepo.findOne({
      where: { id },
      relations: ['parcel', 'readings'],
    });
  }

  // Actualiza el consumo actual al agregar una nueva lectura
 /* async updateCurrentConsumption(meterId: number) {
    const readings = await this.meterReadingRepo.find({
      where: { meter: { id: meterId } },
      order: { date: 'ASC' },
    });
    if (readings.length < 2) return; // No hay suficiente data para calcular consumo

    const last = readings[readings.length - 1];
    const prev = readings[readings.length - 2];
    const consumo = last.reading - prev.reading;

    await this.meterRepo.update(meterId, { current_consumption: consumo });
  }*/
}
