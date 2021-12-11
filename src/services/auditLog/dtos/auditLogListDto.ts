
import EntityDto from '@/shared/dtos/entityDto';

export interface AuditLogListDto extends EntityDto {
    userId?:number;
    userName:string;
    impersonatorTenantId?:number;
    impersonatorUserId?:number;
    serviceName:string;
    methodName:string;
    parameters:string;
    executionTime:Date;
    executionDuration:number;
    clientIpAddress:string;
    clientName:string;
    browserInfo:string;
    exception:string;
    customData:string;
}
