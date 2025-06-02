import { Controller, Get, Post, Param, Body , Request, Put,Delete} from '@nestjs/common';
import { CreateMeterDto } from 'src/dto/create-meter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from '../../entities/parcel.entity';
import { MeterReadingService } from './meter-reading.service';
import { CreateMeterReadingDto } from 'src/dto/create-meter-reading.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('meterReading')
@Roles(Role.Admin)
export class MeterReadingController {
  constructor(
    private readonly meterReadingService: MeterReadingService,
  ) {}

  @ApiOperation({
        summary: 'Crear una nueva lectura de medidor',
        description: 'Permite crear una nueva lectura de medidor para un medidor específico. Requiere los datos de la lectura (ver CreateMeterReadingDto). Solo los administradores pueden crear lecturas.',
    })
  @Post("create-reading/:meter_id")
  async createMeter(@Param('meter_id') id: number,  @Body() createMeterReadingDto: CreateMeterReadingDto):Promise<any> {
     return await this.meterReadingService.createMeterReading(createMeterReadingDto, id);
  }

  @ApiOperation({
        summary: 'Obtener todas las lecturas de medidores',
        description: 'Retorna un array de todas las lecturas de medidores registradas en el sistema. Este endpoint es accesible solo para administradores.',
    })
  @Get()
  async findAll() {
    return this.meterReadingService.findAll();
  }

  @ApiOperation({
        summary: 'Obtener una lectura de medidor por ID',
        description: 'Retorna una lectura de medidor específica por su ID. Si no se encuentra, retorna null. Solo los administradores pueden acceder a este endpoint.',
    })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.meterReadingService.findOne(Number(id));
  }

  @ApiOperation({
        summary: 'Actualizar una lectura de medidor por ID',
        description: 'Permite actualizar una lectura de medidor específica por su ID. Requiere los datos de la lectura (ver CreateMeterReadingDto). Solo los administradores pueden acceder a este endpoint.',
    })
  @Put('modificate-reading/:id')
  async updateMeterReading(@Param('id') id: number, @Body() updateMeterReadingDto: CreateMeterReadingDto) {
    try  {
      return this.meterReadingService.updateMeterReading(Number(id), updateMeterReadingDto);}
    catch (error) {
      throw new Error(`Error updating meter reading: ${error.message}`);
    }
    

  }

  @ApiOperation({
        summary: 'Eliminar una lectura de medidor por ID',
        description: 'Permite eliminar una lectura de medidor específica por su ID. Solo los administradores pueden acceder a este endpoint.',
    })
  @Delete('delete-reading/:id')
  async delete(@Param('id') id: number) {
    await this.meterReadingService.deleteMeterReading(Number(id));
    return { message: 'Meter reading deleted successfully' };
  }

  @ApiOperation({
        summary: 'Eliminar todas las lecturas de un medidor por ID',
        description: 'Permite eliminar todas las lecturas de un medidor específico por su ID. Solo los administradores pueden acceder a este endpoint.',
    })
  @Delete('delete-all-readings/:meter_id')
  async deleteByMeter(@Param('meter_id') meter_id: number) {
    await this.meterReadingService.deleteReadingsByMeterId(Number(meter_id));
    return { message: 'All readings for meter deleted successfully' };
  }

}


