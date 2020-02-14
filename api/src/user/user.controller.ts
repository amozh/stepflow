import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { Controller, Post, Body, Delete, Get, UseGuards } from '@nestjs/common';
import { RegistrateDTO, LoginDTO, Payload } from '@stepflow/shared';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../utilities/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe(@User() user: any) {
        // console.log(user)
        return this.userService.getMe(user)
    }

    @Post('registrate')
    registrate(@Body() regUser: RegistrateDTO): Promise<UserEntity> {
        return this.userService.registrateUser(regUser)
    }

    @Post('login')
    async  login(@Body() loginUser: LoginDTO): Promise<any> {
        const user = await this.userService.loginUser(loginUser)
        const payload: Payload = {
            username: user.username,
        }
        const token = await this.authService.signPayload(payload)
        return { user, token }
    }

    @Delete('remove_me')
    deleteUser() {
        return this.userService.deleteUser()
    }


}
