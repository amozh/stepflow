import {
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { WorkflowStep as WorkflowStepEntity } from "../wf-step/wf-step.entity"

export enum Status {
    NOT_STARTED = "NOT_STARTED",
    STARTED = "STARTED",
    COMPLETE = "COMPLETE"
}


@Entity("wf-step-execution")
export class WfStepExecutionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column()
    workflow_step_id: string;

    @Column()
    workflow_execution_id: string;

    @Column({ type: "varchar", length: 512 }) // varchar - количество символов + байт для хранения длины
    name: string;

    @Column()
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

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    @ManyToOne(
        () => WorkflowStepEntity,
        wfStep => wfStep.stepExecutions,
    )
    workFlowStep: WorkflowStepEntity;
}
