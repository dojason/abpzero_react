import { RoleEditDto } from './roleEditDto';

export interface CreateOrUpdateRoleInput{
  role:RoleEditDto;
  grantedPermissionNames:string[];
}
