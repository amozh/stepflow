import { Controller, Get } from '@nestjs/common';
import { WfStepExecutionService } from './wf-step-execution.service';


@Controller('wf-step-execution')
export class WfStepExecutionController {
    constructor(private readonly wfStepExecutionService: WfStepExecutionService) { }

    @Get()
    getWfStep(): string {
        return this.wfStepExecutionService.getWfStepExecution()
    }
}
