import EntityDto from '@/shared/dtos/entityDto';

export interface OrganizationUnitUserListDto extends EntityDto{
    name:string;
    surname:string;
    userName:string;
    emailAddress:string;
    profilePictureId:string;
    addedTime:string;
}
