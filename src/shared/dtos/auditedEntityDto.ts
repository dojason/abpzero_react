import EntityDto from './entityDto';


export default interface AuditedEntityDto<T=number> extends EntityDto<T> {
    lastModificationTime:Date;
    lastModifierUserId:number;
    creationTime:Date;
    creatorUserId:number;
}
