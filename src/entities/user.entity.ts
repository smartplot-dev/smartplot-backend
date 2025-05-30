import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Notice } from './notice.entity';
import { Parcel } from './parcel.entity';

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

    @OneToMany(() => Notice, notice => notice.uploadedBy, { eager: true })
    @JoinColumn({ name: 'uploaded_by' })
    notices: Notice[];

    @ManyToMany(() => Parcel, parcel => parcel.users)
    @JoinTable({name: 'user_parcel',
        joinColumn: { name: 'user_id',
             referencedColumnName: 'id',
            foreignKeyConstraintName:'user_parcel_user_id' }, // Name of the join column in the user_parcel table
        inverseJoinColumn: { name: 'parcel_id',
             referencedColumnName: 'id_parcel',
            foreignKeyConstraintName:'user_parcel_parcel_id' } // Name of the join column in the user_parcel table
    }) // Name of the join table)
    parcels: Parcel[]; // Many-to-many relationship with Parcel entity
    
}