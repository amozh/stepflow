import { Module } from '@nestjs/common';
import { WfStepService } from './wf-step.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkflowStep } from "./wf-step.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowStep])],
  providers: [WfStepService],
  exports: [WfStepService]
})
export class WfStepModule { }
