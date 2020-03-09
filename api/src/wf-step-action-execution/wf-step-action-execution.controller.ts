import { Controller, Get } from '@nestjs/common';
import { WfStepActionExecutionService } from "./wf-step-action-execution.service"

@Controller('wf-step-action-execution')
export class WfStepActionExecutionController {
    constructor(private readonly wfStepActionExecutionService: WfStepActionExecutionService) { }

    @Get()
    getWfStepActionExecution(): string {
        return this.wfStepActionExecutionService.getWfStepActionExecution()
    }
}
