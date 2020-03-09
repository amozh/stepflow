import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WokrflowExecution } from "./wf-executions.entity"

@Injectable()
export class WfExecutionsService {
    constructor(
        @InjectRepository(WokrflowExecution)
        private readonly wfExecutionRepository: Repository<WokrflowExecution>,
    ) { }

    getWfExecution(): string {
        return "Workflow execution!"
    }
}
