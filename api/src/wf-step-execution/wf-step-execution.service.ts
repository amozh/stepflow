import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepExecutionEntity, WorkflowStepExecutionStatus } from "./wf-step-execution.entity"
import { WfExecutionsService } from "../wf-executions/wf-executions.service"
import { ActionType } from "../wf-step-action-execution/wf-step-action-execution.entity"
import { WorkflowStep } from "../wf-step/wf-step.entity"
import { WokrflowExecution } from "../wf-executions/wf-executions.entity"
import * as vm from "vm"
// const vm = require("vm")

export interface IStepActionExecutionInput {
    stepInput: any,
    workflowInput: any,
    submittedData?: any,
    state?: JSON
    status?: WorkflowStepExecutionStatus
}

export interface IStepActionExecutionOutput {
    state: JSON
    status?: WorkflowStepExecutionStatus
    result: {
        isSuccess: boolean
        message: string
    }
}

@Injectable()
export class WfStepExecutionService {
    constructor(
        @InjectRepository(WfStepExecutionEntity)
        private readonly wfStepExecutionRepository: Repository<WfStepExecutionEntity>,
        @InjectRepository(WokrflowExecution)
        private readonly wfExecutionRepository: Repository<WokrflowExecution>,
        // private readonly workflowStepRepository: Repository<WorkflowStep>, //достучаться до парента
        private readonly wfExecutionsService: WfExecutionsService,
    ) { }

    async findSubStepsExecution(stepExecutionId: number): Promise<WfStepExecutionEntity[]> {
        return await this.wfStepExecutionRepository.find({ parent: stepExecutionId })
    }

    async startWfStepExecution(id: number, body?: any): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const workflowExecution = await this.wfExecutionsService.getWfExecution(stepExecution.workflow_execution_id)
        const stepInput = stepExecution.input;
        const workflowInput = workflowExecution.input
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;

