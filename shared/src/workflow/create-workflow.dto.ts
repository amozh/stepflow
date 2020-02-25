export interface CreateWorkflowDto {
  readonly name: string;
  readonly description: string;
  readonly steps: CreateWorkflowStepDto[];
}

export interface AnswerDto{
  readonly answer: string;
  readonly parent: CreateWorkflowStepDto;
}

export interface CreateWorkflowStepDto {
  readonly name: string;
  readonly description: string;
  readonly answer: AnswerDto;
  readonly steps: CreateWorkflowStepDto[];
  readonly parent: CreateWorkflowStepDto;
}