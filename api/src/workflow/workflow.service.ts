import { Answer } from '../answer/answer.entity';
import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Workflow } from './workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateWorkflowDto } from '@stepflow/shared';
import { WorkflowStep } from './../wf-step/wf-step.entity';

@Injectable()
export class WorkflowService implements OnModuleInit {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
  ) { }

  onModuleInit() {
    //generate default data
    // this.workflowRepository.save({
    //   name: 'Basic Workflow 1',
    //   description: '',
    //   steps: [
    //     {
    //       name: 'Basic Step 1',
    //       description: '',
    //       answer: {
    //         answer: "putin"
    //       }
    //     },
    //   ],
    // });
  }

  async create(workflowDto: ICreateWorkflowDto): Promise<Workflow> {
    try {
      const { name, description, steps } = workflowDto;

      let wokflowSteps = steps.map(step => {
        const workflowStep = new WorkflowStep();

        const stepAnswer = new Answer();
        stepAnswer.answer = step.answer.answer

        workflowStep.answer = stepAnswer;
        workflowStep.name = step.name;
        workflowStep.description = step.description;

        return workflowStep;
      });

      const workflow = new Workflow();
      workflow.name = name;
      workflow.description = description;
      workflow.steps = wokflowSteps;

      return this.workflowRepository.save(workflow); //
    } catch (error) {
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
