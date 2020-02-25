import { UserGroupDto } from '@stepflow/shared';

export interface UserDto {
  readonly username: string;
  readonly password: string;
  readonly userRole: Partial<UserRole>;
  readonly userGroups: Partial <UserGroupDto[]>;
}

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN"
}