import { Injectable } from '@nestjs/common';
import { sign } from "jsonwebtoken";

import { UserService } from './user.service';
import { Payload } from '@stepflow/shared';


@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    //Генерирует Json Web Token
    async signPayload(payload: Payload) {
        return sign(payload, "WorkflowSecret", { expiresIn: '7d' })
    }

    async validateUser(payload: Payload) {
        return await this.userService.findByPayload(payload)
    }
}
