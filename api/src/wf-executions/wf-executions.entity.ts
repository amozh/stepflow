
import {
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Workflow } from "../workflow/workflow.entity";
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"
import { WfActionExecutionEntity } from "../wf-action-execution/wf-action-execution.entity"

export enum WorkflowExecutionStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  COMPLETE = "COMPLETE"
}

export const type = new Object()

@Entity("wf-execution")
export class WokrflowExecution {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ default: 0 })
  workflow_id: number;

  @Column({ type: "varchar", length: 512, default: "" }) // varchar - количество символов + байт для хранения длины
  name: string;

  @Column({ length: 500, default: "" })
  description: string;

  @Column({ type: "json", default: null })
  input: JSON

  @Column({ type: "json", default: null })
  state: JSON

  @Column({ default: WorkflowExecutionStatus.NOT_STARTED })
  status: WorkflowExecutionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(
    () => Workflow,
    wf => wf.wfExecutions,
    { onDelete: "CASCADE" }
  )
  workflow: Workflow;

  @OneToMany(
    () => WfStepExecutionEntity,
    wfStepExecution => wfStepExecution.wfExecution,
    { eager: true }
  )
  @JoinColumn()
  wfStepsExecution: WfStepExecutionEntity[]

  @OneToMany(
    () => WfActionExecutionEntity,
    wfActionExecution => wfActionExecution.wfExecution,
    { eager: true }
  )
  @JoinColumn()
  wfActionsExecution: WfActionExecutionEntity[]

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
