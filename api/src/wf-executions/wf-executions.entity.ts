
import {
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Workflow } from "../workflow/workflow.entity";
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"

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

  @Column()
  workflow_id: number;

  @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
  name: string;

  @Column({ length: 500 })
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
  )
  workflow: Workflow;

  @OneToMany(
    () => WfStepExecutionEntity,
    wfStepExecution => wfStepExecution.wfExecution,
    { cascade: true, eager: true }
  )
  @JoinColumn()
  wfStepsExecution: WfStepExecutionEntity[]

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}