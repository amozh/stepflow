export interface CreateWorkflowDto {
  readonly name: string;
  readonly description: string;
  readonly steps: CreateWorkflowStepDto[];
}

export interface CreateWorkflowStepDto {
  readonly name: string;
  readonly description: string;
  readonly steps: CreateWorkflowStepDto[];
  readonly parent: CreateWorkflowStepDto;
}