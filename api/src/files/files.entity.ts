import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('files')
export class FilesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    originalName: string

    @Column('text')
    currentName: string

    @Column('int')
    size: Partial<number>

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;
}
