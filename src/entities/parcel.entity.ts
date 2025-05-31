import { Entity, Column, PrimaryGeneratedColumn , OneToMany,ManyToMany} from 'typeorm';
import { Invoice } from './invoice.entity';
import { User } from './user.entity';
import { Meter } from './meter.entity';

@Entity('parcel')
export class Parcel {
    @PrimaryGeneratedColumn()
    id_parcel: number;

    @Column({ type: 'varchar', length: 255 })
    numero_parcela: string;

    @OneToMany(() => Invoice, invoice => invoice.parcel, { eager: true })
    invoices: Invoice[];
    @OneToMany(() => Meter, meter => meter.parcel, { eager: true })
    meters: Meter[];

    @ManyToMany(() => User, user => user.parcels)   
    users: User[];
}