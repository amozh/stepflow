import {
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    Unique
} from 'typeorm';
import { ActionEntity } from "../action/action.entity"
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"

export enum WorkflowStepActionExecutionStatus {
    EXECUTED = "EXECUTED",
    NOT_EXECUTED = "NOT_EXECUTED"
}

@Entity("wf-step-action-execution")
@Unique(['alias'])
export class WfStepActionExecutionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column()
    actionId: string;

    @Column()
    workflow_step_execution_id: number;

    @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
    alias: string;
    
    actionType: "onStart" | "onSubmit" | "onComplete" | "custom";

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    body: string;

    @Column({ default: WorkflowStepActionExecutionStatus.NOT_EXECUTED })
    status: WorkflowStepActionExecutionStatus;

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

    @ManyToOne(
        () => WfStepExecutionEntity,
        wfStepExecution => wfStepExecution.wfStepActionExecutions
    )
    wfStepExecution: WfStepExecutionEntity
}
