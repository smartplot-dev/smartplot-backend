import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter } from '../../entities/meter.entity';
import { MeterReading } from '../../entities/meterReading.entity';
import { MeterService } from 'src/meter/meter/meter.service';
import { CreateMeterReadingDto } from 'src/dto/create-meter-reading.dto';
import { Not , In} from 'typeorm';
@Injectable()
export class MeterReadingService {
    constructor(
    @InjectRepository(MeterReading)
    private meterReadingRepo: Repository<MeterReading>,
    @Inject( forwardRef(() => MeterService))
    private readonly meterService: MeterService,
    @InjectRepository(Meter)
    private meterRepo: Repository<Meter>,
  ) {}

  async createMeterReading(CreateMeterReadingDto:CreateMeterReadingDto , meter_id:number) : Promise<MeterReading> {
    const meter = await this.meterService.findOne(meter_id);
    console.log('Meter encontrado:', meter);
    if (!meter) {
      throw new Error('Meter not found');
    }
    const existingReading = await this.meterReadingRepo.findOne({
    where: {
      meter: { id: meter_id },
      month: CreateMeterReadingDto.month,
      year: CreateMeterReadingDto.year,
    },
  });
  if (existingReading) {
    throw new Error(`Ya existe una lectura para el mes ${CreateMeterReadingDto.month} del año ${CreateMeterReadingDto.year}`);
  }
    
    meter.prev_month = meter.current_month;
    meter.current_month = CreateMeterReadingDto.month;
    meter.currentYear = CreateMeterReadingDto.year; // Actualiza el año actual del medidor
    let prevMonth = meter.current_month - 1;
    let prevYear = meter.currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = meter.currentYear - 1;
    }
    const prevReading = await this.meterReadingRepo.findOne({
        where: {
            meter: { id: meter_id },
            month: meter.prev_month,
            year: prevYear, // O ajusta el año si cambia de año
        },
    });
    
