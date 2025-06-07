import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('remunerations')
export class Remuneration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 500, nullable: false })
    description: string;

    @Column({ type: 'int', nullable: false })
    amount: number;

    @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ type: 'varchar', length: 255, nullable: false })
    employee_name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    employee_paternal_surname: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    employee_maternal_surname?: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    employee_rut: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    month: string;

    @Column({ type: 'int', nullable: false })
    year: number;

 
    @Column({ type: 'varchar', length: 255, nullable: true })
    file_path: string;


    @ManyToOne(() => User, user => user.remunerations)
    @JoinColumn({ name: 'registered_by' })
    registered_by: User;
}