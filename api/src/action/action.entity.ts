
import {
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToMany,
    Unique,
    OneToMany,
} from 'typeorm';

import { WorkflowStep } from '../wf-step/wf-step.entity';
import { Workflow as WorkflowEntity } from "../workflow/workflow.entity"
import { WfActionExecutionEntity } from "../wf-action-execution/wf-action-execution.entity";
import { WfStepActionExecutionEntity } from '../wf-step-action-execution/wf-step-action-execution.entity';

export enum ActionType {
    ON_START = "ON_START",
    ON_SUBMIT = "ON_SUBMIT",
    ON_COMPLETE = "ON_COMPLETE",
    CUSTOM = "CUSTOM"
}

@Entity("action")
export class ActionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({ type: "text" })
    body: string;

    @Unique(["alias"])
    @Column({ type: "varchar", length: 512 })
    alias: string;

    @Column({ default: ActionType.ON_START })
    actionType: ActionType
    // Нужно переделать логику ActionType. Он должен добавляться здесь, а не в Action Executed

    // @Unique(["version"])
    // @Column({ type: "varchar", length: 512 })
    // version?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @ManyToMany(
        () => WorkflowEntity,
        workflow => workflow.actions,
        { onDelete: "CASCADE" }
    )
    workflows: WorkflowEntity[]

    @ManyToMany(
        () => WorkflowStep,
        workFlowStep => workFlowStep.actions,
        { onDelete: "CASCADE" }
    )
    workFlowSteps: WorkflowStep[]

    @OneToMany(
        () => WfActionExecutionEntity,
        wfActionExecution => wfActionExecution.action,
        { cascade: true }
    )
    @JoinColumn()
    wfActionExecutions: WfActionExecutionEntity[]

    @OneToMany(
        () => WfStepActionExecutionEntity,
        wfStepActionExecution => wfStepActionExecution.action,
        { cascade: true }
    )
    @JoinColumn()
    wfStepActionExecutions: WfStepActionExecutionEntity[]

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
}
