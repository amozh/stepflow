
import {
    BeforeUpdate,
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToMany,
    Unique,
    Index
} from 'typeorm';

import { WorkflowStep } from '../wf-step/wf-step.entity';
import { Workflow as WorkflowEntity } from "../workflow/workflow.entity"


@Entity("action")
export class ActionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({ length: 500 })
    body: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToMany(
        () => WorkflowEntity,
        workflow => workflow.action,
    )
    workflows: WorkflowEntity[]

    @ManyToMany(
        () => WorkflowStep,
        workFlowStep => workFlowStep.action,
    )
    workFlowStep: WorkflowStep[]
}
