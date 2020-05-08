import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionEntity } from './action.entity';
import { IActionDto, IActionExecutionBodyDto } from '@stepflow/shared';
// const vm = require("vm")
// import * as vm from "vm"

@Injectable()
export class ActionService {
    constructor(
        @InjectRepository(ActionEntity)
        private readonly actionRepository: Repository<ActionEntity>,
    ) { }

    async getActionById(id: string): Promise<ActionEntity> {
        const action = await this.actionRepository.findOne(id)
        return action
    }

    async createNewActions(actions: IActionDto[]): Promise<ActionEntity[]> {
        if (actions && actions.length) {
            return await this.actionRepository.save(actions)
        }
    }

    // createAction(actionDto: IActionDto): ActionEntity {
    //     const { name, description, body, alias, actionType } = actionDto
    //     const newAction = new ActionEntity()
    //     newAction.name = name
    //     newAction.description = description
    //     newAction.body = body
    //     newAction.alias = alias
    //     newAction.actionType = actionType
    //     return newAction
    // }

    // async executeAction(body: IActionExecutionBodyDto): Promise<any> {
    //     const action = await this.getActionById(body.actionId)
    //     if (action) {
    //         const context = body.inputData
    //         const script = new vm.Script(`${action.body}`);
    //         vm.createContext(context)
    //         script.runInContext(context);

    //         return context
    //     } else {
    //         throw new InternalServerErrorException("Action was not found")
    //     }
    // }
}
