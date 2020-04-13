import { IActionDto } from "../action";

enum WorkflowExecutionStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  COMPLETE = "COMPLETE"
}

export interface ICreateWorkflowDto {
  id?: any,
  name: string,
  depth?: number,
  description: string,
  input: JSON | any,
  actions?: IActionDto[],
  wfExecutions?: any[],
  steps: ICreateWorkflowStepDto[]
}
export interface ICreateWorkflowStepDto {
  id: any,
  name: string,
  description: string,
  input: JSON | any,
  depth: number,
  actions: IActionDto[],
  steps: ICreateWorkflowStepDto[]
}

// export interface ICreateWorkflowDto {
//   id?: number | null,
//   name: string,
//   depth?: number,
//   description: string,
//   input?: JSON | any,
//   actions?: IActionDto[],
//   wfExecutions?: any[],
//   steps?: ICreateWorkflowStepDto[],
// }

// export interface ICreateWorkflowStepDto {
//   id?: string | null,
//   name: string,
//   depth?: number,
//   description: string,
//   input: JSON | any,
//   answer?: AnswerDto,
//   actions?: IActionDto[],
//   steps?: ICreateWorkflowStepDto[],
//   parent?: ICreateWorkflowStepDto,
// }

export interface IWorkflowExecutionDto extends ICreateWorkflowDto {
  readonly workflow_id: number;
  readonly state: JSON;
  readonly status: WorkflowExecutionStatus;
}

export interface IWorkflowInfoDto {
  readonly name: string;
  readonly description: string;
  readonly input: any;
}

export interface ICrumbDto {
  readonly step: any | null;
  readonly depth: number;
  readonly text: string;
}

export interface IWorkflowCreatedStatus {
  readonly success: boolean | null;
  readonly text: string;
}

export interface AnswerDto {
  readonly answer: string;
  readonly parent?: ICreateWorkflowStepDto;
}

export interface IAnswerResult {
  readonly result?: string;
  readonly stepId?: string | number;
}





/* Last version
export interface ICreateWorkflowDto {
  readonly name: string;
  readonly description: string;
  readonly input: JSON;
  readonly actions?: any[];
  readonly wfExecutions?: any[];
  readonly steps?: ICreateWorkflowStepDto[];
}
export interface IWorkflowEntityDto extends ICreateWorkflowDto {
  readonly id?: number;
}
export interface AnswerDto {
  readonly answer: string;
  readonly parent?: ICreateWorkflowStepDto;
}

export interface IAnswerResult {
  readonly result?: string;
  readonly stepId?: string | number
}

export interface ICreateWorkflowStepDto {
  readonly name: string;
  readonly description: string;
  readonly answer: AnswerDto;
  readonly steps?: ICreateWorkflowStepDto[];
  readonly parent?: ICreateWorkflowStepDto;
}
export interface IWorkflowStepDto extends ICreateWorkflowStepDto {
  readonly id: string;
}

export interface IWorkflowExecutionDto extends ICreateWorkflowDto {
  readonly workflow_id: number;
  readonly state: JSON;
  readonly status: WorkflowExecutionStatus
}*/