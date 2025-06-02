import { Entity, Column, PrimaryGeneratedColumn , OneToMany,ManyToOne, Unique} from 'typeorm';
import { Parcel } from './parcel.entity';
import { MeterReading } from './meterReading.entity';
import { User } from './user.entity';

@Entity('admin-expenses')
export class AdminExpenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    desc: string;
    
    @Column({ type: 'float', default: '0' })
    amount: number;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => User, user => user.adminExprenses)
    user: User;   
    
    
}