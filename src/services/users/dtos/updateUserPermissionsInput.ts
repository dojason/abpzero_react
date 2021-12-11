import EntityDto from '@/shared/dtos/entityDto';

export interface UpdateUserPermissionsInput extends EntityDto{

  grantedPermissionNames:string[];
}
