import { RegistrateDTO, LoginDTO } from '@stepflow/shared';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcryptjs"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    //Нужно для токена
    async findByPayload(payload: any) {
        const { username } = payload;
        return await this.userRepository.findOne({ username });
    }

    async getMe(user: UserEntity): Promise<UserEntity> {
        return user
    }

    async registrateUser(registrateDTO: RegistrateDTO): Promise<UserEntity> {
        const { username, password } = registrateDTO
        const user = await this.userRepository.findOne({ username })
        if (user) {
            throw new InternalServerErrorException("This login already exists")
        }
        try {
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(password, salt)
            const user = {
                username,
                password: hash
            }
            return this.userRepository.save(user)
        } catch (e) {
            throw new InternalServerErrorException()
        }
    }

    async loginUser(loginDTO: LoginDTO): Promise<UserEntity> {
        const { username, password } = loginDTO
        const user = await this.userRepository.findOne({ username });
        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED)
        }
        if (await bcrypt.compare(password, user.password)) {
            return user
        } else {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED)
        }
        // UserEntity
        // const token = await this.authService.signPayload(payload)
        // return this.userRepository.save({})
        // return console.log(username, password)
    }

    // Нужно доделать логику удаления. Перед уделением вызвать getMe() и получить текущего юзера по токену
    // Далее удалить пользователя и вывести ему сообщение
    async deleteUser(): Promise<string> {
        await this.userRepository.save({})
        return "Your account has been deleted!"
    }

}