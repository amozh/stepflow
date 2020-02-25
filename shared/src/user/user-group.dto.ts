import { CreateWorkflowDto, UserDto } from '../index';

export interface UserGroupDto {
  readonly groupName: string;
  readonly workflows: CreateWorkflowDto[];
  readonly users: UserDto[];
}