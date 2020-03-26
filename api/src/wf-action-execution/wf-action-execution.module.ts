import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WfActionExecutionService } from './wf-action-execution.service';
import { WfActionExecutionEntity } from "./wf-action-execution.entity"

@Module({
  imports: [TypeOrmModule.forFeature([WfActionExecutionEntity])],
  providers: [WfActionExecutionService]
})
export class WfActionExecutionModule { }
