import PagedRequestDto from '@/shared/dtos/pagedRequestDto';


export interface GetAuditLogsInput extends PagedRequestDto{
    startDate:string;
    endDate:string;
    userName?:string;
    serviceName?:string;
    methodName?:string;
    browserInfo?:string;
    hasException?:boolean;
    minExecutionDuration?:number;
    maxExecutionDuration?:number;
    sorting?:string;
}
