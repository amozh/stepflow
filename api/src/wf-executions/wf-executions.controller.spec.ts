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
import { WorkflowExecutionStatus } from "./wf-executions.entity"
import { WfActionExecutionService } from "../wf-action-execution/wf-action-execution.service"
import { WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

//User imports
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module'

const app = "http://localhost:4000"

describe("user", () => {
  it("wf", () => {
    console.log("wf")
  })
})

describe("e2e test action", () => {
  // Подготовка данных
  // Выполнение бизнес логики
  // Проверка результатов
  // Очистка данных
  let wfId: number;
  let wfStepId: number;
  let wfExecutionId: number;
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
        wfExecutionId = body.id
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
    await request(app)
      .delete(`/wf-executions/${wfExecutionId}`)
    return await request(app)
      .delete(`/workflows/${wfId}`)
  })
})

// у компонента должен быть доступ к input & state
fdescribe('unit test action', () => {
  let testingModule: TestingModule
  let stepExecutionService: WfStepExecutionService
  let wfExecutionsService: WfExecutionsService
  let wfExecutionController: WfExecutionsController

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [WfExecutionsController],
      providers: [
        {
          provide: WfStepExecutionService, useFactory: () => ({
            startWfStepExecution: jest.fn(() => true),
            completeWfStepExecution: jest.fn(() => true),
            submitWfStepExecution: jest.fn(() => true),
            executeCustomWorkflowStepAction: jest.fn(() => true)
          })
        },
        {
          provide: WfExecutionsService, useFactory: () => ({
            createWfExecution: jest.fn((workflowId: number) => ({
              id: 1,
              workflow_id: workflowId,
              name: "WfExecution",
              description: "Some description",
              input: {},
              state: null,
              status: WorkflowExecutionStatus.NOT_STARTED,
              created: new Date(),
              updated: new Date(),
              wfStepsExecution: [],
              wfActionsExecution: []
            })),
            getWfExecution: jest.fn((id: number) => ({
              id,
              workflow_id: 1,
              name: "name",
              description: "description",
              input: {},
              state: null,
              status: WorkflowExecutionStatus.NOT_STARTED,
              created: new Date(),
              updated: new Date(),
              wfStepsExecution: [],
              wfActionsExecution: []
            })),
            getAllWfExecution: jest.fn(() => [
              {
                id: 1,
                workflow_id: 1,
                name: "name",
                description: "description",
                input: {},
                state: null,
                status: WorkflowExecutionStatus.NOT_STARTED,
                created: new Date(),
                updated: new Date(),
                wfStepsExecution: [],
                wfActionsExecution: []
              }
            ])
          })
        },
        {
          provide: WfActionExecutionService, useFactory: () => ({})
        }
      ]
    }).compile();
    wfExecutionController = testingModule.get<WfExecutionsController>(WfExecutionsController);
    wfExecutionsService = testingModule.get<WfExecutionsService>(WfExecutionsService)
    stepExecutionService = testingModule.get<WfStepExecutionService>(WfStepExecutionService)
  })

  it("getAllWfExecution", () => {
    const wf = wfExecutionsService.getAllWfExecution()
    expect(wf).toEqual([
      {
        id: 1,
        workflow_id: 1,
        name: "name",
        description: "description",
        input: {},
        state: null,
        status: WorkflowExecutionStatus.NOT_STARTED,
        created: new Date(),
        updated: new Date(),
        wfStepsExecution: [],
        wfActionsExecution: []
      }
    ])
  })
  it("getWfExecution", async () => {
    wfExecutionController.getWfExecution(1123)
    expect(wfExecutionsService.getWfExecution).toHaveBeenCalledWith(1123)
    expect(wfExecutionsService.getWfExecution(999)).toStrictEqual({
      id: 999,
      workflow_id: 1,
      name: "name",
      description: "description",
      input: {},
      state: null,
      status: WorkflowExecutionStatus.NOT_STARTED,
      created: new Date(),
      updated: new Date(),
      wfStepsExecution: [],
      wfActionsExecution: []
    })
  })
  it("createWfExecution", async () => {
    const newWorkflow = await wfExecutionController.createWfExecution({ workflowId: 1 })
    expect(newWorkflow).toBeDefined()
  })
  it("stepExecutionService", async () => {
    const startController = wfExecutionController.startWfStepExecution(1)
    const startAction = await stepExecutionService.startWfStepExecution(1)
    // console.log(startController, startAction, "startController???")
  })
})