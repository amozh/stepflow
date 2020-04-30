import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get()
    getUser(): object {
        return this.appService.getUser()
    }

    @Post()
    createUser(@Body() user: any): Promise<any> {
        return this.appService.createUser(user)
    }
}
