import { NotificationSubscriptionWithDisplayNameDto } from './notificationSubscriptionWithDisplayNameDto';


export interface GetNotificationSettingsOutput{
  receiveNotifications: boolean | undefined;
  notifications: NotificationSubscriptionWithDisplayNameDto[] | undefined;
}
