import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

      // steps.forEach(async step => {
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
}

// async createWfSteps(workflowSteps: ICreateWorkflowStepDto[]): Promise < WorkflowStep[] > {

//   const takeAllSteps = async (steps: ICreateWorkflowStepDto[], parentId?: number) => {

//     return steps.forEach(async step => {
//       const allSteps: WorkflowStep[] = [];
//       delete step.id //удаление id, сгенерированного на стороне клиента
//       step.parent = parentId
//       if (step.steps && step.steps.length > 0) {
//         //сохранение степа в базе, чтобы получить id и передать его своим subSteps
//         const wfStep = await this.workflowStepRepository.save(step)
//         allSteps.push(wfStep)
//         takeAllSteps(step.steps, wfStep.id)
//       } else {
//         const wfStep = await this.workflowStepRepository.save(step)
//         allSteps.push(wfStep)
//       }
//       // console.log(allSteps, "allSteps?")
//       return allSteps
//     }

//     )
//     // return g
//     // console.log(g, "g????")
//   }
//     const bbb = await takeAllSteps(workflowSteps)
//   // console.log(gg, "gg")
//   // console.log(bbb, "bbb?")
// }