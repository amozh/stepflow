import { Controller, Get, Post, Body, Param, ParseIntPipe, Put } from '@nestjs/common';
import { WfExecutionsService } from "./wf-executions.service"
import { IWorkflowExecutionDto } from '@stepflow/shared';

@Controller('wf-executions')
export class WfExecutionsController {
    constructor(private readonly wfExecutionsService: WfExecutionsService) { }

    @Get(":id")
    getWfExecution(@Param('id', ParseIntPipe) id: number): Promise<IWorkflowExecutionDto> {
        return this.wfExecutionsService.getWfExecution(id)
    }

    @Post('workflow/:id')
    createWfExecution(@Param('id', ParseIntPipe) workflowId: number): Promise<IWorkflowExecutionDto> {
        return this.wfExecutionsService.createWfExecution(workflowId)
    }

    @Put(":id")
    updateWfExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfExecutionsService.updateWfExecution(id, body)
    }
}
