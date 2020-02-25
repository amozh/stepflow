import { CreateWorkflowDto, UserDto } from '@stepflow/shared';

export interface UserGroupDto {
  readonly groupName: string;
  readonly workflows: CreateWorkflowDto[];
  readonly users: UserDto[];
}