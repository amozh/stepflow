import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfActionExecutionEntity } from "./wf-action-execution.entity"

@Injectable()
export class WfActionExecutionService {
    constructor(
        @InjectRepository(WfActionExecutionEntity)
        private readonly wfExecutionRepository: Repository<WfActionExecutionEntity>,
    ) { }

    getWfActionExecution(): string {
        return "Workflow action execution"
    }
}
