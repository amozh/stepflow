import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Workflow } from './workflow.entity';
import { ICreateWorkflowDto } from '@stepflow/shared';
import { WorkflowStep } from './../wf-step/wf-step.entity';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

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

  @Post('answer')
  giveAnswer(
    @Body()
    @Query("workflow", ParseIntPipe) workflow: number,
    @Query("step", ParseIntPipe) step: number)
  : void {
    return console.log("workflowNumber:", workflow, "stepNumber:", step)
  }
}
