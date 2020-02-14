import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";

import { AuthService } from "./auth.service";
import { Payload } from '@stepflow/shared';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "secretKey"
        });
    }

    async validate(payload: Payload, done: VerifiedCallback) {
        const user = await this.authService.validateUser(payload)
        if (!user) {
            return done(new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED), false)
        }

        return done(null, user, payload.iat) //payload.iat - хз что это. Без него всё также работает
    }
}