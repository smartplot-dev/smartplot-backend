import { Controller, Get, Post, Param, Body , Request, Put, Delete} from '@nestjs/common';
import { MeterService } from './meter.service';
import { CreateMeterDto } from 'src/dto/create-meter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from '../../entities/parcel.entity';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('meters')
@Roles(Role.Admin)
export class MeterController {
  constructor(
    private readonly meterService: MeterService,
  ) {}
  @ApiOperation({
        summary: 'Crear un nuevo medidor',
        description: 'Permite crear un nuevo medidor para una parcela específica. Requiere los datos del medidor (ver CreateMeterDto). Solo los administradores pueden crear medidores.',
    })
  @Post(":parcel_id")
  async createMeter(@Param('parcel_id') id: number,  @Body() createMeterDto: CreateMeterDto):Promise<any> {
     return await this.meterService.createMeter(createMeterDto, id);
  }

  @ApiOperation({
        summary: 'Obtener todos los medidores',
        description: 'Retorna un array de todos los medidores registrados en el sistema. Este endpoint es accesible solo para administradores.',
    })
  @Get()
  async findAll() {
    return this.meterService.findAll();
  }

  @ApiOperation({
        summary: 'Obtener un medidor por ID',
        description: 'Retorna un medidor específico por su ID. Si no se encuentra, retorna null. Solo los administradores pueden acceder a este endpoint.',
    })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.meterService.findOne(Number(id));
  }

  @ApiOperation({
        summary: 'Actualizar un medidor por ID',
        description: 'Permite actualizar un medidor específico por su ID. Requiere los datos del medidor (ver CreateMeterDto). Solo los administradores pueden acceder a este endpoint.',
    })
  @Put('modificate-meter/:id')
  async updateMeter(@Param('id') id: number, @Body() updateMeterDto: CreateMeterDto) {
    return this.meterService.update(id, updateMeterDto);
  }

  @ApiOperation({
        summary: 'Eliminar un medidor por ID',
        description: 'Permite eliminar un medidor específico por su ID. Solo los administradores pueden acceder a este endpoint.',
    })
  @Delete('delete-meter/:id')
  async delete(@Param('id') id: number) {
    await this.meterService.deleteMeterAndReadings(Number(id));
    return { message: 'Meter and its readings deleted successfully' };
  }

  @Delete("delete-meter-parcel/:id")
  async deleteMeterAndReadingByParcelId(@Param('id_parcel') id: number) {
    return this.meterService.deleteMeterAndReadingByParcelId(id);
  }
}
