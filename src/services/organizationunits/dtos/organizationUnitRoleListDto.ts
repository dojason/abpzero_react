import EntityDto from '@/shared/dtos/entityDto';

export interface OrganizationUnitRoleListDto extends EntityDto{
    displayName:string;
    name:string;
    addedTime:string
}
