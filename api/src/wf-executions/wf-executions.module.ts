
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { WfExecutionsController } from './wf-executions.controller';
import { WfExecutionsService } from './wf-executions.service';
import { Workflow } from "../workflow/workflow.entity"
import { WokrflowExecution } from './wf-executions.entity';
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"
import { WfStepActionExecutionEntity } from "../wf-step-action-execution/wf-step-action-execution.entity"
import { IStepActionExecutionInput, WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

@Module({
  imports: [TypeOrmModule.forFeature([
    WokrflowExecution,
    Workflow,
    WfStepExecutionEntity,
    WfStepActionExecutionEntity
  ])],
  controllers: [WfExecutionsController],
  providers: [WfExecutionsService, WfStepExecutionService],
  exports: [WfExecutionsService]
})
export class WfExecutionsModule { }
