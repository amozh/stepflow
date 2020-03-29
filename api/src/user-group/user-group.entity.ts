import { Workflow } from './../workflow/workflow.entity';
import { UserEntity } from './../user/user.entity';
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

@Entity('user-group')
export class UserGroupEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    groupName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToMany(
        () => UserEntity,
        user => user.userGroups,
        { cascade: true }
    )
    @JoinTable()
    users: UserEntity[]

    @ManyToMany(
        type => Workflow,
        workflow => workflow.userGroups,
        { eager: true, cascade: true }
    )
    workflows: Workflow[]
}
