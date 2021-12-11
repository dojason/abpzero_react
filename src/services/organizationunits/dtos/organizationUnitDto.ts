import AuditedEntityDto from '@/shared/dtos/auditedEntityDto';


export interface OrganizationUnitDto extends AuditedEntityDto<number>{
    parentId:number;
    code:string;
    displayName:string;
    memberCount:number;
    roleCount:number;
}
