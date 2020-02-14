import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [
        UserService,
        AuthService,
        // JwtStrategy 
    ],
})
export class UserModule { }
