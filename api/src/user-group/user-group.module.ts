
import { UserEntity } from './../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';
import { UserGroupEntity } from './user-group.entity';
import { Workflow } from "../workflow/workflow.entity";
import { ActionEntity } from './../action/action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserGroupEntity, Workflow, UserEntity, ActionEntity]),
    // TypeOrmModule.forFeature([Workflow]), //
    // TypeOrmModule.forFeature([UserEntity]),
    // ActionModule
  ],
  controllers: [UserGroupController],
  providers: [UserGroupService]
})
export class UserGroupModule { }
