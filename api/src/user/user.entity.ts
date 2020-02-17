import {
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserGroupEntity } from '../user-group/user-group.entity';

export enum UserRole {
    STUDENT = "STUDENT",
    ADMIN = "ADMIN"
}

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    username: string;

    @Column({ length: 500 })
    password: string

    @Column({ default: UserRole.STUDENT })
    userRole: UserRole

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToMany(
        () => UserGroupEntity,
        userGroup => userGroup.users,
        { eager: true, cascade: true }
    )
    userGroups: UserGroupEntity[]
}
