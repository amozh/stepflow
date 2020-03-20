import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { Workflow } from "./workflow.entity";
import { ActionEntity } from "../action/action.entity"
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([
    Workflow,
    ActionEntity
  ])],
  controllers: [WorkflowController],
  providers: [WorkflowService]
})
export class WorkflowModule { }
