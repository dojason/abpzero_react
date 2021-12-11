import { RoleEditDto } from './roleEditDto';
import { FlatPermissionDto } from './flatPermissionDto';

export interface GetRoleForEditOutput{
  role:RoleEditDto;
  permissions:FlatPermissionDto[];
  grantedPermissionNames:string[];
}
