import PagedRequestDto from '@/shared/dtos/pagedRequestDto';


export interface GetDataDictionaryItemsRequest extends PagedRequestDto{
   parentId: number;
}
