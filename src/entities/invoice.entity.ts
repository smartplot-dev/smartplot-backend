import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Parcel } from './parcel.entity';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    invoice_category: string;
    
    @Column({ type: 'varchar', length: 50, nullable: true })
    invoice_description: string;

    @Column({ type: 'int' })
    amount: number;

    @Column({type: 'date', nullable: true , default: () => 'CURRENT_DATE'})
    invoice_date: Date;

    @Column({ type: 'varchar', length: 50 })
    due_date: string;

    @Column({ type: 'varchar', length: 50 })
    status: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    file_path: string;

    @ManyToOne(() => Parcel, parcel => parcel.invoices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_parcel' })
    parcel: Parcel;

    @ManyToOne(() => Payment, payment => payment.invoices, { onDelete: 'SET NULL' })
    payment: Payment;
}