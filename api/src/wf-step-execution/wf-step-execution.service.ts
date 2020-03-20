import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepExecutionEntity, WorkflowStepExecutionStatus } from "./wf-step-execution.entity"
import { WfExecutionsService } from "../wf-executions/wf-executions.service"
const vm = require("vm")

export interface IStepActionExecutionInput {
    submittedAnswer: any
    input: any
    state?: any
    status?: WorkflowStepExecutionStatus
}

export interface IStepActionExecutionOutput {
    state: any
    status: WorkflowStepExecutionStatus
    result: {
        isSuccess: boolean
        message: string
    }
}

@Injectable()
export class WfStepExecutionService {
    constructor(
        @InjectRepository(WfStepExecutionEntity) private readonly wfStepExecutionRepository: Repository<WfStepExecutionEntity>,
        private readonly WfExecutionsService: WfExecutionsService
    ) { }

    getWfStepExecution(): string {
        return "Workflow step execution"
    }
    // async createWfStepExecution(stepId: number): Promise<any> {
    //     const step = await this.wfStepRepository.findOne({ id: stepId })
    //     console.log(step.actions)
    //     const stepExecution = new WfStepExecutionEntity()

    //     stepExecution.workflow_step_id = stepId
    //     stepExecution.workflow_execution_id = 0 // Переписать
    //     stepExecution.name = step.name
    //     stepExecution.description = step.description
    //     stepExecution.input = step.input
    //     stepExecution.state = null
    //     // Связать как-то это с экшенами, сделать так, чтобы всё работало

    //     return await this.wfStepExecutionRepository.save(stepExecution)
    // }

    async updateWfStepExecution(id: number, body: any): Promise<any> {
        // Разобраться с экшенами (тут до сих пор используется только 1-й экшен). Привязать их как-то к id вопроса или что-то такое
        // Также здесь вызывать запрос, который апдейтит сам воркфлоу и обновлять его стейт
        // а также добавить туда логику обновления статуса как и здесь
        const updatedExecutedWfStep = await this.wfStepExecutionRepository.findOne(id)
        const action = updatedExecutedWfStep.wfStepActionExecutions[0].body

        const context = updatedExecutedWfStep.input.questions.find(e => e.id === body.questionId).inputData
        const script = new vm.Script(`${action}`);
        vm.createContext(context)
        const result = await script.runInContext(context);

        const stateResult: JSON = { ...updatedExecutedWfStep.state }
        if (body.answer == result) {
            stateResult[body.questionId] = {
                answerResult: "Answer is correct",
                questionId: body.questionId
            }
        } else {
            stateResult[body.questionId] = {
                answerResult: "Answer is wrong",
                questionId: body.questionId,
                wrongAnswer: body.answer
            }
        }

        let updatedStatus: WorkflowStepExecutionStatus
        switch (updatedExecutedWfStep.status) {
            case WorkflowStepExecutionStatus.NOT_STARTED:
                updatedStatus = WorkflowStepExecutionStatus.STARTED
                break
            case WorkflowStepExecutionStatus.STARTED:
                if (Object.keys(stateResult).length === updatedExecutedWfStep.input.questions.length) {
                    updatedStatus = WorkflowStepExecutionStatus.COMPLETE
                    break
                }
            default:
                updatedStatus = updatedExecutedWfStep.status
        }

        await this.wfStepExecutionRepository.update(id, { status: updatedStatus, state: stateResult })
        await this.WfExecutionsService.updateWfExecution(body.executedWf, stateResult)
        return { stateResult, updatedStatus }

    }
    
    // TODO
    // 1. Make sure that all business logic is generic and is not dependent of user input
    // 2. Put everything related to workflow execution into 1 Module and 1 Controller
    // 3. Finish adding actionType into WfStepActionExecutionEntity
    // 4. Confugure TSLint and fix errors

    async executeCustomWorkflowStepAction(id: number, actionAlias: string, actionsInput: IStepActionExecutionInput): Promise<any> {
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)
        
        const submittedAnswer = actionsInput.submittedAnswer;
        const input = stepExecution.input;
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;

