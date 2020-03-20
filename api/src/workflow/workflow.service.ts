
import { Answer } from '../answer/answer.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Workflow } from './workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateWorkflowDto } from '@stepflow/shared';
import { WorkflowStep } from './../wf-step/wf-step.entity';
import { ActionEntity } from "../action/action.entity"

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow) private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(ActionEntity) private readonly actionRepository: Repository<ActionEntity>
  ) { }

  async create(workflowDto: ICreateWorkflowDto): Promise<Workflow> {
    try {
      const { name, description, steps, actions, wfExecutions, input } = workflowDto;

      let wokflowSteps = steps.map(step => {
        const workflowStep = new WorkflowStep();

        const stepAnswer = new Answer();
        stepAnswer.answer = step.answer.answer

        workflowStep.answer = stepAnswer;
        workflowStep.name = step.name;
        workflowStep.input = step.input;
        workflowStep.actions = step.actions;
        workflowStep.description = step.description;

        return workflowStep;
      });

      const workflow = new Workflow();
      workflow.name = name;
      workflow.description = description;
      workflow.input = input;
      workflow.steps = wokflowSteps;
      workflow.actions = actions;
      workflow.wfExecutions = wfExecutions;

      return this.workflowRepository.save(workflow);
    } catch (error) {
      console.log(error, "error")
      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<Workflow[]> {
    return this.workflowRepository.find();
  }

  async findById(id: number): Promise<Workflow> {
    const workflow = await this.workflowRepository.findOne({ id })
    if (!workflow) {
      throw new NotFoundException(`Workflow with id ${id} is not found`);
    } else {
      return workflow
    }
  }
}
