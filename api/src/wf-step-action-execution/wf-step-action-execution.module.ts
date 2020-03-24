import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WfStepActionExecutionService } from './wf-step-action-execution.service';
import { WfStepActionExecutionEntity } from './wf-step-action-execution.entity';
import { ActionEntity } from "../action/action.entity"

@Module({
  imports:[TypeOrmModule.forFeature([WfStepActionExecutionEntity, ActionEntity])],
  providers: [WfStepActionExecutionService]
})
export class WfStepActionExecutionModule {}
