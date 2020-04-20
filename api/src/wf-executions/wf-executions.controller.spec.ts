import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from "supertest";
import { ICreateWorkflowDto } from '@stepflow/shared';

import { AppController } from "../../src/app.controller";
import { AppService } from '../../src/app.service';
import { ActionType } from "../action/action.entity"

//Wf imports
import { WfExecutionsController } from './wf-executions.controller';
import { WfExecutionsService } from './wf-executions.service';
import { WfActionExecutionService } from "../wf-action-execution/wf-action-execution.service"
import { WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

//User imports
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module'
// import { request } from 'express';

// describe('testing conroller', () => {
//   let userC: UserController;

//   beforeEach(async () => {
//     const APP: TestingModule = await Test.createTestingModule({
//       // imports: [TypeOrmModule.forFeature([UserEntity])],
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     userC = APP.get<UserController>(UserController);
//   });

//   it('USER DEFINED!', () => {
//     expect(userC).toBeDefined();
//   });
// })

// describe('testing conroller', () => {
//   let app: INestApplication;
//   let userService = { getAllUsers: () => [] };

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [UserModule],
//       // controllers: [AppController],
//       // providers: [AppService],
//     })
//       .overrideProvider(UserService)
//       .useValue(userService)
//       .compile();

//     app = moduleRef.createNestApplication();
//     await app.init();
//   });

//   it('USERS DEFINED!', () => {
//     // console.log(app.getHttpServer(), "SERVER???")
//     // return request("http://localhost:4000").get("/user").expect(200)
//     // "http://localhost:4000/user"
//     // expect(userC).toBeDefined();
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// })

// describe('testing conroller', () => {
//   let appController: AppController;

//   beforeEach(async () => {
//     const APP: TestingModule = await Test.createTestingModule({
//       controllers: [AppController],
//       providers: [AppService],
//     }).compile();

//     appController = APP.get<AppController>(AppController);
//   });

//   it('should be defined', () => {
//     expect(appController).toBeDefined();
//   });
// })

// ---------------------------------------------------------------------------------------

// describe('WfExecutions Controller', () => {
//   let wfController: WfExecutionsController;
//   let service: any
//   // let wfService:

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [WfExecutionsController],
//       providers: [WfExecutionsService, WfActionExecutionService, WfStepExecutionService],
//     }).compile();

//     wfController = module.get(WfExecutionsController);
//     // service = module.get<WfExecutionsService>(WfExecutionsService);
//   });

//   it('should be defined', () => {
//     expect(wfController).toBeDefined();
//   });
// })

// -----------------------------------------------------------------------------------
// it('should take users', () => {
//   return request(app)
//     .get("/user")
//     .expect(200)
//     .expect(({ body }) => {
//       body.forEach(user => {
//         expect(user.id).toBeDefined()
//         expect(user.username).toBeDefined()
//         expect(user.password).toBeDefined()
//         // expect(user.userRole).toEqual("ADMIN")
//       });
//     })
// })

// it("Create random user", () => {
//   const name = `${new Date()}`
//   const pass = `${Math.random()}`
//   const user = {
//     username: name,
//     password: pass
//   }
//   return request(app)
//     .post('/user')
//     .set("Accept", "application/json")
//     .send(user)
//     .expect(({ body }) => {
//       expect(body.username).toBeDefined();
//       expect(body.username).toEqual(name)
//       expect(body.password).toEqual(pass);
//       expect(body.created).toBeDefined()
//       expect(body.id).toBeDefined()
//     })
//     .expect(HttpStatus.CREATED)
// })

// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
const app = "http://localhost:4000"

fdescribe("ALL USERS", () => {
  // it("wf", () => {
  //   console.log("wf")
  // })

  // Подготовка данных
  // Выполнение бизнес логики
  // Проверка результатов
  // Очистка данных

  // вызывать в одном beforeAll 2 запроса
  // протестировать стейт воркфлоу
  // подключить лодаш к VM
  let wfId: number;
  let wfStepId: number;
  let customActionAlias: string;

  beforeAll(() => {
    const workflow = {
      name: "Test Workflow",
      description:
        "Test description",
      input: {
        workflowInput: 10,
        workflowHelo: "hello",
        workflowNull: null
      },
      steps: [
        {
          name: "depth_2",
          depth: 1,
          description: "step with depth 2 some description",
          input: {
            a: 51,
            b: 14
          },
          steps: [],
          actions: [
            {
              name: "first_ACTION",
              actionType: ActionType.ON_START,
              description: "first ACTION description",
              alias: `Alias ${Math.random()}`,
              body: "function fn(a,b){const result ={res:a+b,workflowHello:workflowInput.workflowHelo, isNull:workflowInput.workflowNull, larger:a+b>100, smaller:a+b>10}; return result};  res = fn(stepInput.a, stepInput.b);"
            },
            {
              name: "first_ACTION",
              actionType: ActionType.ON_SUBMIT,
              description: "first ACTION description",
              alias: `Alias ${Math.random()}`,
              body: "function fn(a,b){const result ={res:a+b, isCorrect:(a+b)===submittedData.numberToCheck, isWrong:(a+b)===submittedData.numberToError, larger:a+b>100, smaller:a+b>10}; return result};  res = fn(stepInput.a, stepInput.b);"
            },
            {
              name: "first_ACTION",
              actionType: ActionType.ON_COMPLETE,
              description: "first ACTION description",
              alias: `Alias ${Math.random()}`,
              body: "function fn(a,b,c){const result ={res:a+b+c,larger:a+b>100, smaller:a+b>10}; return result};  res = fn(stepInput.a, stepInput.b, workflowInput.workflowInput);"
            },
            {
              name: "customAction",
              actionType: ActionType.CUSTOM,
              description: "first ACTION description",
              alias: `CUSTOM_ALIAS_${Math.random()}`, //, newStatus:submittedData.status
              body: "function fn(a,b){const result ={res:a+b,newStatus:submittedData.status}; return result}; res = fn(submittedData.stepInput.a, submittedData.stepInput.b);"
            }
          ]
        }
      ]
    }
    return request(app)
      .post("/workflows")
      .set("Accept", "application/json")
      .send(workflow)
      .expect(({ body }) => {
        wfId = body.id
      })
  })

  beforeAll(() => {
    return request(app)
      .post("/wf-executions")
      .set("Accept", "application/json")
      .send({
        workflowId: wfId
      }).expect(({ body }) => {
        customActionAlias = body.wfStepsExecution[0].wfStepActionExecutions.find(a => a.actionType === "CUSTOM").alias
        wfStepId = body.wfStepsExecution[0].id
      })

  })

  it("WfStepExecution onStart action", async () => {
    return await request(app)
      .put(`/wf-executions/step/start/${wfStepId}`)
      .set("Accept", "application/json")
      .expect(({ body }) => {
        expect(body.finalState).toBeDefined() //проверять стейт
        expect(body.finalState.res).toBe(65)
        expect(body.finalState.isNull).toBeNull()
        expect(body.finalState.workflowHello).toBe("hello")
        expect(body.finalState.larger).toBeFalsy()
        expect(body.finalState.smaller).toBeTruthy()
        expect(body.finalStatus).toBe("COMPLETE")
        expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
      })
  })
  it("WfStepExecution onSubmit action", () => {
    const stepSubmitBody = {
      numberToCheck: 65,
      numberToError: "65"
    }
    return request(app)
      .put(`/wf-executions/step/submit/${wfStepId}`)
      .set("Accept", "application/json")
      .send(stepSubmitBody)
      .expect(({ body }) => {
        expect(body.finalState).toBeDefined()
        expect(body.finalState.isCorrect).toBeTruthy()
        expect(body.finalState.isWrong).toBeFalsy()
        expect(body.finalState.res).toBe(65)
        expect(body.finalState.larger).toBeFalsy()
        expect(body.finalState.smaller).toBeTruthy()
        expect(body.finalStatus).toBe("COMPLETE")
        expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
      })
  })

  it("WfStepExecution onComplete action", () => {
    const stepSubmitBody = {
      numberToCheck: 65
    }
    return request(app)
      .put(`/wf-executions/step/complete/${wfStepId}`)
      .set("Accept", "application/json")
      .send(stepSubmitBody)
      .expect(({ body }) => {
        expect(body.finalState).toBeDefined()
        expect(body.finalState.res).toBe(75)
        expect(body.finalStatus).toBe("COMPLETE")
        expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
      })
  })

  it("WfStepExecution custom action", () => {
    const stepSubmitBody = {
      actionAlias: `${customActionAlias}`,
      input: {
        stepInput: { a: 134, b: 23 },
        workflowInput: {},
        submittedData: "submittedData 12345",
        state: {},
        status: "NEW_CUSTOM_STATUS"
      }
    }
    return request(app)
      .put(`/wf-executions/step/custom/${wfStepId}`)
      .set("Accept", "application/json")
      .send(stepSubmitBody)
      .expect(({ body }) => {
        expect(body.finalState).toBeDefined()
        expect(body.finalState.res).toBe(157)
        expect(body.finalState.newStatus).toBe("NEW_CUSTOM_STATUS")
        expect(body.finalStatus).toBe("COMPLETE")
        expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
      })
  })

  afterAll(async () => {
    return await request(app)
      .delete(`/workflows/${wfId}`)
  })

  // it("WfStepExecution onSubmit action", () => {
  //   const stepSubmitBody = {
  //     numberToCheck: 65
  //   }
  //   return request(app)
  //     .put("/wf-executions/step/submit/1")
  //     .set("Accept", "application/json")
  //     .send(stepSubmitBody)
  //     .expect(({ body }) => {
  //       expect(body.finalState).toBeDefined()
  //       expect(body.finalStatus).toBe("COMPLETE")
  //       expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
  //     })
  // })

  // it("WfStepExecution onComplete action", () => {
  //   const stepSubmitBody = {
  //     numberToCheck: 65
  //   }
  //   return request(app)
  //     .put("/wf-executions/step/complete/1")
  //     .set("Accept", "application/json")
  //     .send(stepSubmitBody)
  //     .expect(({ body }) => {
  //       expect(body.finalState).toBeDefined()
  //       expect(body.finalStatus).toBe("COMPLETE")
  //       expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
  //     })
  // })

  // it("WfStepExecution custom action", () => {
  //   const stepSubmitBody = {
  //     actionAlias: "action alias 139",
  //     input: {
  //       stepInput: { a: 134, b: 23 },
  //       workflowInput: {},
  //       submittedData: "submittedData 12345",
  //       state: null,
  //       status: "NOT_EXECUTED"
  //     }
  //   }
  //   return request(app)
  //     .put("/wf-executions/step/complete/1")
  //     .set("Accept", "application/json")
  //     .send(stepSubmitBody)
  //     .expect(({ body }) => {
  //       // console.log(body, "body?")
  //       expect(body.finalState).toBeDefined()
  //       expect(body.finalStatus).toBe("COMPLETE")
  //       expect(body.failedActions).toStrictEqual([]) //проверка на строгое равенство
  //     })
  // })
})