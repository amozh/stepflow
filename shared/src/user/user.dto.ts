import { IUserGroupDto } from './user-group.dto';

export interface UserDto {
  readonly username: string;
  readonly password: string;
  readonly userRole: Partial<UserRole>;
  readonly userGroups: Partial <IUserGroupDto[]>;
}

export interface UserEntityDto {
  readonly id: number;
  readonly username: string;
  readonly password: string;
  readonly userRole: Partial<UserRole>;
  readonly userGroups: Partial <IUserGroupDto[]>;
}

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN"
}