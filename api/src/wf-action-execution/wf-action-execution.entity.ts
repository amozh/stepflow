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

export enum WokrflowActionExecutionStatus {
    EXECUTED = "EXECUTED",
    NOT_EXECUTED = "NOT_EXECUTED"
}


@Entity("wf-action-execution")
export class WfActionExecutionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column()
    actionId: number;

    @Column()
    workflow_execution_id: string;

    @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
    alias: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: "text" })
    body: string;

    @Column({ default: WokrflowActionExecutionStatus.NOT_EXECUTED })
    status: WokrflowActionExecutionStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @ManyToOne(
        () => ActionEntity,
        action => action.wfActionExecutions
    )
    action: ActionEntity

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
}
