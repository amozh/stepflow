import { Controller, Post, Body, Param, ParseIntPipe, Put, UsePipes, Get, Delete } from '@nestjs/common';
import { WfExecutionsService, IWorkflowActionExecutionInput } from "./wf-executions.service"
import { IWorkflowExecutionDto, ITestDto2, } from '@stepflow/shared';
import { WfStepExecutionEntity } from "../wf-step-execution/wf-step-execution.entity"
// import { ValidationPipe } from "./wf-executions.pipe"
import { IStepActionExecutionInput, WfStepExecutionService } from "../wf-step-execution/wf-step-execution.service";

// import { Length, IsNotEmpty, IsNumber, IsBoolean, IsString } from "class-validator" //

// Не работает валидация, если импортировать из папки shared
// export class ITestDto {
//     @IsString()
//     @Length(1, 4, { message: "Wrong length!" })
//     readonly someString: string;
//     @IsBoolean()
//     @IsNotEmpty()
//     readonly someBoolean: boolean;
//     @IsNotEmpty()
//     @IsNumber()
//     readonly count: number;
// }

@Controller('wf-executions')
export class WfExecutionsController {
    constructor(
        private readonly wfExecutionsService: WfExecutionsService,
        private readonly wfStepExecutionService: WfStepExecutionService
    ) { }

    // @Post("test")
    // @UsePipes(new ValidationPipe())
    // getSmt(@Body() body: ITestDto): ITestDto {//
    //     return body
    // }

    @Get()
    getAllWfExecution(): Promise<IWorkflowExecutionDto[]> {
        return this.wfExecutionsService.getAllWfExecution()
    }

    @Get(":id")
    getWfExecution(@Param('id', ParseIntPipe) id: number): Promise<IWorkflowExecutionDto> {
        return this.wfExecutionsService.getWfExecution(id)
    }

    @Delete(":id")
    deleteWfExecution(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.wfExecutionsService.deleteWfExecution(id)
    }

    @Post()
    createWfExecution(@Body() body: { workflowId: number }/*1*/): Promise<IWorkflowExecutionDto> {
        // if (!body || !body.workflowId) { /*2*/
        //     throw new Error("workflowId should be a positive number");//
        // }
        return this.wfExecutionsService.createWfExecution(body.workflowId); /*3, 4*/
    }

    @Get("sub/:id")
    findSubStepsExecution(@Param('id', ParseIntPipe) stepExecutionId: number): Promise<WfStepExecutionEntity[]> {
        return this.wfStepExecutionService.findSubStepsExecution(stepExecutionId);
    }

    // WORKFLOWS EXECUTIONS
    @Put('start/:id')
    startWfExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfExecutionsService.startWfExecution(id, body)
    }

    @Put('complete/:id')
    completeWfExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfExecutionsService.completeWfExecution(id, body)
    }

    @Put('submit/:id')
    submitWfExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfExecutionsService.submitWfExecution(id, body)
    }

    @Put('custom/:id')
    executeCustomWfAction(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { actionAlias: string, input: IWorkflowActionExecutionInput }
    ): Promise<any> {
        return this.wfExecutionsService.executeCustomWfAction(id, body.actionAlias, body.input)
    }

    @Get("load/:id")
    loadWfExecution(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.wfExecutionsService.workflowExecutionOnLoadAction(id)
    }

    // STEPS EXECUTIONS //
    @Get("step/load/:id")
    wfStepExecutionOnLoadAction(@Param('id', ParseIntPipe) stepExecId: number): Promise<any> {
        return this.wfStepExecutionService.wfStepExecutionOnLoadAction(stepExecId)
    }

    @Put('step/start/:id')
    startWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body?: any): Promise<any> {
        return this.wfStepExecutionService.startWfStepExecution(id, body)
    }

    @Put('step/complete/:id')
    completeWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.completeWfStepExecution(id, body)
    }

    @Put('step/submit/:id')
    submitWfStepExecution(@Param('id', ParseIntPipe) id: number, @Body() body: any): Promise<any> {
        return this.wfStepExecutionService.submitWfStepExecution(id, body)
    }

    @Put('step/custom/:id')
    executeCustomWorkflowStepAction(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { actionAlias: string, input: IStepActionExecutionInput }
    ): Promise<any> {
        return this.wfStepExecutionService.executeCustomWorkflowStepAction(id, body.actionAlias, body.input)
    }
}
