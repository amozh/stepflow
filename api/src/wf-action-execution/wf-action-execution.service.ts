import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfActionExecutionEntity } from "./wf-action-execution.entity"
import { WfStepActionExecutionEntity as WfStepActionExecution } from "../wf-step-action-execution/wf-step-action-execution.entity"
import { ActionEntity } from "../action/action.entity"

@Injectable()
export class WfActionExecutionService {
    constructor(
        // @InjectRepository(WfActionExecutionEntity)
        // private readonly wfActionExecutionRepository: Repository<WfActionExecutionEntity>,
        // @InjectRepository(WfStepActionExecution)
        // private readonly wfStepActionExecutionRepository: Repository<WfStepActionExecution>,
    ) { }

    createWfStepActionExecution(action: ActionEntity, preWfStepExecutionId: number): WfStepActionExecution {
        const wfStepActionExecution = new WfStepActionExecution()
        wfStepActionExecution.actionId = action.id
        wfStepActionExecution.workflow_step_execution_id = preWfStepExecutionId
        wfStepActionExecution.alias = `Alias: ${Math.floor(Math.random() * 1000)}`
        wfStepActionExecution.actionType = action.actionType
        wfStepActionExecution.name = action.name
        wfStepActionExecution.description = action.description
        wfStepActionExecution.body = action.body
        return wfStepActionExecution
    }

    createWfActionExecution(action: ActionEntity, preWorkflowExecutionId: number): WfActionExecutionEntity {
        const wfActionExecution = new WfActionExecutionEntity()
        wfActionExecution.actionId = action.id
        wfActionExecution.workflow_execution_id = preWorkflowExecutionId
        wfActionExecution.alias = action.alias
        wfActionExecution.name = action.name
        wfActionExecution.description = action.description
        wfActionExecution.body = action.body
        return wfActionExecution
    }
}
