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
import { WokrflowExecution } from '../wf-executions/wf-executions.entity';

export enum WokrflowActionExecutionStatus {
    EXECUTED = "EXECUTED",
    NOT_EXECUTED = "NOT_EXECUTED"
}

export enum WfActionType {
    ON_START = "ON_START",
    ON_SUBMIT = "ON_SUBMIT",
    ON_COMPLETE = "ON_COMPLETE",
    CUSTOM = "CUSTOM"
}

@Entity("wf-action-execution")
export class WfActionExecutionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column()
    actionId: string;

    @Column()
    workflow_execution_id: number;

    @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
    alias: string;

    @Column({ default: WfActionType.ON_START })
    actionType: WfActionType

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

    @ManyToOne(
        () => WokrflowExecution,
        wfExecution => wfExecution.wfActionsExecution
    )
    wfExecution: WokrflowExecution

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
}
