import { Module } from '@nestjs/common';
import { WfStepController } from './wf-step.controller';
import { WfStepService } from './wf-step.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkflowStep } from "./wf-step.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowStep])],
  controllers: [WfStepController],
  providers: [WfStepService]
})
export class WfStepModule {}
