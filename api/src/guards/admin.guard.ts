import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        // С использованием jwt strategy в passport можно получить доступ к юзеру, который отправил запрос
        // В будущем
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log(user, "user???");
        if (user && user.userRole === "ADMIN") {
            return true;
        }
        throw new HttpException("You do not have rights to perform this action", HttpStatus.UNAUTHORIZED);
    }
}
