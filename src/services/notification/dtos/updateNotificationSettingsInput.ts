import { NotificationSubscriptionDto } from './notificationSubscriptionDto';


export interface UpdateNotificationSettingsInput{
  receiveNotifications:boolean;
  notifications:NotificationSubscriptionDto[];
}
