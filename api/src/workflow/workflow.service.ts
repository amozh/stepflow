import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { Workflow } from './workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkflowDto, CreateWorkflowStepDto } from '@stepflow/shared';
import { WorkflowStep } from './../wf-step/wf-step.entity';

@Injectable()
export class WorkflowService implements OnModuleInit {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
  ) {}

  onModuleInit() {
    //generate default data
    this.workflowRepository.save({
      name: 'Basic Workflow 1',
      description: '',
      steps: [
        {
          name: 'Basic Step 1',
          description: '',
        },
      ],
    });
  }

  create(workflowDto: CreateWorkflowDto): Promise<Workflow> {
    const { name, description, steps } = workflowDto;

    let wokflowSteps = steps.map(step => {
      const workflowStep = new WorkflowStep();
      workflowStep.name = step.name;
      workflowStep.description = step.description;

      return workflowStep;
    });

    const workflow = new Workflow();
    workflow.name = name;
    workflow.description = description;
    workflow.steps = wokflowSteps;

    try {
      return this.workflowRepository.save(workflow);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<Workflow[]> {
    return this.workflowRepository.find();
  }

  findById(id: number): Promise<Workflow> {
    return this.workflowRepository.findOne({ id });
  }
}
