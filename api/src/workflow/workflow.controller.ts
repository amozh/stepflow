import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkflowService } from "./workflow.service";
import { Workflow } from "./workflow.entity";
import { CreateWorkflowDto } from "@stepflow/shared";

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {
  }

  @Post()
  create(@Body() workflow: CreateWorkflowDto): Promise<Workflow> {
    return this.workflowService.create(workflow);
  }

  @Get()
  getAll(): Promise<Workflow[]> {
    return this.workflowService.findAll();
  }

}
