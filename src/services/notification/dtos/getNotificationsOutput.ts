import { UserNotification } from './userNotification';
import PagedResultDto from '../../../shared/dtos/pagedResultDto';

export interface GetNotificationsOutput extends PagedResultDto<UserNotification>{
  unreadCount: number | undefined;
}
