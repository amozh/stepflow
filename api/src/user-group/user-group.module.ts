import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';
import { UserGroupEntity } from './user-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroupEntity])],
  controllers: [UserGroupController],
  providers: [UserGroupService]
})
export class UserGroupModule { }
