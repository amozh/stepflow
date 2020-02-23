import { Answer } from './../answer/answer.entity';
import { WorkflowStep } from './../wf-step/wf-step.entity';
import { UserGroupDto } from "@stepflow/shared";
import { Repository } from 'typeorm';
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
                steps: [
                    {
                        name: 'one',
                        description: '000',
                        answer: {
                            answer: "obama"
                        }
                    },
                    {
                        name: 'two',
                        description: 'dawwad',
                        answer: {
                            answer: "obama2"
                        }
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
                        }
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

    async getGroupById(id: number): Promise<UserGroupDto> {
        try {
            const group = await this.userGroupRepo.findOne({ id })
            // console.log(group,id, "группа?")
            return group
        } catch (e) {
            throw new NotFoundException(`User group with id ${id} is not found`)
        }
    }
    async getGroupsByUserId(id: number): Promise<UserGroupDto[]> {
        try {
            const usersInGroup = await this.userGroupRepo.find({
                relations: ["users"], //Достань все группы, которые принадлежат юзеру с этим id
                where: {
                    userGroupId: id
                }
            })
            return usersInGroup
        } catch (e) {
            throw new NotFoundException(`User group with id ${id} is not found`)
        }
    }



    async createGroup(groupDto: UserGroupDto): Promise<UserGroupDto> {
        const { groupName, workflows, users } = groupDto
        const newGroup = new UserGroupEntity()
        // newGroup.users = users

        // Найдёт всех юзеров, которые подходят под условия, которые были переданы со стороны клиента (массив users)
        // const allUsers = await this.usersRepo.find({
        //     relations: ["userGroups"],
        //     where: {
        //         users: users
        //     }
        // })
        // // this.userGroupRepo.findByIds
        // console.log(allUsers, "allUsers")
        newGroup.users = users
        newGroup.groupName = groupName
        newGroup.workflows = workflows
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

    async updateGroup(id: number, userGroupDto: UserGroupDto): Promise<any> {
        const { groupName, workflows, users } = userGroupDto

        // const updatedWf = workflows && workflows.map(wf => {
        //     const workflow = new Workflow()
        //     const wokflowSteps = wf.steps.map(step => {
        //         const workflowStep = new WorkflowStep();
        //         const stepAnswer = new Answer();
        //         stepAnswer.answer = step.answer.answer
        //         workflowStep.answer = stepAnswer;
        //         workflowStep.name = step.name;
        //         workflowStep.description = step.description;

        //         return workflowStep;
        //     });
        //     workflow.name = wf.name;
        //     workflow.description = wf.description;
        //     workflow.steps = wokflowSteps;
        //     return workflow
        // })

        // const updatedUs = users && users.map(us => {
        //     const user = new UserEntity()
        //     user.username = us.username
        //     user.password = us.password
        //     return user
        // })

        // // Сохранить изменения для таблиц Wokrflow и Users только в том случае, если они !== undefined
        // if (updatedWf) {
        //     await this.workflowRepo.save(updatedWf)
        // }
        // if (updatedUs) { await this.usersRepo.save(updatedUs) }
        try {
            const group = await this.userGroupRepo.findOne({ id })
            // // Таким образом можно достать информацию в связи Many to Many
            // const usersInGroup = await this.usersRepo.find({
            //     relations: ["userGroups"] //Достань всех юзеров, которые принадлежат связи с userGroups
            // })
            // const workflowInGroup = await this.workflowRepo.find({
            //     relations: ["userGroups"] //Достань все воркфлоу, которые принадлежат связи с userGroups
            // })

            // group.groupName = groupName
            // group.workflows = [...workflowInGroup]
            // group.users = [...usersInGroup]

            group.groupName = groupName
            group.workflows = workflows
            group.users = users

            const res = await this.userGroupRepo.save(group)
            return res
        } catch (e) {
            console.log(e)
            throw new NotFoundException(`Group with id ${id} is not found`)
            // throw new NotFoundException(e)
        }
    }
}