        const onStartActions = actions.filter(a => a.actionType === ActionType.ON_START);
        const outputs: IStepActionExecutionOutput[] = await onStartActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;

            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    stepInput,
                    workflowInput,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    stepInput,
                    workflowInput,
                    state: prevState,
                    status: prevStatus
                }
            }
            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IStepActionExecutionOutput[]));

        const failedActions: IStepActionExecutionOutput[] | string = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        const finalStatus = outputs[outputs.length - 1].status; //
        await this.wfStepExecutionRepository.update(id, { status: finalStatus, state: finalState })

        const updatedWorkflowExecution = await this.wfExecutionsService
            .getWfExecution(stepExecution.workflow_execution_id)
        const stepsState = this.getWfExecutionStepsState(updatedWorkflowExecution.wfStepsExecution)
        await this.wfExecutionRepository.update(workflowExecution.id, { state: { ...state, stepsState } })

        return { finalState, finalStatus, failedActions }
    }

    async submitWfStepExecution(id: number, body: any): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const workflowExecution = await this.wfExecutionsService.getWfExecution(stepExecution.workflow_execution_id)
        const stepInput = stepExecution.input;
        const workflowInput = workflowExecution.input
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        const submittedData = body

        const onSubmitActions = actions.filter(a => a.actionType === ActionType.ON_SUBMIT);

        // Выполнит отфильтрованные функции
        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;

            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    stepInput,
                    workflowInput,
                    submittedData,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    stepInput,
                    workflowInput,
                    submittedData,
                    state: prevState,
                    status: prevStatus
                }
            }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IStepActionExecutionOutput[]));

        const failedActions: IStepActionExecutionOutput[] = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        const finalStatus = outputs[outputs.length - 1].status;
        await this.wfStepExecutionRepository.update(id, { status: finalStatus, state: finalState })

        const updatedWorkflowExecution = await this.wfExecutionsService
            .getWfExecution(stepExecution.workflow_execution_id)
        const stepsState = this.getWfExecutionStepsState(updatedWorkflowExecution.wfStepsExecution)
        await this.wfExecutionRepository.update(workflowExecution.id, { state: { ...state, stepsState } })

        return { finalState, finalStatus, failedActions }
    }

    async completeWfStepExecution(id: number, body: any): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const workflowExecution = await this.wfExecutionsService.getWfExecution(stepExecution.workflow_execution_id)
        const stepInput = stepExecution.input;
        const workflowInput = workflowExecution.input
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        const submittedData = body;

        const onSubmitActions = actions.filter(a => a.actionType === ActionType.ON_COMPLETE);
        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;

            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    stepInput,
                    workflowInput,
                    submittedData,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    stepInput,
                    workflowInput,
                    submittedData,
                    state: prevState,
                    status: prevStatus
                }
            }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IStepActionExecutionOutput[]));

        const failedActions: IStepActionExecutionOutput[] | string = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        const finalStatus = outputs[outputs.length - 1].status;
        await this.wfStepExecutionRepository.update(id, { status: finalStatus, state: finalState })

        const updatedWorkflowExecution = await this.wfExecutionsService
            .getWfExecution(stepExecution.workflow_execution_id)
        const stepsState = this.getWfExecutionStepsState(updatedWorkflowExecution.wfStepsExecution)
        await this.wfExecutionRepository.update(workflowExecution.id, { state: { ...state, stepsState } })

        return { finalState, finalStatus, failedActions }
    }

    async executeCustomWorkflowStepAction(id: number, actionAlias: string, actionsInput: IStepActionExecutionInput):
        Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const workflowExecution = await this.wfExecutionsService.getWfExecution(stepExecution.workflow_execution_id)
        const stepInput = stepExecution.input;
        const workflowInput = workflowExecution.input
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        const submittedData = actionsInput;
        // const submittedData = {}

        const onSubmitActions = actions.filter(a => a.alias === actionAlias);
        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;
            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    stepInput,
                    workflowInput,
                    submittedData,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    stepInput,
                    workflowInput,
                    submittedData,
                    state: prevState,
                    status: prevStatus
                }
            }

            // const actionBody = (actionInput: IStepActionExecutionInput) => {
            //     actionInput.state["rocketLaunchTime"] = new Date();
            //     INTEGRATIONS.email.send("andrii.mozharovskyi@gmail.com", "Launch this fucking rocket!")
            //     actionInput.status = "launched";
            // }

            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IStepActionExecutionOutput[]));

        const failedActions = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        const finalStatus = outputs[outputs.length - 1].status;
        await this.wfStepExecutionRepository.update(id, { status: finalStatus, state: finalState })

        const updatedWorkflowExecution = await this.wfExecutionsService
            .getWfExecution(stepExecution.workflow_execution_id)
        const stepsState = this.getWfExecutionStepsState(updatedWorkflowExecution.wfStepsExecution)
        await this.wfExecutionRepository.update(workflowExecution.id, { state: { ...state, stepsState } })

        return { finalState, finalStatus, failedActions }
    }

    async wfStepExecutionOnLoadAction(wfStepExecutionId: number): Promise<any> {
        const wfSubStepsExecution: WfStepExecutionEntity[] = await this.wfStepExecutionRepository
            .find({ parent: wfStepExecutionId })
        const subStepsState = this.getWfExecutionStepsState(wfSubStepsExecution)
        const renderStepId = wfSubStepsExecution
            .filter((step: WfStepExecutionEntity) => step.status !== WorkflowStepExecutionStatus.COMPLETE)[0]
        return { renderStepId: renderStepId.id, subStepsState }
    }

    private getWfExecutionStepsState(wfExecutionSteps: WfStepExecutionEntity[]): any[] {
        if (wfExecutionSteps.length) {
            const stepsState = wfExecutionSteps.map((s: WfStepExecutionEntity) => {
                const step = {
                    stepId: s.id,
                    stepStatus: s.status,
                    stepState: s.state
                }
                return step
            })
            return stepsState //
        } else {
            return []
        }
    }

    private async executeAction(
        input: IStepActionExecutionInput,
        action: string
    ): Promise<IStepActionExecutionOutput> {
        let output: IStepActionExecutionOutput;
        try {
            const script = new vm.Script(`${action}`);
            const context = vm.createContext({
                currentState: input.state,
                stepInput: input.stepInput,
                workflowInput: input.workflowInput,
                submittedData: input.submittedData,
                // libs
                lodash: require("lodash"),
            });
            const result = await script.runInContext(context);

            let status: WorkflowStepExecutionStatus = WorkflowStepExecutionStatus.NOT_STARTED;
            switch (result.status || result) {
                case "STARTED":
                    status = WorkflowStepExecutionStatus.STARTED
                    break;
                case "COMPLETE":
                    status = WorkflowStepExecutionStatus.COMPLETE
                    break;
                default:
                    status = WorkflowStepExecutionStatus.NOT_STARTED
                    break;
            }

            output = {
                state: result,
                status,
                result: {
                    isSuccess: true,
                    message: "You gave an answer"
                }
            }
        } catch (e) {
            output = {
                state: input.state,
                status,
                result: {
                    isSuccess: false,
                    message: e.message || e
                }
            }
        }
        return output
    }
}
