import { AdminGuard } from './../guards/admin.guard';
import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';

import { UserDto } from '@stepflow/shared';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get("secure")
    @UseGuards(AdminGuard)
    get(): string {
        return this.userService.get()
    }

    @Get()
    getAllUsers(): Promise<UserDto[]> {
        return this.userService.getAllUsers()
    }

    @Get("/:id")
    getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserDto> {
        return this.userService.getUserById(id)
    }

    @Post()
    // @UseGuards(AdminGuard)
    createUser(@Body() userDto: UserDto): Promise<UserDto> {
        return this.userService.createUser(userDto)
    }

    @Delete("/:id")
    // @UseGuards(AdminGuard)
    deleteUser(@Param("id", ParseIntPipe) id: number): Promise<string> {
        return this.userService.deleteUser(id)
    }

    @Put("/:id")
    // @UseGuards(AdminGuard)
    updateUser(@Param("id", ParseIntPipe) id: number, @Body() userDto: UserDto): Promise<UserDto> {
        return this.userService.updateUser(id, userDto)
    }

    @Post("login")
    login(@Body() userDto: UserDto): Promise<UserDto> {
        return this.userService.login(userDto)
    }

}
