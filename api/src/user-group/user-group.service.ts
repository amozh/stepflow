import { UserGroupDto } from "@stepflow/shared";
import { Repository } from 'typeorm';
import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity } from './user-group.entity';

@Injectable()
export class UserGroupService implements OnModuleInit {
    constructor(@InjectRepository(UserGroupEntity) private readonly userGroupRepo: Repository<UserGroupEntity>) { }
    onModuleInit() {
        //generate default user
        this.userGroupRepo.save({
            groupName: "Какая-то группа 123",
            workflows: [
                {
                    name: 'wf wf2',
                    description: 'описание',
                    steps: [
                        {
                            name: 'step222',
                            description: '000',
                            answer: {
                                answer: "obama"
                            }
                        },
                    ],
                }
            ]
        });
    }

    get(): string {
        return "Hello, New group!"
    }

    async getGroupById(id: number): Promise<UserGroupDto> {
        try {
            const group = await this.userGroupRepo.findOne({ id })
            return group
        } catch (e) {
            throw new NotFoundException(`User group with id ${id} is not found`)
        }
    }

    async createGroup(groupDto: UserGroupDto): Promise<UserGroupDto> {
        const { groupName, workflows, users } = groupDto
        const newGroup = new UserGroupEntity()
        newGroup.groupName = groupName
        newGroup.workflows = workflows
        newGroup.users = users

        await this.userGroupRepo.save(newGroup)
        return newGroup
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

    async updateGroup(id: number, userGroupDto: UserGroupDto): Promise<UserGroupDto> {
        try {
            const group = await this.userGroupRepo.findOne({ id })
            await this.userGroupRepo.update(group, userGroupDto)
            return userGroupDto
        } catch (e) {
            throw new NotFoundException(`Group with id ${id} is not found`)
        }
    }
}
