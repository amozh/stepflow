import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WfStepActionExecutionService } from "./wf-step-action-execution.service"

@Controller('wf-step-action-execution')
export class WfStepActionExecutionController {
    constructor(private readonly wfStepActionExecutionService: WfStepActionExecutionService) { }

    @Get()
    getWfStepActionExecution(): string {
        return this.wfStepActionExecutionService.getWfStepActionExecution()
    }

    @Post()
    createStepActionExecution(@Body() body: { actionId: string, wfStepExecutionId: number }): Promise<any> {
        return this.wfStepActionExecutionService.createStepActionExecution(body)
    }
}
