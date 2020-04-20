import { UserGroupEntity } from './../user-group/user-group.entity';
import { UserEntity } from './user.entity';
import { AdminGuard } from './../guards/admin.guard';
import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';

import { UserDto } from '@stepflow/shared';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get("secure")
    // @UseGuards(AdminGuard)
    getSecure(): string {
        return this.userService.getSecure()
    }

    @Get()
    getAllUsers(): Promise<UserEntity[]> {
        return this.userService.getAllUsers()
    }

    @Get("/:id")
    getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.getUserById(id)
    }

    @Post()
    // @UseGuards(AdminGuard) //
    createUser(@Body() userDto: UserDto): Promise<UserEntity> {
        return this.userService.createUser(userDto)
    }

    @Delete("/:id")
    // @UseGuards(AdminGuard)
    deleteUser(@Param("id", ParseIntPipe) id: number): Promise<string> {
        return this.userService.deleteUser(id)
    }

    @Put("/:id")
    // @UseGuards(AdminGuard)
    updateUser(@Param("id", ParseIntPipe) id: number, @Body() userDto: UserDto): Promise<UserEntity> {
        return this.userService.updateUser(id, userDto)
    }

    @Post("login")
    login(@Body() userDto: UserDto): Promise<UserEntity> {
        return this.userService.login(userDto)
    }

    @Get("/group/:id")
    getUserGroup(@Param("id", ParseIntPipe) id: number): Promise<UserGroupEntity[]> {
        return this.userService.getUserGroup(id)
    }
}
