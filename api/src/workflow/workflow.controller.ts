import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Workflow } from './workflow.entity';
import { ICreateWorkflowDto } from '@stepflow/shared';
import { WorkflowStep } from './../wf-step/wf-step.entity';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) { }

  @Get()
  getAll(): Promise<Workflow[]> {
    return this.workflowService.findAll();
  }

  @Post()
  create(@Body() workflow: ICreateWorkflowDto): Promise<Workflow> {
    return this.workflowService.create(workflow);
  }

  @Get('/:id')
  getWorkflowById(@Param('id', ParseIntPipe) id: number): Promise<Workflow> {
    return this.workflowService.findById(id);
  }

  @Delete("/:id")
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.workflowService.delete(id)
  }
}
