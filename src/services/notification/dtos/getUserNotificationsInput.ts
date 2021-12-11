import PagedRequestDto from '../../../shared/dtos/pagedRequestDto';

export interface GetUserNotificationsInput extends PagedRequestDto{
  state:number;
}
