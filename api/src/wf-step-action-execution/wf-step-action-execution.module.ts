import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WfStepActionExecutionController } from './wf-step-action-execution.controller';
import { WfStepActionExecutionService } from './wf-step-action-execution.service';
import { WfStepActionExecutionEntity } from './wf-step-action-execution.entity';

@Module({
  imports:[TypeOrmModule.forFeature([WfStepActionExecutionEntity])],
  controllers: [WfStepActionExecutionController],
  providers: [WfStepActionExecutionService]
})
export class WfStepActionExecutionModule {}
