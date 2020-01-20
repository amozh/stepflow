import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Workflow } from './workflow.entity';
import { CreateWorkflowDto, CreateWorkflowStepDto } from '@stepflow/shared';
import { WorkflowStep } from './../wf-step/wf-step.entity';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@Body() workflow: CreateWorkflowDto): Promise<Workflow> {
    return this.workflowService.create(workflow);
  }

  @Get()
  getAll(): Promise<Workflow[]> {
    return this.workflowService.findAll();
  }

  @Get('/:id')
  getWorkflowById(@Param('id', ParseIntPipe) id: number): Promise<Workflow> {
    return this.workflowService.findById(id);
  }
}
