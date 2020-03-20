// import { IActionDto } from "../action";

 enum WorkflowExecutionStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  COMPLETE = "COMPLETE"
}

export interface ICreateWorkflowDto {
  readonly name: string;
  readonly description: string;
  readonly input: JSON;
  readonly actions?: any[];
  readonly wfExecutions?: any[];
  readonly steps?: CreateWorkflowStepDto[];
}
export interface IWorkflowEntityDto extends ICreateWorkflowDto {
  readonly id?: number;
}
export interface AnswerDto {
  readonly answer: string;
  readonly parent?: CreateWorkflowStepDto;
}

export interface IAnswerResult {
  readonly result?: string;
  readonly stepId?: string | number
}

export interface CreateWorkflowStepDto {
  readonly name: string;
  readonly description: string;
  readonly answer: AnswerDto;
  readonly steps?: CreateWorkflowStepDto[];
  readonly parent?: CreateWorkflowStepDto;
}
export interface IWorkflowStepDto extends CreateWorkflowStepDto {
  readonly id: string;
}

export interface IWorkflowExecutionDto extends ICreateWorkflowDto {
  readonly workflow_id: number;
  readonly state: JSON;
  readonly status: WorkflowExecutionStatus
}