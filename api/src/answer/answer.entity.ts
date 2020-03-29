import {
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';

import { WorkflowStep } from '../wf-step/wf-step.entity';
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  answer: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToOne(
    type => WorkflowStep,
    workFlowStep => workFlowStep.answer,
  )
  @JoinColumn()
  workFlowStep: WorkflowStep

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
