import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { Workflow } from "./workflow.entity";
import { ActionEntity } from "../action/action.entity"
import { TypeOrmModule } from "@nestjs/typeorm";
import { WfStepModule } from "../wf-step/wf-step.module"

@Module({
  imports: [TypeOrmModule.forFeature([
    Workflow,
    ActionEntity
  ]), WfStepModule],
  controllers: [WorkflowController],
  providers: [WorkflowService]
})
export class WorkflowModule { }
