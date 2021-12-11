import request from '@/utils/request';
import { GetUserNotificationsInput } from './dtos/getUserNotificationsInput';
import EntityDto from '../../shared/dtos/entityDto';
import { UpdateNotificationSettingsInput } from './dtos/updateNotificationSettingsInput';

class NotificationService {
  async getUserNotifications(input: GetUserNotificationsInput) {
    return request('api/services/app/Notification/GetUserNotifications', {
      method: 'GET',
      params: input,
    });
  }

  async setAllNotificationsAsRead() {
    return request('api/services/app/Notification/SetAllNotificationsAsRead', {
      method: 'POST',
    });
  }

  async setNotificationAsRead(input: EntityDto<string>) {
    return request('api/services/app/Notification/SetNotificationAsRead', {
      method: 'POST',
      data: input,
    });
  }

  async getNotificationSettings() {
    return request('api/services/app/Notification/GetNotificationSettings', {
      method: 'GET',
    });
  }

  async updateNotificationSettings(input:UpdateNotificationSettingsInput) {
    return request('api/services/app/Notification/UpdateNotificationSettings', {
      method: 'PUT',
      data: input,
    });
  }

  async deleteNotification(input:EntityDto<string>) {
    return request('api/services/app/Notification/DeleteNotification', {
      method: 'DELETE',
      params: input,
    });
  }
}
export default new NotificationService();
