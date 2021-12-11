import React, { Component } from 'react';
import { connect } from 'dva';
import NoticeIcon from '../NoticeIcon';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from './index.less';
import { FormattedUserNotification } from '@/services/notification.ts/dtos/userNotification';
import UserNotificationHelper from '@/shared/helpers/UserNotificationHelper';
import  router  from 'umi/router';
import { notification } from 'antd';

export interface GlobalHeaderRightProps extends ConnectProps {
  notifications: FormattedUserNotification[];
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
  unReadCount: number;
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  componentDidMount() {
    this.loadNotifications();
    this.registerToEvents();
  }
  async loadNotifications() {
    const { dispatch } = this.props;
    if (dispatch) {
      await dispatch({
        type: 'notification/getUserNotifications',
      });
    }
  }
  registerToEvents() {
    let self = this;

    function onNotificationReceived(userNotification: abp.notifications.IUserNotification) {
      UserNotificationHelper.show(userNotification);
      self.loadNotifications();
    }

    abp.event.on('abp.notifications.received', userNotification => {
      onNotificationReceived(userNotification);
    });

    function onNotificationsRefresh() {
      self.loadNotifications();
    }

    abp.event.on('app.notifications.refresh', () => {

      onNotificationsRefresh();

    });
  }

  changeReadState = async (clickedItem: FormattedUserNotification) => {
    const { userNotificationId } = clickedItem;
    const { dispatch } = this.props;
    if (dispatch) {
      await dispatch({
        type: 'notification/setNotificationAsRead',
        payload: { id: userNotificationId },
      });
    }
    await this.loadNotifications();
  };

  handleNoticeClear = async (title: string, key: string) => {
    const { dispatch } = this.props;

    if (dispatch) {
      await dispatch({
        type: 'notification/setAllNotificationsAsRead',
      });
      await this.loadNotifications();
    }
     notification.success({
      message:'操作成功!'
    })
  };



  render() {
    const { notifications, unReadCount, onNoticeVisibleChange } = this.props;
    return (

      <NoticeIcon
        className={styles.action}
        count={unReadCount}
        onItemClick={item => {
          this.changeReadState(item);
        }}
        clearText="忽略全部"
        viewMoreText="查看更多"
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => router.push("/admin/notifications")}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={unReadCount}
          list={notifications}
          title="通知"
          emptyText=""
          showViewMore
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ global, loading, notification }: ConnectState) => ({
  collapsed: global.collapsed,
  notifications: notification.notifications,
  unReadCount: notification.unreadCount
}))(GlobalHeaderRight);
