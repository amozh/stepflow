import { Controller, Get, Post, Param, ParseIntPipe, Put, Body } from '@nestjs/common';
import { WfStepExecutionService } from './wf-step-execution.service';


@Controller('wf-step-execution')
export class WfStepExecutionController {
    constructor(private readonly wfStepExecutionService: WfStepExecutionService) { }

    @Get()
    getWfStep(): string {
        return this.wfStepExecutionService.getWfStepExecution()
    }

    // @Post('step/:id')
    // createWfStepExecution(@Param('id', ParseIntPipe) stepId: number): Promise<any> {
    //     return this.wfStepExecutionService.createWfStepExecution(stepId)
    // }

    @Put(":id")
    updateWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.updateWfStepExecution(id, body)
    }
}
