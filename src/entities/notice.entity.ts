import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Voting } from './voting.entity';
import { VoteOption } from './vote_option.entity';

@Entity('notices')
export class Notice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;

    @Column({ type: 'boolean', default: false })
    visible: boolean;

    @ManyToOne(() => User, user => user.notices)
    @JoinColumn({ name: 'uploaded_by' })
    uploadedBy: User;
}