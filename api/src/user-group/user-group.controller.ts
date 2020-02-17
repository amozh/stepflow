import { Controller, Get, Param, ParseIntPipe, Post, Body, Delete, Put,UseGuards } from '@nestjs/common';

import { UserGroupService } from './user-group.service';
import { UserGroupDto } from '@stepflow/shared';
import { AdminGuard } from './../guards/admin.guard';

@Controller('group')
export class UserGroupController {
    constructor(private readonly userGroup: UserGroupService) { }

    @Get()
    get(): string {
        return this.userGroup.get()
    }

    @Get("/:id")
    getUserGroupById(@Param("id", ParseIntPipe) id: number): Promise<UserGroupDto> {
        return this.userGroup.getGroupById(id)
    }

    @Post()
    // @UseGuards(AdminGuard)
    createGroup(@Body() userGroupDto: UserGroupDto): Promise<UserGroupDto> {
        return this.userGroup.createGroup(userGroupDto)
    }

    @Delete("/:id")
    // @UseGuards(AdminGuard)
    deleteGroup(@Param("id", ParseIntPipe) id: number): Promise<string> {
        return this.userGroup.deleteGroup(id)
    }

    @Put("/:id")
    // @UseGuards(AdminGuard)
    updateGroup(@Param("id", ParseIntPipe) id: number, @Body() userGroupDto: UserGroupDto): Promise<UserGroupDto> {
        return this.userGroup.updateGroup(id, userGroupDto)
    }
}
