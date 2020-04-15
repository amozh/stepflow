import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStep } from "./wf-step.entity";
import { ICreateWorkflowDto, ICreateWorkflowStepDto } from '@stepflow/shared';

@Injectable()
export class WfStepService {
  constructor(
    @InjectRepository(WorkflowStep) private readonly workflowStepRepository: Repository<WorkflowStep>,
  ) { }

  async createWfSteps(workflowSteps: ICreateWorkflowStepDto[]): Promise<WorkflowStep[]> {
    const allSteps: WorkflowStep[] = [];
    const takeAllSteps = async (steps: ICreateWorkflowStepDto[], parentId?: number) => {
      steps.forEach(async step => {
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
      )
    }
    takeAllSteps(workflowSteps)
    return allSteps
  }
}
