import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  JoinColumn
} from 'typeorm';
import { Workflow } from '../workflow/workflow.entity';
import { Answer } from '../answer/answer.entity';

@Entity()
// @Tree("nested-set")
export class WorkflowStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToOne(
    type => Workflow,
    wf => wf.steps,
  )
  workflow: Workflow;


  @OneToOne(
    type => Answer,
    answ => answ.workFlowStep,
    { eager: false, cascade: true }
  )
  answer: Answer

}
