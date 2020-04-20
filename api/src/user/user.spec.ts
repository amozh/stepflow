import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { UserController } from "./user.controller"
import { UserEntity, UserRole } from "./user.entity"
import { UserModule } from "./user.module"
import { UserDto } from '@stepflow/shared';
import { Test, TestingModule } from "@nestjs/testing"
import * as sinon from "sinon"
import { TypeOrmModule } from '@nestjs/typeorm';

// скопирует всё из одного объекта (сущности) в целевой (здесь это plain)
class GenericFactory {
    public static create<T>(classname: new () => {}, plain: unknown) {
        const instance = new classname()
        return Object.assign(instance, plain) as unknown as T
    }
}

// // // -----------------------------------------------------------------------------------------------------------
// describe("UserService", () => {
//     let userService: UserService
//     let mockRepository: Repository<UserEntity>
//     let mock: sinon.SinonMock

//     beforeEach(async () => {
//         mockRepository = {} as Repository<UserEntity>
//         mockRepository = Object.assign(mockRepository, {
//             find: new Function()
//         })
//         mock = sinon.mock(mockRepository)
//         mock.expects('find').resolves([
//             GenericFactory.create<UserEntity>(UserEntity, {
//                 id: 89,
//                 username: "RandomUser",
//                 password: "qwerty"
//             }),
//             GenericFactory.create<UserEntity>(UserEntity, {
//                 id: 123,
//                 username: "Juice",
//                 password: "Wrld"
//             })
//         ])
//         userService = new UserService(mockRepository)
//     })
//     it("AllUsers", () => {
//         expect(userService.getAllUsers()).resolves.toMatchObject([
//             {
//                 id: 89,
//                 username: "RandomUser",
//                 password: "qwerty"
//             },
//             {
//                 id: 123,
//                 username: "Juice",
//                 password: "Wrld"
//             }
//         ])
//     })
// })

// describe("create", () => {
//     let userService: UserService
//     let mockRepository: Repository<UserEntity>
//     let mock: sinon.SinonMock

//     beforeEach(async () => {
//         mockRepository = {} as Repository<UserEntity>
//         mockRepository = Object.assign(mockRepository, {
//             gg: new Function()
//         })
//         mock = sinon.mock(mockRepository)
//         mock.expects('gg').resolves(
//             GenericFactory.create<UserEntity>(UserEntity, {
//                 id: 1,
//                 username: "2",
//                 password: "2"
//             }))
//         userService = new UserService(mockRepository)
//     })
//     it("create", () => {
//         const user = new UserEntity()
//         user.id = 1
//         user.username = "2"
//         user.password = "2"
//         expect(userService.createUser(user)).resolves.toStrictEqual(user)
//         // expect(userService.createUser(user)).toReturn()
//     })
// })

describe("user", () => {
    it("wf", () => {
        console.log("wf")
    })
})
// // -----------------------------------------------------------------------------------------------------------

// describe("getSecure", () => {
//     let controller: UserController
//     let service: UserService

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [UserController],
//             providers: [
//                 {
//                     provide: UserService, useFactory: () => ({
//                         getSecure: jest.fn(() => "Hello, New user"),
//                         getAllUsers: jest.fn(() => [
//                             {
//                                 id: 1,
//                                 username: "2",
//                                 password: "2",
//                                 userGroups: [],
//                                 userRole: UserRole.STUDENT,
//                                 created: new Date(),
//                                 updated: new Date()
//                             }
//                         ])
//                     })
//                 }
//             ],
//             // imports: [UserModule]
//             // imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([UserEntity])]
//         }).compile();
//         controller = module.get<UserController>(UserController);
//         service = module.get<UserService>(UserService)
//     })
//     it("getSecure", async () => {
//         expect(service.getSecure()).toBe("Hello, New user")
//     })
//     it("getttUsers", async () => {
//         const users: any[] = [
//             {
//                 id: 1,
//                 username: "2",
//                 password: "2",
//                 userGroups: [],
//                 userRole: UserRole.STUDENT,
//                 created: new Date(),
//                 updated: new Date()
//             }
//         ]
//         expect(service.getAllUsers()).toStrictEqual(users)
//     })

// })
// // -----------------------------------------------------------------------------------------------------------

  // it('SHOULD BE!', async () => {
    //     const result = "Hello, New user"
    //     // console.log(result)
    //     jest.spyOn(controller, "getSecure").mockImplementation(() => result);
    //     expect(await controller.getSecure()).toBe(result);
    // });
    // fit("create User", async () => {
    //     const user: any = {
    //         id: 25,
    //         username: "2",
    //         password: "2",
    //     }
    //     jest.spyOn(controller, "createUser").mockImplementation(() => user);
    //     expect(await controller.createUser(user)).toBe(user);
    // })

// describe("createUser", () => {
//     let controller: UserController

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [UserController],
//             providers: [UserService],
//             imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([UserEntity])]
//         }).compile();
//         controller = module.get<UserController>(UserController);
//     })
//     fit("create User", async () => {
//         const user: any = {
//             id: 25,
//             username: "2",
//             password: "2",
//             // userRole: "STUDENT",
//             // created: "2020-04-17T12:07:28.000Z",
//             // updated: "2020-04-17T12:07:28.000Z"
//         }
//         jest.spyOn(controller, "createUser").mockImplementation(() => user);
//         expect(await controller.createUser(user)).toBe(user);
//     })
// })