import PagedRequestDto from '@/shared/dtos/pagedRequestDto';


export interface GetEntityChangeInput extends PagedRequestDto{
    startDate:string;
    endDate:string;
    userName?:string;
    entityTypeFullName?:string;
    sorting?:string;

}
