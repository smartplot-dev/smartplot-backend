import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Parcel } from './parcel.entity';

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    invoice_category: string;
    
    @Column({ type: 'varchar', length: 50, nullable: true })
    invoice_description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    invoice_date: Date;

    @Column({ type: 'timestamp',default: () => 'CURRENT_TIMESTAMP' })
    due_date: Date;

    @Column({ type: 'varchar', length: 50 })
    status: string;

    @ManyToOne(() => Parcel, parcel => parcel.invoices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_parcel' })
    parcel: Parcel;
}