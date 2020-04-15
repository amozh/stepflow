
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { WfExecutionsController } from './wf-executions.controller';
import { WfExecutionsService } from './wf-executions.service';
import { Workflow } from "../workflow/workflow.entity"
import { WokrflowExecution } from './wf-executions.entity';
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"
import { WfStepActionExecutionEntity } from "../wf-step-action-execution/wf-step-action-execution.entity"
import { WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";
import { WfStepExecutionModule } from "../wf-step-execution/wf-step-execution.module"
import { WfActionExecutionEntity } from "../wf-action-execution/wf-action-execution.entity"
import { WfActionExecutionService } from "../wf-action-execution/wf-action-execution.service"

@Module({
  imports: [TypeOrmModule.forFeature([
    WokrflowExecution,
    Workflow,
    WfStepExecutionEntity,
    WfStepActionExecutionEntity,
    WfActionExecutionEntity
  ])],
  controllers: [WfExecutionsController],
  providers: [WfExecutionsService, WfActionExecutionService, WfStepExecutionService],
  exports: [WfExecutionsService]
})
export class WfExecutionsModule { }
