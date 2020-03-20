import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WfStepActionExecutionController } from './wf-step-action-execution.controller';
import { WfStepActionExecutionService } from './wf-step-action-execution.service';
import { WfStepActionExecutionEntity } from './wf-step-action-execution.entity';
import { ActionEntity } from "../action/action.entity"

@Module({
  imports:[TypeOrmModule.forFeature([WfStepActionExecutionEntity, ActionEntity])],
  controllers: [WfStepActionExecutionController],
  providers: [WfStepActionExecutionService]
})
export class WfStepActionExecutionModule {}
