import { HttpStatus } from '@nestjs/common';
import { UserDto } from '@stepflow/shared';
import { UserRole } from "../src/user/user.entity"
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from "../src/app.controller";
import { AppService } from '../src/app.service';
import * as request from "supertest";

const app = "http://localhost:4000"

describe('AppController (e2e)', () => {
    it('/ (GET)', () => {
        return request(app)
            .get('/')
            .expect(200)
            .expect("Hello World!")
            .then(res => console.log(res.text, "res"))
    })

    it("VovaUser", () => {
        const user = {
            name: "Putin",
            surname: "Vova"
        }
        return request(app)
            .post('/')
            .send(user)
            .expect(({ body }) => {
                expect(body.name).toBeDefined();
                expect(body.surname).toEqual("Vova");
                expect(body.age).toBeUndefined()
            })
            .expect(HttpStatus.CREATED)
    })

});

let appController: AppController;

beforeEach(async () => {
    const APP: TestingModule = await Test.createTestingModule({
        controllers: [AppController],
        providers: [AppService],
    }).compile();

    appController = APP.get<AppController>(AppController);
});

describe('root', () => {
    it('should return "Hello World!"', () => {
        expect(appController.getHello()).toBe('Hello World!');
    });
});

    // it("newUser", () => {
    //     const user = {
    //         name: "Putin",
    //         surname: "Vova",
    //         userRole: UserRole.STUDENT,
    //         userGroups: [
    //             {
    //                 groupName: "hello, obama!",
    //                 workflows: [{
    //                     name: "воркфлоу при создании юзера",
    //                     description: "описание вф юзера",
    //                     steps: [
    //                         {
    //                             name: "шаг при создании юзера",
    //                             description: "999"
    //                         }
    //                     ]
    //                 }]
    //             }]
    //     }
    //     return request(app)
    //         .post('/user')
    //         .set("Accept", "application-json")
    //         .send(user)
    //         .expect(({ body }) => {
    //             expect(body.name).toBeDefined();
    //             expect(body.surname).toEqual("Vova");
    //             expect(body.age).toBeUndefined()
    //             console.log(body, "createdUser!")
    //         })
    //         .expect(HttpStatus.CREATED)
    // })