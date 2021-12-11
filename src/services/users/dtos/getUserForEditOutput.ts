import { UserEditDto } from './userEditDto';
import { UserRoleDto } from './userRoleDto';
import { OrganizationUnitDto } from '@/services/organizationunits/dtos/organizationUnitDto';

export interface GetUserForEditOutput{
  profilePictureId?:string;
  user:UserEditDto;
  roles:UserRoleDto[];
  allOrganizationUnits: OrganizationUnitDto[] | undefined;
  memberedOrganizationUnits: string[] | undefined;
}
