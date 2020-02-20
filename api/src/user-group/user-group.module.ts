import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';
import { UserGroupEntity } from './user-group.entity';
import { WorkflowModule } from "../workflow/workflow.module";
import { Workflow } from "../workflow/workflow.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserGroupEntity]), TypeOrmModule.forFeature([Workflow])],
  controllers: [UserGroupController],
  providers: [UserGroupService]
})
export class UserGroupModule { }
