import AppConsts from '@/lib/appconst';
import { FormattedUserNotification } from '@/services/notification/dtos/userNotification';
import * as Push from 'push.js';

class UserNotificationHelper {
  getUrl(userNotification: abp.notifications.IUserNotification): string {
    // eslint-disable-next-line default-case
    switch (userNotification.notification.notificationName) {
      case 'App.NewUserRegistered':
        return `/app/admin/users?filterText=${userNotification.notification.data.properties.emailAddress}`;
      case 'App.NewTenantRegistered':
        return `/app/admin/tenants?filterText=${userNotification.notification.data.properties.tenancyName}`;
      case 'App.GdprDataPrepared':
        return `${AppConsts.remoteServiceBaseUrl}/File/DownloadBinaryFile?id=${userNotification.notification.data.properties.binaryObjectId}&contentType=application/zip&fileName=collectedData.zip`;
      case 'App.DownloadInvalidImportUsers':
        return `${AppConsts.remoteServiceBaseUrl}/File/DownloadTempFile?fileToken=${userNotification.notification.data.properties.fileToken}&fileType=${userNotification.notification.data.properties.fileType}&fileName=${userNotification.notification.data.properties.fileName}`;
      // Add your custom notification names to navigate to a URL when user clicks to a notification.
    }

    // No url for this notification
    return '';
  }
  /* PUBLIC functions ***************************************** */

  getUiIconBySeverity(severity: abp.notifications.severity): string {
    switch (severity) {
      case abp.notifications.severity.SUCCESS:
        return 'fa fa-check';
      case abp.notifications.severity.WARN:
        return 'fa fa-exclamation-triangle';
      case abp.notifications.severity.ERROR:
        return 'fa fa-bolt';
      case abp.notifications.severity.FATAL:
        return 'fa fa-bomb';
      case abp.notifications.severity.INFO:
      default:
        return 'fa fa-info';
    }
  }

  format(userNotification: abp.notifications.IUserNotification, truncateText?: boolean): FormattedUserNotification {
    const formatted: FormattedUserNotification = {
      userNotificationId: userNotification.id,
      text: abp.notifications.getFormattedMessageFromUserNotification(userNotification),
      time: new Date(userNotification.notification.creationTime).toLocaleDateString(),
      creationTime: userNotification.notification.creationTime,
      icon: this.getUiIconBySeverity(userNotification.notification.severity),
      state: abp.notifications.getUserNotificationStateAsString(userNotification.state),
      data: userNotification.notification.data,
      url: this.getUrl(userNotification),
      isUnread: userNotification.state === abp.notifications.userNotificationState.UNREAD,
    };

    if (truncateText || truncateText === undefined) {
      formatted.text = abp.utils.truncateStringWithPostfix(formatted.text, 100);
    }

    return formatted;
  }

  show(userNotification: abp.notifications.IUserNotification): void {
    // 应用通知
    abp.notifications.showUiNotifyForUserNotification(userNotification, {
      onclick: () => {
        // Take action when user clicks to live toastr notification
        const url = this.getUrl(userNotification);
        if (url) {
          window.location.href = url;
        }
      },
    });

    // 桌面通知
    Push.default.create('Grace', {
      body: this.format(userNotification).text,
      icon: `${abp.appPath}assets/read.svg`,
      timeout: 6000,
      onClick () {
        window.focus();
      },
    });
  }

  setAllAsRead(callback?: () => void): void {

  }

  setAsRead(userNotificationId: string, callback?: (userNotificationId: string) => void): void {

  }

  openSettingsModal(): void {

  }
}
export default new UserNotificationHelper();
