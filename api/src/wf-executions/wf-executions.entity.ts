
import {
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Workflow } from "../workflow/workflow.entity";

export enum Status {
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
  workflow_id: string;

  @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ type: "json", default: null })
  input: JSON

  @Column({ type: "json", default: null })
  state: JSON

  @Column({ default: Status.NOT_STARTED })
  status: Status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(
    type => Workflow,
    wf => wf.wfExecutions,
  )
  workflow: Workflow;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
