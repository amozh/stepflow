import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WfStepExecutionEntity } from "./wf-step-execution.entity"

@Injectable()
export class WfStepExecutionService {
    constructor(
        @InjectRepository(WfStepExecutionEntity)
        private readonly wfExecutionRepository: Repository<WfStepExecutionEntity>,
    ) { }

    getWfStepExecution(): string{
        return "Workflow step execution"
    }
}
