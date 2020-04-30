import { Repository, createConnection } from 'typeorm';
import { Injectable, NotFoundException, OnModuleInit, InternalServerErrorException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto, IUserGroupDto } from '@stepflow/shared';
import { UserEntity, UserRole } from './user.entity';
import { UserGroupEntity } from '../user-group/user-group.entity';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) { }
    onModuleInit() {
        //generate default user
        this.userRepo.save({
            username: "1",
            password: "1",
            userRole: UserRole.ADMIN,
            userGroup: [
                {
                    groupName: "Группа 222"
                }
            ]
        });
    }

    getSecure(): string {
        return "Hello, New user!"
    }

    async getUserById(id: number): Promise<UserEntity> {
        try {
            return await this.userRepo.findOne({ id })
        } catch (e) {
            throw new NotFoundException(`User with id ${id} is not found`)
        }

    }

    async getAllUsers(): Promise<UserEntity[]> {
        try {
            return await this.userRepo.find()
        } catch (e) {
            throw new NotFoundException()
        }
    }

    async createUser(userDto: UserDto): Promise<UserEntity> {
        const { username, password, userRole } = userDto
        // const user = await this.userRepo.findOne({ username }) //
        const user = false
        try {
            if (!user) {
                const newUser = new UserEntity()
                newUser.username = username
                newUser.password = password
                newUser.userRole = userRole
                return await this.userRepo.save(newUser)
            } else {
                throw new InternalServerErrorException("A user with that name already exists")
            }
        } catch (e) {
            throw new InternalServerErrorException("A user with that name already exists")
        }
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

    async updateUser(id: number, userDto: UserDto): Promise<UserEntity> {
        try {
            const { username, password, userGroups, userRole } = userDto
            const user = await this.userRepo.findOne({ id })
            user.username = username
            user.password = password
            user.userRole = userRole
            user.userGroups = userGroups

            const updatedUser = await this.userRepo.save(user)
            return updatedUser
        } catch (e) {
            throw new NotFoundException(`User with id ${id} is not found`)
        }
    }

    // Вернёт пользователя, который имеет это имя и пароль. Если что-то не подойдёт, вернёт ошибку
    async login(userDto: UserDto): Promise<UserEntity> {
        const { username, password } = userDto
        try {
            return await this.userRepo.findOneOrFail({ username, password })
        } catch (e) {
            throw new InternalServerErrorException("Login or password is incorrect")
        }

    }

    async getUserGroup(id: number): Promise<UserGroupEntity[]> {
        const user = await this.userRepo.findOne(id, {
            relations: ["userGroups"],
            select: ["id"]
        })
        const userGroups = await user.userGroups
        return userGroups
    }
}
