import PagedRequestDto from '@/shared/dtos/pagedRequestDto';
import EntityDto from '@/shared/dtos/entityDto';


export interface GetOrganizationUnitRolesInput extends PagedRequestDto, EntityDto{
    sorting?:string;
}
