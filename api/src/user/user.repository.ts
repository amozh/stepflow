// import { EntityRepository, Repository } from "typeorm";
// import { UserEntity } from "./user.entity";
// import { UserDto } from '@stepflow/shared';

// @EntityRepository(UserEntity)
// export class UserRepository extends Repository<UserEntity> {
//     async createUser(userDto: UserDto): Promise<UserEntity> {
//         const { username, password } = userDto
//         const user = new UserEntity()
//         user.username = username
//         user.password = password
//         await user.save()
//         return user
//     }
// }