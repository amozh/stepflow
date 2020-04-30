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
import { WfStepService } from "../wf-step/wf-step.service"

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow) private readonly workflowRepository: Repository<Workflow>,
    private readonly wfStepService: WfStepService
  ) { }

  async create(workflowDto: ICreateWorkflowDto): Promise<Workflow> {
    try {
      const { name, description, steps, actions, wfExecutions, input } = workflowDto;

      const wokflowSteps = await this.wfStepService.createWfSteps(steps)

      const workflow = new Workflow();
      workflow.name = name;
      workflow.description = description;
      workflow.input = input;
      workflow.steps = wokflowSteps
      workflow.actions = actions;
      workflow.wfExecutions = wfExecutions;

      return this.workflowRepository.save(workflow);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Workflow[]> {
    return await this.workflowRepository.find();
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
