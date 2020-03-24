import { Controller, Post, Body, Param, ParseIntPipe, Put, UsePipes } from '@nestjs/common';
import { WfExecutionsService } from "./wf-executions.service"
import { IWorkflowExecutionDto, ITestDto2 } from '@stepflow/shared';
import { ValidationPipe } from "./wf-executions.pipe"
import { IStepActionExecutionInput, WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

import { Length, IsNotEmpty, IsNumber, IsBoolean, IsString } from "class-validator"

// Не работает валидация, если импортировать из папки shared
export class ITestDto {
    @IsString()
    @Length(1, 4, { message: "Wrong length!" })
    readonly someString: string;
    @IsBoolean()
    @IsNotEmpty()
    readonly someBoolean: boolean;
    @IsNotEmpty()
    @IsNumber()
    readonly count: number;
}
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

    @Post("test")
    @UsePipes(new ValidationPipe())
    getSmt(@Body() body: ITestDto): ITestDto {
        return body
    }

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
}
