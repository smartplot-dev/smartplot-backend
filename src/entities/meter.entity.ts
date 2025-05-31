import { Entity, Column, PrimaryGeneratedColumn , OneToMany,ManyToOne, Unique} from 'typeorm';
import { Parcel } from './parcel.entity';
import { MeterReading } from './meterReading.entity';

@Entity('meter')
@Unique(['meter_type',"parcel"])
export class Meter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    meter_type: string;
    @Column({ type: 'float', default: '0' })
    current_consumption: number;

    @ManyToOne(() => Parcel, parcel => parcel.meters)   
    parcel: Parcel;
    @OneToMany(() => MeterReading, reading => reading.meter)
    readings: MeterReading[];
}