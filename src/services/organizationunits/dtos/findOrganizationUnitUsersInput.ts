import PagedRequestDto from '@/shared/dtos/pagedRequestDto';


export interface FindOrganizationUnitUsersInput extends PagedRequestDto{
     filter:string;
     organizationUnitId:number|null;
}
