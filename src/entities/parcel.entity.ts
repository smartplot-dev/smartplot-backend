import { Entity, Column, PrimaryGeneratedColumn , OneToMany} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('parcel')
export class Parcel {
    @PrimaryGeneratedColumn()
    id_parcel: number;

    @Column({ type: 'varchar', length: 255 })
    numero_parcela: string;

    @OneToMany(() => Invoice, invoice => invoice.parcel, { eager: true })
    invoices: Invoice[];
}