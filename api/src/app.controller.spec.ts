// // import { Test, TestingModule } from '@nestjs/testing';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// // import * as request from "supertest";

// // const app = "http://localhost:4000"

// // describe('AppController (e2e)', () => {
// //     it('/ (GET)', () => {
// //         return request(app)
// //             .get('/')
// //             .expect(200)
// //             .expect("Hello World!")
// //     })
// //     // let appController: AppController;

// //     // beforeEach(async () => {
// //     //     const app: TestingModule = await Test.createTestingModule({
// //     //         controllers: [AppController],
// //     //         providers: [AppService],
// //     //     }).compile();

// //     //     appController = app.get<AppController>(AppController);
// //     // });

// //     // describe('root', () => {
// //     //     it('should return "Hello World!"', () => {
// //     //         expect(appController.getHello()).toBe('Hello World!');
// //     //     });
// //     // });
// // });

// import { HttpStatus } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import * as request from "supertest";

// import { UserDto } from '@stepflow/shared';
// import { UserRole } from "../src/user/user.entity"
// import { AppController } from "../src/app.controller";
// import { UserEntity } from "../src/user/user.entity"
// import { UserController } from "../src/user/user.controller"
// import { UserService } from "../src/user/user.service"
// import { AppService } from '../src/app.service';
// import { Workflow } from '../src/workflow/workflow.entity';

// const app = "http://localhost:4000"

// describe('AppController (e2e)', () => {
//     it('/ (GET)', () => {
//         return request(app)
//             .get('/')
//             .expect(200)
//             .expect("Hello World!")
//             .then(res => console.log(res.text, "res"))
//     })

//     it("VovaUser", () => {
//         const user = {
//             name: "Putin",
//             surname: "Vova"
//         }
//         return request(app)
//             .post('/')
//             .send(user)
//             .expect(({ body }) => {
//                 expect(body.name).toBeDefined();
//                 expect(body.surname).toEqual("Vova");
//                 expect(body.age).toBeUndefined()
//             })
//             .expect(HttpStatus.CREATED)
//     })
//     it("First workflow?", () => {
//         return request(app)
//             .get('/workflows/1')
//             .expect(({ body }) => {
//                 expect(body.name).toBeDefined();
//                 expect(body.name).toEqual("workflow 1");
//             })
//             .then(res => console.log(JSON.parse(res.text).name, "wf name?"))
//     })

// });

// let appController: AppController;

// beforeEach(async () => {
//     const APP: TestingModule = await Test.createTestingModule({
//         controllers: [AppController],
//         providers: [AppService],
//     }).compile();

//     appController = APP.get<AppController>(AppController);
// });

describe("app", () => {
    it("app", () => {
        console.log("app")
    })
})