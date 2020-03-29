import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WfActionExecutionController } from './wf-action-execution.controller';
import { WfActionExecutionService } from './wf-action-execution.service';
import { WfActionExecutionEntity } from "./wf-action-execution.entity"

@Module({
  imports: [TypeOrmModule.forFeature([WfActionExecutionEntity])],
  controllers: [WfActionExecutionController],
  providers: [WfActionExecutionService]
})
export class WfActionExecutionModule { }
