import { WokrflowExecution } from './../wf-executions/wf-executions.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne, ManyToMany, JoinTable,
} from 'typeorm';
import { WorkflowStep } from '../wf-step/wf-step.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';
import { ActionEntity } from "../action/action.entity"

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ type: "json", default: null })
  input: JSON

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(
    () => WorkflowStep,
    step => step.workflow,
    { eager: true, cascade: true },
  )
  @JoinColumn()
  steps: WorkflowStep[];

  @ManyToMany(
    () => UserGroupEntity,
    userGroup => userGroup.workflows
  )
  @JoinTable()
  userGroups: UserGroupEntity[];

  @ManyToMany(
    () => ActionEntity,
    action => action.workflows,
    { cascade: true, eager: true }
  )
  @JoinTable()
  actions: ActionEntity[]

  @OneToMany(
    () => WokrflowExecution,
    execution => execution.workflow,
    { cascade: true, eager: true }
  )
  @JoinColumn()
  wfExecutions: WokrflowExecution[]

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
