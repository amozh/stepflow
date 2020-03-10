import {
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { ActionEntity } from "../action/action.entity"

export enum Status {
    EXECUTED = "EXECUTED",
    NOT_EXECUTED = "NOT_EXECUTED"
}

@Entity("wf-step-action-execution")
export class WfStepActionExecutionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column()
    handler_id: string;

    @Column()
    workflow_step_execution_id: string;

    @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
    alias: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    body: string;

    @Column({ default: Status.NOT_EXECUTED })
    status: Status;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToOne(
        () => ActionEntity,
        action => action.wfStepActionExecutions
    )
    action: ActionEntity
}
