import { ICreateWorkflowDto, UserDto, IWorkflowEntityDto } from '../index';

export interface IUserGroupDto {
  readonly id: string;
  readonly groupName: string;
  readonly workflows: ICreateWorkflowDto[];
  readonly users: UserDto[];
}

export interface IUserGroupBaseDto {
  readonly groupName: string;
  readonly workflows?: IWorkflowEntityDto[];
  readonly users?: UserDto[];
}

export interface IUserGroupEntityDto extends IUserGroupBaseDto {
  readonly id: number;
}
