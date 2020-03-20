import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepActionExecutionEntity } from './wf-step-action-execution.entity';
import { ActionEntity } from "../action/action.entity"

@Injectable()
export class WfStepActionExecutionService {
    constructor(
        @InjectRepository(WfStepActionExecutionEntity)
        private readonly wfStepActionExecution: Repository<WfStepActionExecutionEntity>,
        @InjectRepository(ActionEntity)
        private readonly actionRepository: Repository<ActionEntity>,
    ) { }

    getWfStepActionExecution(): string {
        return "Workflow step action execution"
    }

    async createStepActionExecution(body: { actionId: string, wfStepExecutionId: number }): Promise<any> {
        const { actionId, wfStepExecutionId } = body
        const action = await this.actionRepository.findOne({ id: actionId })

        const stepActionExecution = new WfStepActionExecutionEntity()
        stepActionExecution.actionId = actionId
        stepActionExecution.workflow_step_execution_id = wfStepExecutionId
        stepActionExecution.alias = "Area action"
        stepActionExecution.name = action.name
        stepActionExecution.description = action.description
        stepActionExecution.body = action.body

        return this.wfStepActionExecution.save(stepActionExecution)
    }
}
