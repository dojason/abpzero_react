import PagedRequestDto from '@/shared/dtos/pagedRequestDto';

export interface GetEntityTypeChangeInput extends PagedRequestDto{
    entityTypeFullName:string;
    entityId:string;
    sorting:string;
}
