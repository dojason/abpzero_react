import PagedRequestDto from '@/shared/dtos/pagedRequestDto';


export interface FindOrganizationUnitRolesInput extends PagedRequestDto{
  organizationUnitId:number|null;
  filter:string;
}
