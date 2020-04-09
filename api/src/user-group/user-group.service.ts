import { Answer } from './../answer/answer.entity';
import { WorkflowStep } from './../wf-step/wf-step.entity';
import { IUserGroupDto, IUserGroupBaseDto, IUserGroupEntityDto } from "@stepflow/shared";
import { Repository, getRepository } from 'typeorm';
import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity } from './user-group.entity';
import { UserRole, UserEntity } from './../user/user.entity';
import { Workflow } from "../workflow/workflow.entity";

@Injectable()
export class UserGroupService implements OnModuleInit {
    constructor(
        @InjectRepository(UserGroupEntity) private readonly userGroupRepo: Repository<UserGroupEntity>,
        @InjectRepository(Workflow) private readonly workflowRepo: Repository<Workflow>,
        @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>
    ) { }

    async onModuleInit() {
        //generate default user group
        const group = await this.userGroupRepo.save({
            groupName: "Какая-то группа 123",
            users: [
                {
                    username: "2",
                    password: "2",
                    userRole: UserRole.STUDENT,
                },
                {
                    username: "3",
                    password: "3",
                    userRole: UserRole.STUDENT,
                }
            ]
        });
        await this.workflowRepo.save([
            {
                name: 'workflow 1',
                description: 'описание 111',
                input: {
                    "someInput": "someInput data"
                },
                actions: [{
                    "name": "workflowAction",
                    "description": "action to find the SUMM",
                    "body":
                        "function fn(a,b,h){return (a+b+h)}; res = fn(a,b,h)",
                    "version": "1.0",
                    "alias": "action alias 735"
                }],
                steps: [
                    {
                        name: 'one',
                        description: '000',
                        actions: [{
                            "name": "firstAction",
                            "description": "action to find the area",
                            "body":
                                "function fn(a,b,h){return (a+b)*h/2}; function checkAnswer(res, answer){if(res===submittedAnswer){return 'correct'}else{return 'wrong'}}; res = fn(a,b,h); answerIs = checkAnswer(res, submittedAnswer)",
                            "version": "1.0",
                            "alias": "action alias 123"
                        }],
                        input: {
                            "a": 45,
                            "b": 25,
                            "h": 12
                        },
                    },
                    {
                        name: 'two',
                        description: 'second action',
                        actions: [{
                            "name": "firstAction",
                            "description": "action to find the area",
                            "body":
                                "function fn(a,b,h){return (a+b)*h/2}; function checkAnswer(res, answer){if(res===submittedAnswer){return 'correct'}else{return 'wrong'}}; res = fn(a,b,h); answerIs = checkAnswer(res, submittedAnswer)",
                            "version": "1.0",
                            "alias": "action alias 531"
                        }],
                        input: {
                            "a": 5,
                            "b": 5,
                            "h": 7
                        },
                    }
                ],
                userGroups: [group]
            },
            {
                name: 'workflow 2',
                description: 'какое-то описание',
                steps: [
                    {
                        name: 'один',
                        description: 'description1',
                        answer: {
                            answer: "123"
                        }
                    },
                    {
                        name: 'два',
                        description: 'description2',
                        answer: {
                            answer: "ку"
                        },
                    },
                    {
                        name: 'три',
                        description: 'description3',
                        answer: {
                            answer: "привет"
                        }
                    }
                ],
                userGroups: [group]
            },
        ]);
    }

    get(): string {
        return "Hello, New group!"
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
