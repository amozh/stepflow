import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WfStepExecutionController } from './wf-step-execution.controller';
import { WfStepExecutionService } from './wf-step-execution.service';
import { WfStepExecutionEntity } from "./wf-step-execution.entity"

@Module({
  imports: [TypeOrmModule.forFeature([WfStepExecutionEntity])],
  controllers: [WfStepExecutionController],
  providers: [WfStepExecutionService]
})
export class WfStepExecutionModule {}
