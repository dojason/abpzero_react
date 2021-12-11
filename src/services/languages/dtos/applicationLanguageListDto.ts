import FullAuditedEntityDto from '@/shared/dtos/fullAuditedEntityDto';

export interface ApplicationLanguageListDto extends FullAuditedEntityDto{
    tenantId:number;
    name:string;
    displayName:string;
    icon:string;
    isDisabled:boolean;
}
