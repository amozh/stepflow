import { Controller, Get, Param, ParseIntPipe, Post, Body, Delete, Put } from '@nestjs/common';

import { UserGroupService } from './user-group.service';
import { IUserGroupDto, IUserGroupBaseDto } from '@stepflow/shared';
// import { AdminGuard } from './../guards/admin.guard';
import { UserGroupEntity } from './user-group.entity';

@Controller('group')
export class UserGroupController {
    constructor(private readonly userGroup: UserGroupService) { }

    @Get("/:id")
    getUserGroupById(@Param("id", ParseIntPipe) id: number): Promise<UserGroupEntity> {
        return this.userGroup.getGroupById(id)
    }

    @Post()
    // @UseGuards(AdminGuard)
    createGroup(@Body() userGroupDto: IUserGroupBaseDto): Promise<UserGroupEntity> {
        return this.userGroup.createGroup(userGroupDto);
    }

    @Delete("/:id")
    // @UseGuards(AdminGuard)
    deleteGroup(@Param("id", ParseIntPipe) id: number): Promise<string> {
        return this.userGroup.deleteGroup(id)
    }

    @Put("/:id")
    // @UseGuards(AdminGuard)
    updateGroup(@Param("id", ParseIntPipe) id: number, @Body() userGroupDto: IUserGroupDto): Promise<UserGroupEntity> {
        return this.userGroup.updateGroup(id, userGroupDto)
    }
}
