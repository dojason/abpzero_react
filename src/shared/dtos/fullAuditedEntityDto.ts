import AuditedEntityDto from './auditedEntityDto';

export default interface FullAuditedEntityDto<T=number> extends AuditedEntityDto<T>{
    isDeleted:boolean;
    deleterUserId:boolean;
    deletionTime:Date;
}
