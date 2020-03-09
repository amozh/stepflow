
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { WfExecutionsController } from './wf-executions.controller';
import { WfExecutionsService } from './wf-executions.service';
import { WokrflowExecution } from './wf-executions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WokrflowExecution])],
  controllers: [WfExecutionsController],
  providers: [WfExecutionsService]
})
export class WfExecutionsModule { }
