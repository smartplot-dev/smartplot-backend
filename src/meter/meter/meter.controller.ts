import { Controller, Get, Post, Param, Body , Request, Put, Delete} from '@nestjs/common';
import { MeterService } from './meter.service';
import { CreateMeterDto } from 'src/dto/create-meter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from '../../entities/parcel.entity';

@Controller('meters')
export class MeterController {
  constructor(
    private readonly meterService: MeterService,
  ) {}

  @Post(":parcel_id")
  async createMeter(@Param('parcel_id') id: number,  @Body() createMeterDto: CreateMeterDto):Promise<any> {
     return await this.meterService.createMeter(createMeterDto, id);
  }
  @Get()
  async findAll() {
    return this.meterService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.meterService.findOne(Number(id));
  }
  @Put('modificate-meter/:id')
  async updateMeter(@Param('id') id: number, @Body() updateMeterDto: CreateMeterDto) {
    return this.meterService.update(id, updateMeterDto);
  }
  @Delete('delete-meter/:id')
  async delete(@Param('id') id: number) {
    await this.meterService.deleteMeterAndReadings(Number(id));
    return { message: 'Meter and its readings deleted successfully' };
  }
}
