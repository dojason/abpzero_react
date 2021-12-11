import PagedRequestDto from '@/shared/dtos/pagedRequestDto';


export interface GetUsersInput extends PagedRequestDto{
    filter:string;
    permissions:string[];
    role?:number;
    onlyLockedUsers:boolean;
}
