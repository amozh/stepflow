import { createParamDecorator } from "@nestjs/common";

//request "из коробки" содержит того юзера, который отправил запрос (это реализовывает паспорт, если не ошибаюсь)
export const User = createParamDecorator((data, req) => {
    // console.log(req.user, "user???")
    console.log(req)
    return req.user
})