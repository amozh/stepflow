import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Workflow } from '../workflow/workflow.entity';

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

  // @TreeChildren()
  // steps: WorkflowStep[];
  //
  // @TreeParent()
  // parent: WorkflowStep;
}
