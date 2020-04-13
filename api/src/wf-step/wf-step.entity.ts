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
import { Workflow } from '../workflow/workflow.entity';
import { ActionEntity } from "../action/action.entity"
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"

@Entity("wf-step")
export class WorkflowStep {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @Column({ type: "json", default: null })
  input: JSON

  @ManyToOne(
    () => Workflow,
    wf => wf.steps,
  )
  workflow: Workflow;

  @ManyToMany(
    () => ActionEntity,
    action => action.workFlowSteps,
    { eager: true, cascade: true }
  )
  @JoinTable()
  actions: ActionEntity[]

  @OneToMany(
    () => WfStepExecutionEntity,
    stExecution => stExecution.workFlowStep,
    { cascade: true, eager: true }
  )
  @JoinColumn()
  stepExecutions: WfStepExecutionEntity[]

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
