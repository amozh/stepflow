import { Controller, Get, Post, Body, Param, ParseIntPipe, Put } from '@nestjs/common';
import { WfExecutionsService } from "./wf-executions.service"
import { IWorkflowExecutionDto } from '@stepflow/shared';
import { IStepActionExecutionInput, WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

@Controller('wf-executions')
export class WfExecutionsController {
    constructor(private readonly wfExecutionsService: WfExecutionsService, private readonly wfStepExecutionService: WfStepExecutionService) { }

    @Get(":id")
    getWfExecution(@Param('id', ParseIntPipe) id: number): Promise<IWorkflowExecutionDto> {
        return this.wfExecutionsService.getWfExecution(id)
    }

    //Why do we need controllers
    // 1. Accept request
    // 2. Validate request
    // 3. Execute business logic
    // 4. Return response
    @Post('')
    createWfExecution(@Body() body: { workflowId: number }/*1*/): Promise<IWorkflowExecutionDto> {
        if (body || !body.workflowId) { /*2*/
            throw new Error("workflowId should be a positive number");
        }
        return this.wfExecutionsService.createWfExecution(body.workflowId); /*3, 4*/
    }

    @Put(":id")
    updateWfExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfExecutionsService.updateWfExecution(id, body)
    }

    @Get('wf-step-execution')
    getWfStep(): string {
        return this.wfStepExecutionService.getWfStepExecution()
    }

    // @Post('step/:id')
    // createWfStepExecution(@Param('id', ParseIntPipe) stepId: number): Promise<any> {
    //     return this.wfStepExecutionService.createWfStepExecution(stepId)
    // }

    @Put('wf-step-execution/:id')
    updateWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.updateWfStepExecution(id, body)
    }

    @Put('wf-step-execution/:id/submit')
    submitWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.updateWfStepExecution(id, body)
    }

    @Put('wf-step-execution/:id/execute-action')
    executeCustomWorkflowStepAction(@Param('id', ParseIntPipe) id: number, @Body() body: { actionAlias: string, input: IStepActionExecutionInput }): Promise<any> {
        return this.wfStepExecutionService.executeCustomWorkflowStepAction(id, body.actionAlias)
    }
}
