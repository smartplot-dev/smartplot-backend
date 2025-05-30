import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    payment_method: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    payment_date?: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    internal_reference_number?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reference_number?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    notes?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    card_last_four?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    transaction_date?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    transaction_status?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    authorization_code?: string;

    @OneToMany(() => Invoice, invoice => invoice.payment, { eager: true })
    invoices: Invoice[];
}