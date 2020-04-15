import { Injectable } from '@nestjs/common';

let newUser: object = {}
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
    getUser(): object {
        return newUser
    }
    createUser(user: any): Promise<any> {
        return newUser = user
    }
}
