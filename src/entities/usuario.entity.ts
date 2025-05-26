import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 255 })
    nombre: string;
    
    @Column({ type: 'varchar', length: 255 })
    apellido_paterno: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    apellido_materno: string;
    
    @Column({ type: 'varchar', length: 255 })
    correo: string;
    
    @Column({ type: 'int', nullable: true })
    telefono: number;

    @Column({ type: 'varchar', length: 15, unique: true })
    rut: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}