        const onSubmitActions = actions.filter(a => a.alias === actionAlias);

        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;
            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    submittedAnswer,
                    input,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    submittedAnswer,
                    input,
                    state = prevState,
                    status = prevStatus
                }
            }
            
            const actionBody = (actionInput: IStepActionExecutionInput) => {
                actionInput.state["rocketLaunchTime"] = new Date();
                INTEGRATIONS.email.send("andrii.mozharovskyi@gmail.com", "Launch this fucking rocket!")
                actionInput.status = "launched";
            }
            
            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IStepActionExecutionOutput[]));

        const failedActions = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        const finalStatus = outputs[outputs.length - 1].status;

        // let updatedStatus: WorkflowStepExecutionStatus
        // switch (stepExecution.status) {
        //     case WorkflowStepExecutionStatus.NOT_STARTED:
        //         updatedStatus = WorkflowStepExecutionStatus.STARTED
        //         break
        //     case WorkflowStepExecutionStatus.STARTED:
        //         if (Object.keys(finalState).length === stepExecution.input.questions.length) {
        //             updatedStatus = WorkflowStepExecutionStatus.COMPLETE
        //             break
        //         }
        //     default:
        //         updatedStatus = stepExecution.status
        // }

        await this.wfStepExecutionRepository.update(id, { status: finalStatus, state: finalState })
        await this.WfExecutionsService.updateWfExecution(body.executedWf, finalState)
        return { finalState, finalStatus, failedActions }
    }

    async submitWfStepExecution(id: number, body: any): Promise<any> {
        // Разобраться с экшенами (тут до сих пор используется только 1-й экшен). Привязать их как-то к id вопроса или что-то такое
        // Также здесь вызывать запрос, который апдейтит сам воркфлоу и обновлять его стейт
        // а также добавить туда логику обновления статуса как и здесь
        const stepExecution = await this.wfStepExecutionRepository.findOne(id)

        const submittedAnswer = body;
        const input = stepExecution.input;
        const state = stepExecution.state;
        const actions = stepExecution.wfStepActionExecutions;
        const status = stepExecution.status;

        const onSubmitActions = actions.filter(a => a.actionType === "onSubmit");

        const outputs: IStepActionExecutionOutput[] = await onSubmitActions.reduce(async (actionOutputs, a) => {
            const existingOutputs: IStepActionExecutionOutput[] = await actionOutputs;
            let actionInput: IStepActionExecutionInput;
            if (existingOutputs.length === 0) {
                actionInput = {
                    submittedAnswer,
                    input,
                    state,
                    status
                }
            } else {
                const prevState = existingOutputs[existingOutputs.length - 1].state;
                const prevStatus = existingOutputs[existingOutputs.length - 1].status;
                actionInput = {
                    submittedAnswer,
                    input,
                    state = prevState,
                    status = prevStatus
                }
            }
            const output = await this.executeAction(actionInput, a.body);
            return [...existingOutputs, output];
        }, Promise.resolve([] as IStepActionExecutionOutput[]));

        const failedActions = outputs.filter(o => !o.result.isSuccess);
        failedActions.forEach(a => {
            //do something with failed action
        })

        const finalState = outputs[outputs.length - 1].state;
        const finalStatus = outputs[outputs.length - 1].status;

        // let updatedStatus: WorkflowStepExecutionStatus
        // switch (stepExecution.status) {
        //     case WorkflowStepExecutionStatus.NOT_STARTED:
        //         updatedStatus = WorkflowStepExecutionStatus.STARTED
        //         break
        //     case WorkflowStepExecutionStatus.STARTED:
        //         if (Object.keys(finalState).length === stepExecution.input.questions.length) {
        //             updatedStatus = WorkflowStepExecutionStatus.COMPLETE
        //             break
        //         }
        //     default:
        //         updatedStatus = stepExecution.status
        // }

        await this.wfStepExecutionRepository.update(id, { status: finalStatus, state: finalState })
        await this.WfExecutionsService.updateWfExecution(body.executedWf, finalState)
        return { finalState, finalStatus, failedActions }

    }

    private async executeAction(input: IStepActionExecutionInput, action: string): Promise<IStepActionExecutionOutput> {
        let output: IStepActionExecutionOutput;
        try {
            const script = new vm.Script(`${action}`);
            const context = vm.createContext(input);
            output = await script.runInContext(context);
        } catch (e) {
            console.error(`Failed to execute action ${action} with input ${JSON.stringify(input)}`, e);
            output = {
                state: input.state,
                status: input.status,
                result: {
                    isSuccess: false,
                    message: e.message || e + "";
                }
            }
        }
        return output
    }
}
