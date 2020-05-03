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
                body: "function fn(){ return {status:'COMPLETE',action:'onstart!!!'}} res = fn()",
                version: "1.0",
                alias: "action alias 10223123",
                actionType: ActionType.ON_START
              },
              {
                name: "firstAction",
                description: "action to find the area",
                body: "function fn(info){for (var i = 0; i < info.length; i++) { if (info[i].isCorrect){ workflowInput.mark++}}; return {status:'COMPLETE', mark: workflowInput.mark, answers:info}}; res = fn(submittedData.submitInfo)",
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
                        question: "Протяжність України із заходу на схід?",
                        options: [
                          { value: "928,45 км", isCorrect: false },
                          { value: "1634,82 км", isCorrect: false },
                          { value: "1316,92 км", isCorrect: true }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 2,
                      componentType: "test",
                      data: {
                        question: "Висота найвищої гори України?",
                        options: [
                          { value: "2 061 м", isCorrect: true },
                          { value: "2 244 м", isCorrect: false },
                          { value: "1 925 м", isCorrect: false }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 3,
                      componentType: "test",
                      data: {
                        question: "Населення міста Київ?",
                        options: [
                          { value: "3,356 мільйона", isCorrect: false },
                          { value: "2,884 мільйона", isCorrect: true },
                          { value: "1,945 мільйона", isCorrect: false }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 4,
                      componentType: "test",
                      data: {
                        question: "Найдовша річка України?",
                        options: [
                          { value: "Дніпро", isCorrect: true },
                          { value: "Дністер", isCorrect: false },
                          { value: "Південний Буг", isCorrect: false }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 5,
                      componentType: "test",
                      data: {
                        question: "Вгадай число від 1 до 3",
                        options: [
                          { value: "1", isCorrect: false },
                          { value: "2", isCorrect: false },
                          { value: "3", isCorrect: true }
                        ]
                      }
                    }
                  },
                  {
                    component: {
                      id: 6,
                      componentType: "button", 
                      label: "Кнопка"
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
              description: "action to find the area",
              body:
                "function fn(a,b,h){return (a+b)*h/2}; function checkAnswer(res, answer){if(res===submittedAnswer){return 'correct'}else{return 'wrong'}}; res = fn(a,b,h); answerIs = checkAnswer(res, submittedAnswer)",
              version: "1.0",
              alias: "action alias 126"
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
