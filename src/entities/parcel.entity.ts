import { Entity, Column, PrimaryGeneratedColumn , OneToMany} from 'typeorm';

@Entity('parcel')
export class Parcel {
    @PrimaryGeneratedColumn()
    id_parcel: number;
    @Column({ type: 'varchar', length: 255 })
    numero_parcela: string;
}