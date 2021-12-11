
import EntityDto from '../../../shared/dtos/entityDto';
import { TenantNotification } from './tenantNotification';

export interface UserNotification extends EntityDto<string>{
    tenantId: number | undefined;
    userId: number | undefined;
    state: UserNotificationState | undefined;
    notification: TenantNotification | undefined;
}
export enum UserNotificationState {
  Unread = 0,
  Read = 1,
}
export interface FormattedUserNotification {
  userNotificationId: string;
  text: string;
  time: string;
  creationTime: Date;
  icon: string;
  state: String;
  data: any;
  url: string;
  isUnread: boolean;
}
