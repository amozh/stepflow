import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WokrflowExecution } from "./wf-executions.entity"
import { Workflow } from "../workflow/workflow.entity"
import { WfStepExecutionEntity, WorkflowStepExecutionStatus } from "../wf-step-execution/wf-step-execution.entity"
import { WfStepActionExecutionEntity as WfStepActionExecution } from "../wf-step-action-execution/wf-step-action-execution.entity"
import { WorkflowExecutionStatus } from "../wf-executions/wf-executions.entity"
import { IWorkflowExecutionDto } from '@stepflow/shared';

@Injectable()
export class WfExecutionsService {
    constructor(
        @InjectRepository(WokrflowExecution) private readonly wfExecutionRepository: Repository<WokrflowExecution>,
        @InjectRepository(Workflow) private readonly workflowRepository: Repository<Workflow>,
        @InjectRepository(WfStepExecutionEntity) private readonly wfStepExecutionRepository: Repository<WfStepExecutionEntity>,
        @InjectRepository(WfStepActionExecution) private readonly wfStepActionExecutionRepository: Repository<WfStepActionExecution>
    ) { }

    async getWfExecution(id: number): Promise<IWorkflowExecutionDto> {
        try {
            return await this.wfExecutionRepository.findOne(id)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async createWfExecution(workflowId: number): Promise<IWorkflowExecutionDto> {
        const workflow = await this.workflowRepository.findOne({ id: workflowId })

        // TODO: Try to use const where variable is not changed
        let workflowExecution = new WokrflowExecution()

        // СОХРАНЕНИЕ ЭКШЕНОВ СЮДА (В ВОРКФЛОУ) И В КАЖДЫЙ СТЕП
        let executionSteps: Promise<WfStepExecutionEntity>[] = workflow.steps.map(async step => {
            const stepActionExecutions: WfStepActionExecution[] = step.actions.map(action => {
                const wfStepActionExecution = new WfStepActionExecution()
                wfStepActionExecution.actionId = action.id
                wfStepActionExecution.workflow_step_execution_id = step.id
                wfStepActionExecution.alias = `Alias: ${Math.floor(Math.random() * 1000)}`
                wfStepActionExecution.name = action.name
                wfStepActionExecution.description = action.description
                wfStepActionExecution.body = action.body
                return wfStepActionExecution
            })
            const createdStepActions: WfStepActionExecution[] = await this.wfStepActionExecutionRepository.save(stepActionExecutions)
            const wfStepExecution = new WfStepExecutionEntity()
            wfStepExecution.workflow_execution_id = workflow.id
            wfStepExecution.workflow_step_id = step.id
            wfStepExecution.name = step.name
            wfStepExecution.description = step.description
            wfStepExecution.input = step.input
            wfStepExecution.wfStepActionExecutions = createdStepActions
            return wfStepExecution
        })

        const savedSteps: WfStepExecutionEntity[] = await this.wfStepExecutionRepository.save(await Promise.all(executionSteps))
        // Запишет в Workflow input данные про все его steps
        const wfInput = await savedSteps.map(step => {
            return { stepId: step.id, stepStatus: step.status, state: step.state, input: step.input }
        })
        workflowExecution.name = workflow.name
        workflowExecution.description = workflow.description
        workflowExecution.input = JSON.parse(JSON.stringify(wfInput))
        workflowExecution.workflow_id = workflowId
        workflowExecution.wfStepsExecution = savedSteps

        return await this.wfExecutionRepository.save(workflowExecution)
    }

    async updateWfExecution(wfExecutionId: number, body?: any, wfStepExecutionId?: number): Promise<void> {
        const executedWf = await this.wfExecutionRepository.findOne(wfExecutionId)
        // console.log(wfStepExecutionId, "wfStepExecutionId????????")
        // console.log(body, "body")

        let stateResult: JSON
        if (body && wfStepExecutionId) {
            stateResult = {
                ...executedWf.state,
                ["stepId_" + wfStepExecutionId]: body
            }
        }
        // console.log(stateResult, "stateResult???")
        // relations: ["wfStepsExecution"],
        // // join: { alias: "wfExecutions", innerJoin: { wfStepsExecution: "wfExecutions.wfStepsExecution" } },
        // where: qb => {
        //     qb.where({
        //         id: 2
        //     })
        // }
        // where:{
        //     wfStepsExecution
        // }
        // where: {

        //     // wfStepsExecution: { id: 4 },
        //     // relations: ["wfStepsExecution"]
        // }


        // console.log(executedWf, "executedWf")
        // const executedWf = await this.wfExecutionRepository.findOne(id)
        //
        // let stateResult: JSON
        // if (body) {
        //     stateResult = body
        // }

        let updatedStatus: WorkflowExecutionStatus
        switch (executedWf.status) {
            case WorkflowExecutionStatus.NOT_STARTED:
                updatedStatus = WorkflowExecutionStatus.STARTED
                break
            case WorkflowExecutionStatus.STARTED:
                if (Object.values(executedWf.input)
                    .length === executedWf.wfStepsExecution
                        .filter(e => e.status === WorkflowStepExecutionStatus.COMPLETE).length) {
                    updatedStatus = WorkflowExecutionStatus.COMPLETE
                    break;
                }
            default:
                updatedStatus = executedWf.status
                break;
        }
        await this.wfExecutionRepository.update(wfExecutionId, { status: updatedStatus, state: stateResult })
    }
}
