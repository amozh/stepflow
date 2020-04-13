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
    workflowInput: any
    submittedData?: any
    state?: JSON
}

export interface IWorkflowActionExecutionOutput {
    state: JSON
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

    async getAllWfExecution(): Promise<IWorkflowExecutionDto[]> {
        try {
            return await this.wfExecutionRepository.find()
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }
    async getWfExecution(id: number): Promise<IWorkflowExecutionDto> {
        try {
            return await this.wfExecutionRepository.findOne(id)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async createWfExecution(workflowId: number): Promise<IWorkflowExecutionDto> {
        const workflow = await this.workflowRepository.findOne({ id: workflowId })

        const workflowExecution = new WokrflowExecution()
        const preWorkflowExecution = await this.wfExecutionRepository.save(workflowExecution)

        const executionSteps: Promise<WfStepExecutionEntity[]> = workflow.steps.map(async step => {
            const wfStepExecution = new WfStepExecutionEntity()
            // Сохранение степа в самом начале нужно для того, чтобы использовать wfStepExecution.id в wfStepExecution
            const preWfStepExecution = await this.wfStepExecutionRepository.save(wfStepExecution)
            const stepActionExecutions: WfStepActionExecution[] = step.actions.map(action => {
                const wfStepActionExecution = new WfStepActionExecution()
                wfStepActionExecution.actionId = action.id
                wfStepActionExecution.workflow_step_execution_id = preWfStepExecution.id
                wfStepActionExecution.alias = `Alias: ${Math.floor(Math.random() * 1000)}`
                wfStepActionExecution.actionType = action.actionType
                wfStepActionExecution.name = action.name
                wfStepActionExecution.description = action.description
                wfStepActionExecution.body = action.body
                return wfStepActionExecution
            })
            const createdStepActions: WfStepActionExecution[] = await this.wfStepActionExecutionRepository
                .save(stepActionExecutions)
            wfStepExecution.workflow_execution_id = preWorkflowExecution.id
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
            wfActionExecution.workflow_execution_id = preWorkflowExecution.id
            wfActionExecution.alias = action.alias
            wfActionExecution.name = action.name
            wfActionExecution.description = action.description
            wfActionExecution.body = action.body
            return wfActionExecution
        })

        const savedActions: WfActionExecutionEntity[] = await this.wWfActionExecutionRepository.save(executionActions)
        const savedSteps: WfStepExecutionEntity[] = await this.wfStepExecutionRepository
            .save(await Promise.all(executionSteps))

        workflowExecution.name = workflow.name
        workflowExecution.description = workflow.description
        workflowExecution.input = workflow.input
        workflowExecution.workflow_id = workflowId
        workflowExecution.wfStepsExecution = savedSteps
        workflowExecution.wfActionsExecution = savedActions

        return await this.wfExecutionRepository.save(workflowExecution)
    }

    // async updateWfExecution(wfExecutionId: number, body?: any, wfStepExecutionId?: number): Promise<void> {
    //     const executedWf = await this.wfExecutionRepository.findOne(wfExecutionId)
    //     let stateResult: JSON
    //     if (body && wfStepExecutionId) {
    //         stateResult = {
    //             ...executedWf.state,
    //             ["stepId_" + wfStepExecutionId]: body
    //         }
    //     }

    //     let updatedStatus: WorkflowExecutionStatus
    //     switch (executedWf.status) {
    //         case WorkflowExecutionStatus.NOT_STARTED:
    //             updatedStatus = WorkflowExecutionStatus.STARTED
    //             break
    //         case WorkflowExecutionStatus.STARTED:
    //             if (Object.values(executedWf.input)
    //                 .length === executedWf.wfStepsExecution
    //                     .filter(e => e.status === WorkflowStepExecutionStatus.COMPLETE).length) {
    //                 updatedStatus = WorkflowExecutionStatus.COMPLETE
    //                 break;
    //             }
    //         default:
    //             updatedStatus = executedWf.status
    //             break;
    //     }
    //     await this.wfExecutionRepository.update(wfExecutionId, { status: updatedStatus, state: stateResult })
    // }

    async startWfExecution(id: number, body: any): Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const workflowInput = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;

        const onSubmitActions = actions.filter(a => a.actionType === WfActionType.ON_START);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    workflowInput,
                    state
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                actionInput = {
                    workflowInput,
                    state: prevState,
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
        await this.wfExecutionRepository.update(id, { state: finalState })
        return { finalState, failedActions }
    }

    async completeWfExecution(id: number, body: any): Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const workflowInput = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        const submittedData = body;

        const onSubmitActions = actions.filter(a => a.actionType === WfActionType.ON_COMPLETE);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    workflowInput,
                    submittedData,
                    state
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                actionInput = {
                    workflowInput,
                    submittedData,
                    state: prevState,
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
        await this.wfExecutionRepository.update(id, { state: finalState })
        return { finalState, failedActions }
    }

    async submitWfExecution(id: number, body: any): Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const workflowInput = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        const submittedData = body;

        const onSubmitActions = actions.filter(a => a.actionType === WfActionType.ON_SUBMIT);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    workflowInput,
                    submittedData,
                    state
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                actionInput = {
                    workflowInput,
                    submittedData,
                    state: prevState,
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
        await this.wfExecutionRepository.update(id, { state: finalState })
        return { finalState, failedActions }
    }

    async executeCustomWfAction(id: number, actionAlias: string, actionsInput: IWorkflowActionExecutionInput):
        Promise<any> {
        const wfExecution = await this.wfExecutionRepository.findOne(id)
        const workflowInput = wfExecution.input;
        const state = wfExecution.state;
        const actions = wfExecution.wfActionsExecution;
        const submittedData = actionsInput;

        const onSubmitActions = actions.filter(a => a.alias === actionAlias);
        const outputs: IWorkflowActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IWorkflowActionExecutionOutput[] = await actionOutputs;

            let actionInput: IWorkflowActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    workflowInput,
                    submittedData,
                    state
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                actionInput = {
                    workflowInput,
                    submittedData,
                    state: prevState,
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
        await this.wfExecutionRepository.update(id, { state: finalState })
        return { finalState, failedActions }
    }

    private async executeAction(input: IWorkflowActionExecutionInput, action: string)
        : Promise<IWorkflowActionExecutionOutput> {
        let output: IWorkflowActionExecutionOutput;
        try {
            const script = new vm.Script(`${action}`);
            const context = vm.createContext({
                currentState: input.state,
                workflowInput: input.workflowInput,
                submittedData: input.submittedData
            });
            const result = await script.runInContext(context);
            output = {
                state: result,
                result: {
                    isSuccess: true,
                    message: "You gave an answer"
                }
            }
        } catch (e) {
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
