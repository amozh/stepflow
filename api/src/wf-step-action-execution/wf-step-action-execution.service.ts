import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepActionExecutionEntity } from './wf-step-action-execution.entity';

@Injectable()
export class WfStepActionExecutionService {
    constructor(
        @InjectRepository(WfStepActionExecutionEntity)
        private readonly wfExecutionRepository: Repository<WfStepActionExecutionEntity>,
    ) { }

    getWfStepActionExecution():string{
        return "Workflow step action execution"
    }
}