    if (prevReading) {
        meter.current_consumption = CreateMeterReadingDto.reading - prevReading.reading;
        if (meter.current_consumption < 0) {
            meter.current_consumption = meter.current_consumption* -1; // Asegura que el consumo sea positivo
        }
    } else {
        meter.current_consumption = 0; 
    }
    await this.meterRepo.save(meter);
    const meterReading = this.meterReadingRepo.create({
      ...CreateMeterReadingDto,
      meter: meter,
    });
    return await this.meterReadingRepo.save(meterReading);
  }

  async findAll() {
    return this.meterReadingRepo.find({relations: ['meter'] });
  }

  async findOne(id: number) {
    return this.meterReadingRepo.findOne({
      where: { id },
      relations: ['meter'],
    });
  }
  async deleteReadingsByMeterId(meter_id: number): Promise<void> {

  await this.meterReadingRepo.delete({ meter: { id: meter_id } });
  }

  async updateMeterReading(id: number, updateMeterReadingDto: CreateMeterReadingDto): Promise<MeterReading> {

  // Buscar el meter asociado
  const meterReading = await this.meterReadingRepo.findOne({
    where: { id: id },
    relations: ['meter'], // Asegúrate de incluir la relación con el medidor
  });
  if (!meterReading) {
    throw new Error('Meter not found');
  }

  // Actualizar los datos de la lectura
  
  const meter = await this.meterRepo.findOne({
    where: { id: meterReading.meter.id }}); // Si tienes la relación
  if (!meter) {
    throw new Error('Meter not found')}; 
  Object.assign(meterReading, updateMeterReadingDto);
  // Si la lectura editada es la del mes actual del medidor
  if (
    meterReading.month === meter.current_month &&
    meterReading.year === meter.currentYear
  ) {
    // Buscar la lectura previa (mes anterior)
    let prevMonth = meterReading.month - 1;
    let prevYear = meterReading.year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = meterReading.year - 1;
    }
    const prevReading = await this.meterReadingRepo.findOne({
      where: {
        meter: { id: meter.id },
        month: prevMonth,
        year: prevYear,
      },
    });

    if (prevReading) {
      meter.current_consumption = meterReading.reading - prevReading.reading;
      if (meter.current_consumption < 0) {
        meter.current_consumption = meter.current_consumption * -1;
      }
      meter.current_month = meterReading.month;
      meter.currentYear = meterReading.year;
      meter.prev_month = prevReading.month;
    } else {
      meter.current_consumption = 0;
      meter.prev_month = 0;
    }
    await this.meterRepo.save(meter);
  }
  // Si la lectura editada es la del mes anterior del medidor
  else if (
    meterReading.month === meter.prev_month &&
    meterReading.year === (meter.current_month === 1 ? meter.currentYear - 1 : meter.currentYear)
  ) {
    // Buscar la lectura previa a la anterior
    let prevPrevMonth = meterReading.month - 1;
    let prevPrevYear = meterReading.year;
    if (prevPrevMonth === 0) {
      prevPrevMonth = 12;
      prevPrevYear = meterReading.year - 1;
    }
    const prevPrevReading = await this.meterReadingRepo.findOne({
      where: {
        meter: { id: meter.id },
        month: prevPrevMonth,
        year: prevPrevYear,
      },
    });
    if (!prevPrevReading) {
      throw new Error('Previous reading not found');
    }

    // Buscar la lectura actual (mes actual)
    const currentReading = await this.meterReadingRepo.findOne({
      where: {
        meter: { id: meter.id },
        month: meter.current_month,
        year: meter.currentYear,
      },
    });
    if (!currentReading) {
      throw new Error('Current reading not found');
    }

    if (prevPrevReading) {
      meter.current_consumption = currentReading.reading - prevPrevReading.reading;
      if (meter.current_consumption < 0) {
        meter.current_consumption = meter.current_consumption * -1;
      }
    } else {
      meter.current_consumption = 0;
    }
    await this.meterRepo.save(meter);
  }

  return this.meterReadingRepo.save(meterReading);
  }
 
  async deleteMeterReading(id: number): Promise<void> {
  const meterReading = await this.findOne(id);
  if (!meterReading) {
    throw new Error('Meter reading not found');
  }
  

  // Buscar el meter asociado
  const meter = await this.meterRepo.findOne({
    where: { id: meterReading.meter.id } // Si tienes la relación
  });
  if (!meter) {
    throw new Error('Meter not found');
  }
  if (meterReading.month == meter.current_month && meterReading.year == meter.currentYear) {
            const prevReading = await this.meterReadingRepo.findOne({
            where: {
              meter: { id: meterReading.meter.id },
              id: Not(id), // Excluye la que vas a borrar
            },
            order: { year: 'DESC', month: 'DESC'}, // Ajusta según tu modelo
          });
          if (!prevReading) {
            throw new Error('MeterReading not found');
          }

          // Actualizar el meter con los valores de la lectura anterior
          const prevPrevReading = await this.meterReadingRepo.findOne({
            where: {
              meter: { id: meterReading.meter.id },
              id: Not(In([prevReading.id , id])),
            },
            order: { year: 'DESC', month: 'DESC'},
          });
          
        // Actualizar el meter con los valores de las lecturas anteriores
        if (prevReading && prevPrevReading) {
          meter.current_month = prevReading.month;
          meter.prev_month = prevPrevReading.month;
          meter.current_consumption = prevReading.reading - prevPrevReading.reading;
          if (meter.current_consumption < 0) {
            meter.current_consumption = meter.current_consumption * -1; // Asegura que el consumo sea positivo
          }
        }
        else {
          throw new Error('No se puede eliminar la lectura actual sin dos lecturas previas a la actual.');
          
        }
          await this.meterRepo.save(meter);
  }
  

  await this.meterReadingRepo.remove(meterReading);
}
}
