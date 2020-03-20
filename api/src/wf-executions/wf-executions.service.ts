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
        let executedSteps: Promise<WfStepExecutionEntity>[] = workflow.steps.map(async step => {
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
            //TODO: Best Practice - dont do too many calls into the Database
            const createdStepActions: WfStepActionExecution[] = await this.wfStepActionExecutionRepository.save(stepActionExecutions)
            const wfStepExecution = new WfStepExecutionEntity()
            wfStepExecution.workflow_execution_id = workflow.id
            wfStepExecution.workflow_step_id = step.id
            wfStepExecution.name = step.name
            wfStepExecution.description = step.description
            wfStepExecution.input = step.input

            wfStepExecution.wfStepActionExecutions = createdStepActions
            const savedStep = await this.wfStepExecutionRepository.save(wfStepExecution)

            return savedStep
        })

        const wfInput = await (await Promise.all(executedSteps)).map(step => {
            return { stepId: step.id, stepStatus: step.status, state: step.state }
        })
        workflowExecution.name = workflow.name
        workflowExecution.description = workflow.description
        workflowExecution.input = JSON.parse(JSON.stringify([...wfInput, WorkflowExecutionStatus.NOT_STARTED]))
        workflowExecution.workflow_id = workflowId
        workflowExecution.wfStepsExecution = await Promise.all(executedSteps)

        return await this.wfExecutionRepository.save(workflowExecution)
    }

    async updateWfExecution(id: number, body: any): Promise<any> {
        const executedWf = await this.wfExecutionRepository.findOne(id)

        // let stateResult: JSON = { ...executedWf.state }
        // const questionIndex = Object.values(body)[0].questionId + ""
        // if (body) {
        //     stateResult[questionIndex] = body
        // }

        let stateResult: JSON
        if (body) {
            stateResult = body
        }

        let updatedStatus: WorkflowExecutionStatus
        switch (executedWf.status) {
            // Переведёт статус в STARTED сразу как выполнится любой шаг в текущем воркфлоу или придёт запрос для старта воркфлоу
            case WorkflowExecutionStatus.NOT_STARTED:
                updatedStatus = WorkflowExecutionStatus.STARTED
                break
            // Переведёт в COMPLETE, когда длина массива степов === длине массива степов, которые имеют статус COMPLETE
            case WorkflowExecutionStatus.STARTED:
                if (Object.values(executedWf.input).filter(e => (typeof e) === "object").length
                    === executedWf.wfStepsExecution.filter(e => e.status === WorkflowStepExecutionStatus.COMPLETE).length) {
                    updatedStatus = WorkflowExecutionStatus.COMPLETE
                    break;
                }
            default:
                updatedStatus = executedWf.status
                break;
        }

        await this.wfExecutionRepository.update(id, { status: updatedStatus, state: stateResult })
        // console.log(id, body, "??")
        // const executedWf = await this.wfExecutionRepository.findOne(id)
        // // console.log(executedWf, "executedWf")
        // // let wfStepsState = executedWf.wfStepsExecution.map(wfStep => {
        // //     const stepInfo = {
        // //         stepId: wfStep.id,
        // //         status: wfStep.status,
        // //         stepState: wfStep.state
        // //     } 
        // //     return stepInfo
        // // })
        // ВЫЗЫВАТЬ ЭТОТ МЕТОД В ТЕЛЕ МЕТОДА ВЫПОЛНЕНИЯ СТЕПА. ТАКИМ ОБРАЗОМ, ВЫПОЛНИВ СТЕП, БУДЕТ АПДЕЙТИТСЯ ВОРКФЛОУ

        // Переписать эту логику аналогично тому как она прописала в => wf-step-execution.service.ts
        // let STATUS: WorkflowExecutionStatus
        // switch (body.STATUS) {
        //     case "STARTED":
        //         STATUS = WorkflowExecutionStatus.STARTED
        //         break
        //     case "COMPLETE":
        //         STATUS = WorkflowExecutionStatus.COMPLETE // Передавать COMPLETE на выполнении последнего степа на фронте (временно)
        //         break
        //     default:
        //         STATUS = WorkflowExecutionStatus.NOT_STARTED
        // }
        // console.log("updated???")
        // const updatedExecutedWf = 

        // console.log(updatedExecutedWf, "updatedExecutedWf")
        // return updatedExecutedWf
        // return "hello, " + id
    }
}
