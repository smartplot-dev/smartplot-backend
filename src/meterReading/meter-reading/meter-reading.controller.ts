import { Controller, Get, Post, Param, Body , Request, Put,Delete} from '@nestjs/common';
import { CreateMeterDto } from 'src/dto/create-meter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from '../../entities/parcel.entity';
import { MeterReadingService } from './meter-reading.service';
import { CreateMeterReadingDto } from 'src/dto/create-meter-reading.dto';

@Controller('meterReading')
export class MeterReadingController {
  constructor(
    private readonly meterReadingService: MeterReadingService,
  ) {}

  @Post("create-reading/:meter_id")
  async createMeter(@Param('meter_id') id: number,  @Body() createMeterReadingDto: CreateMeterReadingDto):Promise<any> {
     return await this.meterReadingService.createMeterReading(createMeterReadingDto, id);
  }
  @Get()
  async findAll() {
    return this.meterReadingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.meterReadingService.findOne(Number(id));
  }
  @Put('modificate-reading/:id')
  async updateMeterReading(@Param('id') id: number, @Body() updateMeterReadingDto: CreateMeterReadingDto) {
    try  {
      return this.meterReadingService.updateMeterReading(Number(id), updateMeterReadingDto);}
    catch (error) {
      throw new Error(`Error updating meter reading: ${error.message}`);
    }
    

  }
  @Delete('delete-reading/:id')
  async delete(@Param('id') id: number) {
    await this.meterReadingService.deleteMeterReading(Number(id));
    return { message: 'Meter reading deleted successfully' };
  }
  @Delete('delete-all-readings/:meter_id')
  async deleteByMeter(@Param('meter_id') meter_id: number) {
    await this.meterReadingService.deleteReadingsByMeterId(Number(meter_id));
    return { message: 'All readings for meter deleted successfully' };
  }

}


