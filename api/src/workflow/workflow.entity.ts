import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { WorkflowStep } from '../wf-step/wf-step.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';

@Entity()
export class Workflow {
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

  @OneToMany(
    type => WorkflowStep,
    step => step.workflow,
    { eager: true, cascade: true },
  )
  @JoinColumn()
  steps: WorkflowStep[];

  @ManyToOne(
    () => UserGroupEntity,
    userGroup => userGroup.workflows
  )
  @JoinColumn()
  userGroup?: UserGroupEntity
}
