import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from "supertest";

const app = "http://localhost:4000"

describe('AppController (e2e)', () => {
    it('/ (GET)', () => {
        return request(app)
            .get('/')
            .expect(200)
            .expect("Hello World!")
    })
    // let appController: AppController;

    // beforeEach(async () => {
    //     const app: TestingModule = await Test.createTestingModule({
    //         controllers: [AppController],
    //         providers: [AppService],
    //     }).compile();

    //     appController = app.get<AppController>(AppController);
    // });

    // describe('root', () => {
    //     it('should return "Hello World!"', () => {
    //         expect(appController.getHello()).toBe('Hello World!');
    //     });
    // });
});
