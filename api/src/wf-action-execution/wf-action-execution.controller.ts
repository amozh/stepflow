import { Controller, Get } from '@nestjs/common';
import {WfActionExecutionService} from "./wf-action-execution.service"

@Controller('wf-action-execution')
export class WfActionExecutionController {
    constructor(private readonly WfActionExecutionService: WfActionExecutionService) { }

    @Get()
    getWfActionExecution(): string {
        return this.WfActionExecutionService.getWfActionExecution()
    }
}
