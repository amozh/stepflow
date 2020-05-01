import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { WorkflowStep } from "./wf-step.entity";
import { ICreateWorkflowStepDto } from '@stepflow/shared';

@Injectable()
export class WfStepService {
  constructor(
    @InjectRepository(WorkflowStep) private readonly workflowStepRepository: Repository<WorkflowStep>,
  ) { }

  async createWfSteps(workflowSteps: ICreateWorkflowStepDto[]): Promise<WorkflowStep[]> {
    const allSteps: any[] = [];
    const takeAllSteps = async (steps: ICreateWorkflowStepDto[], parentId?: number) => {

      for (const step of steps) {
        delete step.id //удаление id, сгенерированного на стороне клиента
        step.parent = parentId
        if (step.steps && step.steps.length > 0) {
          //сохранение степа в базе, чтобы получить id и передать его своим subSteps
          const wfStep = await this.workflowStepRepository.save(step)
          allSteps.push(wfStep)
          takeAllSteps(step.steps, wfStep.id)
        } else {
          const wfStep = await this.workflowStepRepository.save(step)
          allSteps.push(wfStep)
        }
      }
    }
    await takeAllSteps(workflowSteps)
    const wfSteps: WorkflowStep[] = allSteps.filter(step => step.depth === 1)
    return wfSteps
  }

  async findSubSteps(stepId: number): Promise<WorkflowStep[]> {
    return await this.workflowStepRepository.find({ parent: stepId })
  }

  // async findSubSteps(stepsIds: number[]) { //example with queryBuilder
  //   const subSteps = await getRepository(WorkflowStep)
  //     .createQueryBuilder("step")
  //     .where("step.parent IN (:stepsIds)", { stepsIds })
  //     .getMany()
  //   return subSteps
  // }
}