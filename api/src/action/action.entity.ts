
import {
    BeforeUpdate,
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToMany,
    Unique,
    Index,
    OneToMany,
    PrimaryColumn,
    Generated
} from 'typeorm';

import { WorkflowStep } from '../wf-step/wf-step.entity';
import { Workflow as WorkflowEntity } from "../workflow/workflow.entity"
import { WfActionExecutionEntity } from "../wf-action-execution/wf-action-execution.entity";
import { WfStepActionExecutionEntity } from '../wf-step-action-execution/wf-step-action-execution.entity';


@Entity("action")
// @Unique(['alias'])
export class ActionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({ type: "text" })
    body: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToMany(
        () => WorkflowEntity,
        workflow => workflow.actions,
    )
    workflows: WorkflowEntity[]

    @ManyToMany(
        () => WorkflowStep,
        workFlowStep => workFlowStep.actions,
    )
    workFlowSteps: WorkflowStep[]

    @OneToMany(
        () => WfActionExecutionEntity,
        wfActionExecution => wfActionExecution.action,
        { cascade: true, eager: true }
    )
    @JoinColumn()
    wfActionExecutions: WfActionExecutionEntity[]

    @OneToMany(
        () => WfStepActionExecutionEntity,
        wfStepActionExecution => wfStepActionExecution.action,
        { cascade: true, eager: true }
    )
    @JoinColumn()
    wfStepActionExecutions: WfStepActionExecutionEntity[]
}
