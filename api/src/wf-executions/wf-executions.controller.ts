import { Controller, Get, Post, Body, Param, ParseIntPipe, Put } from '@nestjs/common';
import { WfExecutionsService } from "./wf-executions.service"
import { IWorkflowExecutionDto } from '@stepflow/shared';
import { IStepActionExecutionInput, WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

@Controller('wf-executions')
export class WfExecutionsController {
    constructor(
        private readonly wfExecutionsService: WfExecutionsService,
        private readonly wfStepExecutionService: WfStepExecutionService
    ) { }

    //Why do we need controllers
    // 1. Accept request
    // 2. Validate request
    // 3. Execute business logic
    // 4. Return response
    @Post()
    createWfExecution(@Body() body: { workflowId: number }/*1*/): Promise<IWorkflowExecutionDto> {
        console.log(body.workflowId, "workflowId")
        if (!body || !body.workflowId) { /*2*/
            throw new Error("workflowId should be a positive number");
        }
        return this.wfExecutionsService.createWfExecution(body.workflowId); /*3, 4*/
    }

    @Put(":id")
    updateWfExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfExecutionsService.updateWfExecution(id, body)
    }

    @Put('start/:id')
    startWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.startWfStepExecution(id, body)
    }

    @Put('complete/:id')
    completeWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.completeWfStepExecution(id, body)
    }

    // ----------
    @Put('submit/:id')
    submitWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.submitWfStepExecution(id, body)
    }

    @Put('custom/:id')
    executeCustomWorkflowStepAction(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { actionAlias: string, input: IStepActionExecutionInput }
    ): Promise<any> {
        return this.wfStepExecutionService.executeCustomWorkflowStepAction(id, body.actionAlias, body.input)
    }


    // @Post('step/:id')
    // createWfStepExecution(@Param('id', ParseIntPipe) stepId: number): Promise<any> {
    //     return this.wfStepExecutionService.createWfStepExecution(stepId)
    // }

    // @Put('wf-step-execution/:id')
    // updateWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
    //     return this.wfStepExecutionService.updateWfStepExecution(id, body)
    // }
}
