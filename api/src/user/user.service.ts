import { Repository } from 'typeorm';
import { Injectable, HttpException, NotFoundException, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto } from '@stepflow/shared';
import { UserEntity, UserRole } from './user.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) { }
    onModuleInit() {
        //generate default user
        this.userRepo.save({
            username: "DefaultUser",
            password: "123",
            userRole: UserRole.ADMIN,
            userGroup: [
                {
                    groupName: "Группа 222"
                }
            ]
        });
    }

    get(): string {
        return "Hello, New user!"
    }

    async getUserById(id: number): Promise<UserDto> {
        try {
            return await this.userRepo.findOne({ id })
        } catch (e) {
            throw new NotFoundException(`User with id ${id} is not found`)
        }

    }

    async createUser(userDto: UserDto): Promise<UserDto> {
        const { username, password, userRole, userGroups } = userDto
        const user = await this.userRepo.findOne({ username })
        if (user) {
            throw new InternalServerErrorException("A user with that name already exists")
        }
        const newUser = new UserEntity()
        //Переписать
        const newUserGroup = new UserGroupEntity()
        newUserGroup.groupName = "create group"

        newUser.username = username
        newUser.password = password
        newUser.userRole = userRole
        newUser.userGroups = userGroups
        await this.userRepo.save(newUser)
        return newUser
    }

    async deleteUser(id: number): Promise<string> {
        try {
            const user = await this.userRepo.findOne({ id })
            await this.userRepo.remove(user)
            return `User with id ${id} has been deleted`
        } catch (e) {
            throw new NotFoundException(`User with id ${id} is not found`)
        }
    }

    async updateUser(id: number, userDto: UserDto): Promise<UserDto> {
        try {
            const user = await this.userRepo.findOne({ id })
            await this.userRepo.update(user, userDto)
            return userDto
        } catch (e) {
            throw new NotFoundException(`User with id ${id} is not found`)
        }
    }

    // Вернёт пользователя, который имеет это имя и пароль. Если что-то не подойдёт, вернёт ошибку
    async login(userDto: UserDto): Promise<UserDto> {
        const { username, password } = userDto
        const user = await this.userRepo.findOne({ username, password })
        if (user) {
            return user
        } else {
            throw new InternalServerErrorException("Login or password is incorrect222")
        }
    }
}
