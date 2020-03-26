import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepExecutionEntity, WorkflowStepExecutionStatus } from "./wf-step-execution.entity"
import { WfExecutionsService } from "../wf-executions/wf-executions.service"
import { ActionType } from "../wf-step-action-execution/wf-step-action-execution.entity"
const vm = require("vm")

export interface IStepActionExecutionInput {
    input: any
    state?: JSON
    status?: WorkflowStepExecutionStatus
}

export interface IStepActionExecutionOutput {
    state: JSON
    status: WorkflowStepExecutionStatus
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
        private readonly wfExecutionsService: WfExecutionsService
    ) { }

    // TODO
    // 1. Make sure that all business logic is generic and is not dependent of user input
    // 2. Put everything related to workflow execution into 1 Module and 1 Controller
    // 3. Finish adding actionType into WfStepActionExecutionEntity
    // 4. Confugure TSLint and fix errors

    async startWfStepExecution(id: number, body: any): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const input = stepExecution.input;
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        input["submittedAnswer"] = body.submittedAnswer

        const onSubmitActions = actions.filter(a => a.actionType === ActionType.ON_START);
        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;

            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
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
        await this.wfExecutionsService.updateWfExecution(
            stepExecution.workflow_execution_id,
            finalState,
            id
        )
        return { finalState, finalStatus, failedActions }
    }

    async submitWfStepExecution(id: number, body: any): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const input = stepExecution.input;
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        input["submittedAnswer"] = body.submittedAnswer

        // ПОМЕНЯТЬ СТАТУС НА ОН_САБМИТ, ПРИДУМАТЬ КАКИМ ОБРАЗОМ БУДЕТ СОХРАНЯТЬСЯ СТАТУС СТЕПОВ (ПРОСТО ПОЛУЧАТЬ С БД?)
        const onSubmitActions = actions.filter(a => a.actionType === ActionType.ON_SUBMIT);

        // Выполнит отфильтрованные функции
        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;

            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
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
        await this.wfExecutionsService.updateWfExecution(
            stepExecution.workflow_execution_id,
            finalState,
            id
        )
        return { finalState, finalStatus, failedActions }
    }

    async completeWfStepExecution(id: number, body: any): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const input = stepExecution.input;
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        input["submittedAnswer"] = body.submittedAnswer

        const onSubmitActions = actions.filter(a => a.actionType === ActionType.ON_COMPLETE);
        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;

            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
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
        await this.wfExecutionsService.updateWfExecution(
            stepExecution.workflow_execution_id,
            finalState,
            id
        )
        return { finalState, finalStatus, failedActions }
    }

    async executeCustomWorkflowStepAction(id: number, actionAlias: string, actionsInput: IStepActionExecutionInput):
        Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        const input = stepExecution.input;
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;
        input["submittedAnswer"] = actionsInput.input.submittedAnswer

        const onSubmitActions = actions.filter(a => a.alias === actionAlias);

        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;
            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    input,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    input,
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
        await this.wfExecutionsService.updateWfExecution(stepExecution.workflow_execution_id, finalState, id)
        return { finalState, finalStatus, failedActions }
    }

    private async executeAction(input: IStepActionExecutionInput, action: string): Promise<IStepActionExecutionOutput> {
        let output: IStepActionExecutionOutput;
        try {
            const script = new vm.Script(`${action}`);
            const context = vm.createContext(input.input);
            await script.runInContext(context);
            output = {
                state: context,
                status: WorkflowStepExecutionStatus.COMPLETE,
                result: {
                    isSuccess: true,
                    message: "You gave an answer"
                }
            }
        } catch (e) {
            console.error(`Failed to execute action ${action} with input ${JSON.stringify(input)}`, e);
            output = {
                state: input.state,
                status: input.status,
                result: {
                    isSuccess: false,
                    message: e.message || e + ""
                }
            }
        }
        return output
    }
}
