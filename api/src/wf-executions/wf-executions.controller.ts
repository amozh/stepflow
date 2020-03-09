import { Controller, Get } from '@nestjs/common';
import { WfExecutionsService } from "./wf-executions.service"

@Controller('wf-executions')
export class WfExecutionsController {
    constructor(private readonly wfExecutionsService: WfExecutionsService) { }

    @Get()
    getAction(): string {
        return this.wfExecutionsService.getWfExecution()
    }
}
