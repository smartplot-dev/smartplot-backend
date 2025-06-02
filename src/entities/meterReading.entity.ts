import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Meter } from './meter.entity';

@Entity('meter_reading')
export class MeterReading {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    month: number; // Fecha de la lectura (puede ser el primer día del mes)
    
    @Column({ type: 'int' })
    year: number; //
    
    @Column({ type: 'float' })
    reading: number; // Valor de la lectura del medidor

    @ManyToOne(() => Meter, meter => meter.readings)
    meter: Meter;
}