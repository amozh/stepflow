import {
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { WorkflowStep as WorkflowStepEntity } from "../wf-step/wf-step.entity"
import { WfStepActionExecutionEntity } from '../wf-step-action-execution/wf-step-action-execution.entity';
import { WokrflowExecution } from '../wf-executions/wf-executions.entity';

export enum WorkflowStepExecutionStatus {
    NOT_STARTED = "NOT_STARTED",
    STARTED = "STARTED",
    COMPLETE = "COMPLETE"
}

@Entity("wf-step-execution")
export class WfStepExecutionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column({ default: 0 })
    workflow_step_id: number;

    @Column({ default: 0 })
    workflow_execution_id: number;

    @Column({ type: "varchar", length: 512, default: "" }) // varchar - количество символов + байт для хранения длины
    name: string;

    @Column({ default: "" })
    description: string;

    //вся информация про тест и его правильные варианты (отдавать только те поля, которые содержат инфу, без ответов)
    @Column({ type: "json", default: null })
    input: JSON;

    @Column({ type: "json", default: null })
    state: JSON //если есть какие-то подшаги (информация про ошибки или про выполнение теста)

    @Column({ default: WorkflowStepExecutionStatus.NOT_STARTED })
    status: WorkflowStepExecutionStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @ManyToOne(
        () => WokrflowExecution,
        wfExecution => wfExecution.wfStepsExecution
    )
    wfExecution: WokrflowExecution

    @ManyToOne(
        () => WorkflowStepEntity,
        wfStep => wfStep.stepExecutions,
    )
    workFlowStep: WorkflowStepEntity;

    @OneToMany(
        () => WfStepActionExecutionEntity,
        wfStepActionExecution => wfStepActionExecution.wfStepExecution,
        { cascade: true, eager: true }
    )
    @JoinColumn()
    wfStepActionExecutions: WfStepActionExecutionEntity[]

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }
}
