import { Injectable , Inject, forwardRef} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter } from '../../entities/meter.entity';
import { MeterReading } from '../../entities/meterReading.entity';
import { promises } from 'dns';
import { CreateMeterDto } from 'src/dto/create-meter.dto';
import { Parcel } from '../../entities/parcel.entity';
import { ParcelService } from 'src/parcel/parcel.service';
import { MeterReadingService } from 'src/meterReading/meter-reading/meter-reading.service';

@Injectable()
export class MeterService {
    constructor(
    @InjectRepository(Meter)
    private meterRepo: Repository<Meter>,
    @Inject(forwardRef(() => ParcelService))
    private readonly parcelService: ParcelService,
    private readonly meterReadingService: MeterReadingService,
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

  async update(id: number, updateMeterDto: CreateMeterDto): Promise<Meter> {
    const meter = await this.findOne(id);
    if (!meter) {
      throw new Error('Meter not found');
    }
    Object.assign(meter, updateMeterDto);
    return this.meterRepo.save(meter);
  }
  async deleteMeterAndReadings(id: number): Promise<void> {
    const meter = await this.findOne(id);
    if (!meter) {
      throw new Error('Meter not found');
    }
    await this.meterReadingService.deleteReadingsByMeterId(id);
    await this.meterRepo.remove(meter);
  }
  async deleteMeterAndReadingByParcelId(id: number): Promise<void> {
    const parcel = await this.parcelService.findParcelById(id);
  if (!parcel) {
    throw new Error('Parcel not found');
  }
    const meters = await this.meterRepo.find({
    where: { parcel: parcel },
    relations: ['parcel'],
  });
  if (!meters.length) {
    throw new Error('No meters found for the given parcel');
  }
  for (const meter of meters) {
    await this.meterReadingService.deleteReadingsByMeterId(meter.id);
    await this.meterRepo.remove(meter);
  }
}
}
