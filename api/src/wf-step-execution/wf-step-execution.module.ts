import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WfStepExecutionService } from './wf-step-execution.service';
import { WfStepExecutionEntity } from "./wf-step-execution.entity"
import { WorkflowStep } from "../wf-step/wf-step.entity";
import { WfStepActionExecutionEntity } from './../wf-step-action-execution/wf-step-action-execution.entity';
import { WfExecutionsService } from "../wf-executions/wf-executions.service"
import { WfExecutionsModule } from "../wf-executions/wf-executions.module"

@Module({
  imports: [TypeOrmModule.forFeature([
    WfStepExecutionEntity,
    WorkflowStep,
    WfStepActionExecutionEntity,
  ]),
    WfExecutionsModule
  ],
  providers: [WfStepExecutionService]
})
export class WfStepExecutionModule { }
