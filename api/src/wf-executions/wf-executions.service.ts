import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WokrflowExecution, WorkflowExecutionStatus } from "./wf-executions.entity"
import { Workflow } from "../workflow/workflow.entity"
import { WfStepExecutionEntity, WorkflowStepExecutionStatus } from "../wf-step-execution/wf-step-execution.entity"
import { WfStepActionExecutionEntity as WfStepActionExecution } from "../wf-step-action-execution/wf-step-action-execution.entity"
import { WfActionExecutionEntity, WfActionType } from "../wf-action-execution/wf-action-execution.entity"
import { IWorkflowExecutionDto } from '@stepflow/shared';
const vm = require("vm")

export interface IWorkflowActionExecutionInput {
    input: any
    state?: JSON
    // status?: WorkflowExecutionStatus
}

export interface IWorkflowActionExecutionOutput {
    state: JSON
    // status: WorkflowExecutionStatus
    result: {
        isSuccess: boolean
        message: string
    }
}
@Injectable()
export class WfExecutionsService {
    constructor(
        @InjectRepository(WokrflowExecution) private readonly wfExecutionRepository: Repository<WokrflowExecution>,
        @InjectRepository(Workflow) private readonly workflowRepository: Repository<Workflow>,
        @InjectRepository(WfStepExecutionEntity)
        private readonly wfStepExecutionRepository: Repository<WfStepExecutionEntity>,
        @InjectRepository(WfStepActionExecution)
        private readonly wfStepActionExecutionRepository: Repository<WfStepActionExecution>,
        @InjectRepository(WfActionExecutionEntity)
        private readonly wWfActionExecutionRepository: Repository<WfActionExecutionEntity>
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
        const workflowExecution = new WokrflowExecution()

        // СОХРАНЕНИЕ ЭКШЕНОВ СЮДА (В ВОРКФЛОУ) И В КАЖДЫЙ СТЕП
        const executionSteps: Promise<WfStepExecutionEntity>[] = workflow.steps.map(async step => {
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
            const createdStepActions: WfStepActionExecution[] = await this.wfStepActionExecutionRepository
                .save(stepActionExecutions)
            const wfStepExecution = new WfStepExecutionEntity()
            wfStepExecution.workflow_execution_id = workflow.id
            wfStepExecution.workflow_step_id = step.id
            wfStepExecution.name = step.name
            wfStepExecution.description = step.description
            wfStepExecution.input = step.input
            wfStepExecution.wfStepActionExecutions = createdStepActions
            return wfStepExecution
        })

        const executionActions: WfActionExecutionEntity[] = workflow.actions.map(action => {
            const wfActionExecution = new WfActionExecutionEntity()
            wfActionExecution.actionId = action.id
            wfActionExecution.workflow_execution_id = workflow.id
            wfActionExecution.alias = action.alias
            wfActionExecution.name = action.name
            wfActionExecution.description = action.description
            wfActionExecution.body = action.body
            return wfActionExecution
        })

        const savedActions: WfActionExecutionEntity[] = await this.wWfActionExecutionRepository.save(executionActions)
        const savedSteps: WfStepExecutionEntity[] = await this.wfStepExecutionRepository
            .save(await Promise.all(executionSteps))
        // Запишет в Workflow input данные про все его steps
        const wfInput = await savedSteps.map(step => {
            return { stepId: step.id, stepStatus: step.status, state: step.state, input: step.input }
        })
        workflowExecution.name = workflow.name
        workflowExecution.description = workflow.description
        workflowExecution.input = JSON.parse(JSON.stringify(wfInput))
        workflowExecution.workflow_id = workflowId
        workflowExecution.wfStepsExecution = savedSteps
        workflowExecution.wfActionsExecution = savedActions

        return await this.wfExecutionRepository.save(workflowExecution)
    }

    async updateWfExecution(wfExecutionId: number, body?: any, wfStepExecutionId?: number): Promise<void> {
        const executedWf = await this.wfExecutionRepository.findOne(wfExecutionId)
        let stateResult: JSON
        if (body && wfStepExecutionId) {
            stateResult = {
                ...executedWf.state,
                ["stepId_" + wfStepExecutionId]: body
            }
        }

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

    async startWfExecution(id: number, body: any): Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const input = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        // const status = wfExecution.status;
        input["submittedAnswer"] = body.submittedAnswer

        const onSubmitActions = actions.filter(a => a.actionType === WfActionType.ON_START);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    // status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                // const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
                    state: prevState,
                    // status: prevStatus
                }
            }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IWorkflowActionExecutionOutput[]));

        const failedActions: IWorkflowActionExecutionOutput[] = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        // const finalStatus = outputs[outputs.length - 1].status;

        // await this.wfStepExecutionRepository.update(id, { state: finalState })
        await this.updateWfExecution(id, finalState)
        return { finalState, failedActions }
    }

    async completeWfExecution(id: number, body: any): Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const input = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        // const status = wfExecution.status;
        input["submittedAnswer"] = body.submittedAnswer

        const onSubmitActions = actions.filter(a => a.actionType === WfActionType.ON_COMPLETE);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    // status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                // const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
                    state: prevState,
                    // status: prevStatus
                }
            }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IWorkflowActionExecutionOutput[]));

        const failedActions: IWorkflowActionExecutionOutput[] = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        // const finalStatus = outputs[outputs.length - 1].status;

        // await this.wfStepExecutionRepository.update(id, { state: finalState })
        await this.updateWfExecution(id, finalState)
        return { finalState, failedActions }
    }

    async submitWfExecution(id: number, body: any): Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const input = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        // const status = wfExecution.status;
        input["submittedAnswer"] = body.submittedAnswer

        const onSubmitActions = actions.filter(a => a.actionType === WfActionType.ON_SUBMIT);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    // status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                // const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
                    state: prevState,
                    // status: prevStatus
                }
            }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IWorkflowActionExecutionOutput[]));

        const failedActions: IWorkflowActionExecutionOutput[] = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        // const finalStatus = outputs[outputs.length - 1].status;

        // await this.wfStepExecutionRepository.update(id, { state: finalState })
        await this.updateWfExecution(id, finalState)
        return { finalState, failedActions }
    }

    async executeCustomWfAction(id: number, actionAlias: string, actionsInput: IWorkflowActionExecutionInput):
        Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const input = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        // const status = wfExecution.status;
        input["submittedAnswer"] = actionsInput.input.submittedAnswer

        const onSubmitActions = actions.filter(a => a.alias === actionAlias);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    // status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                // const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
                    state: prevState,
                    // status: prevStatus
                }
            }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IWorkflowActionExecutionOutput[]));

        const failedActions: IWorkflowActionExecutionOutput[] = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        await this.updateWfExecution(wfExecution.id, finalState)
        return { finalState, failedActions }
    }

    private async executeAction(input: IWorkflowActionExecutionInput, action: string)
        : Promise<IWorkflowActionExecutionOutput> {
        let output: IWorkflowActionExecutionOutput;
        // Переделать эту логику. Здесь данные захардкожены
        input.input = {
            a: 5,
            b: 7,
            h: 4
        }
        try {
            const script = new vm.Script(`${action}`);
            const context = vm.createContext(input.input);
            await script.runInContext(context);
            output = {
                state: context,
                result: {
                    isSuccess: true,
                    message: "You gave an answer"
                }
            }
        } catch (e) {
            console.error(`Failed to execute action ${action} with input ${JSON.stringify(input)}`, e);
            output = {
                state: input.state,
                result: {
                    isSuccess: false,
                    message: e.message || e + ""
                }
            }
        }
        return output
    }
}
