import { IUserGroupDto, IUserGroupBaseDto, IUserGroupEntityDto } from "@stepflow/shared";
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity } from './user-group.entity';
import { UserEntity } from './../user/user.entity';
import { Workflow } from "../workflow/workflow.entity";
import { ActionType } from "../action/action.entity"

@Injectable()
// export class UserGroupService implements OnModuleInit
export class UserGroupService implements OnModuleInit {
    constructor(
        @InjectRepository(UserGroupEntity) private readonly userGroupRepo: Repository<UserGroupEntity>,
        @InjectRepository(Workflow) private readonly workflowRepo: Repository<Workflow>,
        // @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>
    ) { }

    async onModuleInit() {
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
                actions: [{
                    name: "workflowAction",
                    description: "action to find the SUMM",
                    body: "function fn(a,b,h){return (a+b+h)}; res = fn(a,b,h)",
                    version: "1.0",
                    alias: "action alias 735"
                }],
                steps: [
                    {
                        name: 'one',
                        description: '000',
                        actions: [{
                            name: "firstAction",
                            description: "action to find the area",
                            body: "function fn(a,b){const result ={res:a+b, larger:a+b>100, smaller:a+b>10}; return result};  res = fn(stepInput.a, stepInput.b);",
                            version: "1.0",
                            alias: "action alias 123"
                        },
                        {
                            name: "secondAction",
                            description: "action to find the area",
                            body: "function fn(a,b,c){return a+b+c};  res = fn(stepInput.a, stepInput.b, submittedData.numberToCheck);",
                            version: "1.0",
                            alias: "action alias 125",
                            actionType: ActionType.ON_SUBMIT
                        },
                        {
                            name: "thirdAction",
                            description: "action to find the area",
                            body: "function fn(a,b){return a+b};  res = fn(stepInput.a, stepInput.b);",
                            version: "1.0",
                            alias: "action alias 135",
                            actionType: ActionType.ON_COMPLETE
                        }, {
                            name: "fourthAction",
                            description: "action to find the area",
                            body: "function fn(a,b){return a+b};  res = fn(submittedData.stepInput.a, submittedData.stepInput.b);",
                            version: "1.0",
                            alias: "action alias 139",
                            actionType: ActionType.ON_COMPLETE
                        }],
                        input: { a: 24, b: 41 },
                    },
                    {
                        name: 'two',
                        description: 'secondStepAction',
                        actions: [{
                            name: "workflow two action",
                            description: "action to find the area",
                            body:
                                "function fn(a,b,h){return (a+b)*h/2}; function checkAnswer(res, answer){if(res===submittedAnswer){return 'correct'}else{return 'wrong'}}; res = fn(a,b,h); answerIs = checkAnswer(res, submittedAnswer)",
                            version: "1.0",
                            alias: "action alias 531"
                        }],
                        input: {
                            a: 5,
                            b: 5,
                            h: 7
                        },
                    }
                ],
                userGroups: [group]
            }
        );
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
