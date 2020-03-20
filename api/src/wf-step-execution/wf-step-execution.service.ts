import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepExecutionEntity, WorkflowStepExecutionStatus } from "./wf-step-execution.entity"
import { WfExecutionsService } from "../wf-executions/wf-executions.service"
const vm = require("vm")

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

        let stateResult: JSON = { ...updatedExecutedWfStep.state }
        if (body.answer == result) {
            stateResult[body.questionId] = {
                answerResult: "Answer is correct",
                questionId: body.questionId
            }
        }
        else {
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
}
