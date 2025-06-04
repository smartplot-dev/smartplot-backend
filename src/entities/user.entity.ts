import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Notice } from './notice.entity';
import { Parcel } from './parcel.entity';
import { Payment } from './payment.entity';
import { AdminExpenses } from './admin-expenses.entity';
import { Remuneration } from './remuneration.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 255 })
    name: string;
    
    @Column({ type: 'varchar', length: 255 })
    paternal_surname: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    maternal_surname: string;
    
    @Column({ type: 'varchar', length: 255 })
    email: string;
    
    @Column({ type: 'int', nullable: true })
    phone_number: number;

    @Column({ type: 'varchar', length: 15, unique: true })
    rut: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;

    @Column({ default: 'parcel_owner', type: 'varchar', length: 50 })
    role: string;

    @OneToMany(() => Notice, notice => notice.uploadedBy, { eager: true })
    @JoinColumn({ name: 'uploaded_by' })
    notices: Notice[];

    @OneToMany(() => Payment, payment => payment.user, { eager: true })
    @JoinColumn({ name: 'user_id' })
    payments: Payment[];

    @ManyToMany(() => Parcel, parcel => parcel.users)
    @JoinTable({name: 'user_parcel',
        joinColumn: { name: 'user_id',
             referencedColumnName: 'id',
            foreignKeyConstraintName:'user_parcel_user_id' },
        inverseJoinColumn: { name: 'parcel_id',
             referencedColumnName: 'id_parcel',
            foreignKeyConstraintName:'user_parcel_parcel_id' }
    })
    parcels: Parcel[];
    @OneToMany(() => AdminExpenses, adminExpenses => adminExpenses.user)
    @JoinColumn({ name: 'user_id' })
    adminExprenses: AdminExpenses[];
    
    @OneToMany(() => Remuneration, remuneration => remuneration.registered_by, { eager: true })
    @JoinColumn({ name: 'registered_by' })
    remunerations: Remuneration[];
}