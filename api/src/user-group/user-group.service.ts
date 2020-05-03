import { IUserGroupDto, IUserGroupBaseDto, IUserGroupEntityDto } from "@stepflow/shared";
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity } from './user-group.entity';
import { UserEntity } from './../user/user.entity';
import { Workflow } from "../workflow/workflow.entity";
// import { ActionType } from "api/dist/wf-step-action-execution/wf-step-action-execution.entity";

@Injectable()
// export class UserGroupService implements OnModuleInit
export class UserGroupService implements OnModuleInit { 
  constructor(
    @InjectRepository(UserGroupEntity) private readonly userGroupRepo: Repository<UserGroupEntity>,
    @InjectRepository(Workflow) private readonly workflowRepo: Repository<Workflow>,
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity> 
  ) { } 

  async onModuleInit() {
    enum ActionType {
      ON_START = "ON_START",
      ON_SUBMIT = "ON_SUBMIT",
      ON_COMPLETE = "ON_COMPLETE",
      CUSTOM = "CUSTOM"
    }

    //generate default user group
    const group = await this.userGroupRepo.save({
      groupName: "Какая-то группа 123",
      users: [
        {
          username: "2",
          password: "2",
          // userRole: UserRole.STUDENT,
        },
        {
          username: "3",
          password: "3",
          // userRole: UserRole.STUDENT,
        }
      ]
    });
    await this.workflowRepo.save(
      {
        name: "workflow 1",
        description: 'описание 111', 
        input: {
          someInput: "someInput data"
        },
        actions: [],
        steps: [
          {
            name: 'one',
            description: '000',
            actions: [{
              name: "firstAction",
              description: "action to find the area",
              body:
                "function fn(){return {status:'COMPLETE'}}; res = fn()",
              version: "1.0",
              alias: "action alias 123",
              actionType: ActionType.ON_START
            }],
            input: {
              a: 45,
              b: 25,
              h: 12
            },
            stepViewJson: { componentType: "button" }
          },
        ],
        userGroups: [group]
      }
    );
    await this.workflowRepo.save(
      {
        name: "Test for students",
        description: "Test consist of five question. You should score three or more points to pass the test", //
        input: {
          minMark: 3,
          mark: 0,
          isTestSuccessful: false
        },
        steps: [
          {
            name: "test",
            description: "test for students",
            actions: [
              {
                name: "firsstAction",
                description: "action to find the area",
                body: "function fn(){ return {status:'STARTED',action:'onstart!!!'}} res = fn()",
                version: "1.0",
                alias: "action alias 10223123",
                actionType: ActionType.ON_START
              },
              {
                name: "firstAction",
                description: "action to find the area",
                body: "function fn(info){for (var i = 0; i < info.length; i++) { if (info[i].isCorrect){ workflowInput.mark++}}; return {...currentState, status:'COMPLETE', mark: workflowInput.mark, answers:info}}; res = fn(submittedData.submitInfo)",
                version: "1.0",
                alias: "action alias 10123",
                actionType: ActionType.ON_SUBMIT
              }
            ],
            input: {
              a: 45,
              b: 25,
              h: 12
            },
            stepViewJson: {
              stepViewElement:
                [
                  {
                    component: {
                      id: 1,
                      componentType: "test",
                      data: {
                        question: "20 + 90?",
                        options: [
                          { value: "130", isCorrect: false },
                          { value: "120", isCorrect: false },
                          { value: "110", isCorrect: true }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 2,
                      componentType: "test",
                      data: {
                        question: "290-120?",
                        options: [
                          { value: "170", isCorrect: true },
                          { value: "180", isCorrect: false },
                          { value: "190", isCorrect: false }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 3,
                      componentType: "test",
                      data: {
                        question: "20/5?",
                        options: [
                          { value: "3", isCorrect: false },
                          { value: "4", isCorrect: true },
                          { value: "5", isCorrect: false }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 4,
                      componentType: "test",
                      data: {
                        question: "5*5?",
                        options: [
                          { value: "25", isCorrect: true },
                          { value: "35", isCorrect: false },
                          { value: "10", isCorrect: false }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 5,
                      componentType: "test",
                      data: {
                        question: "2*X=10?",
                        options: [
                          { value: "X=3", isCorrect: false },
                          { value: "X=4", isCorrect: false },
                          { value: "X=5", isCorrect: true }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 6,
                      componentType: "button",
                      label: "Завершити тест"
                    },
                    onClick: "submit",
                    data: [{ source: "input" }] // для submittedData (информация, которую отправит юзер) 
                  }
                ]
            }
          },
          {
            name: 'Results',
            description: 'Show result',
            actions: [{
              name: "showResult",
              description: "action show result",
              body:
              "function fn(){if (currentState.mark >= workflowInput.minMark){workflowInput.isTestSuccessful = true};return {status:'STARTED', isTestSuccessful:true}; res = fn()",
              version: "1.0",
              alias: "action alias 126",
              actionType: ActionType.ON_START
            }],
            input: {
              a: 5,
              b: 5,
              h: 7
            },
            stepViewJson: {
              stepViewElement:
                [
                  {
                    component: {
                      id: 10,
                      componentType: "json",
                    }
                  },
                  {
                    component: {
                      id: 11,
                      componentType: "button",
                      label: "Вийти"
                    },
                    onClick: "submit",
                    data: [{ source: "input" }]
                  } 
                ]
            }
          }
        ]
      })
  }

  async getGroupById(id: number): Promise<UserGroupEntity> {
    try {
      const group = await this.userGroupRepo.findOne({ id })
      return group
    } catch (e) {
      throw new NotFoundException(`User group with id ${id} is not found`)
    } 
  }

  async createGroup(groupDto: IUserGroupBaseDto): Promise<UserGroupEntity> {
    const { groupName, workflows, users } = groupDto
    const newGroup = new UserGroupEntity()
    newGroup.groupName = groupName
    newGroup.workflows = workflows
    newGroup.users = users
    return await this.userGroupRepo.save(newGroup)
  }

  async deleteGroup(id: number): Promise<string> {
    try {
      const group = await this.userGroupRepo.findOne({ id })
      await this.userGroupRepo.remove(group)
      return `Group with id ${id} has been deleted`
    } catch (e) {
      throw new NotFoundException(`Group with id ${id} is not found`)
    }
  }

  async updateGroup(id: number, userGroupDto: IUserGroupDto): Promise<UserGroupEntity> {
    const { groupName, workflows, users } = userGroupDto
    try {
      const group = await this.userGroupRepo.findOne({ id })
      group.groupName = groupName
      group.workflows = workflows
      group.users = users
      return await this.userGroupRepo.save(group)
    } catch (e) {
      throw new NotFoundException(`Group with id ${id} is not found`)
    }
  }
}
