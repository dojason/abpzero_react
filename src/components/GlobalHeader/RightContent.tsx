import React from 'react';
import { notification } from 'antd';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import LoginRecord from '../LoginRecord';
import Notice from './NoticeIconView';

import NotificationSetting from '@/pages/admin/shared/notifications/components/notificationSetting';
import { GetNotificationSettingsOutput } from '@/services/notification/dtos/getNotificationSettingsOutput';

export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
  loginRecordModal: boolean;
  notificSettingVisible: boolean;
  notificationSetting: GetNotificationSettingsOutput;
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const notificationSettingRef: any = React.createRef();
  const { theme, layout, loginRecordModal, dispatch, notificSettingVisible,
    notificationSetting } = props;
  let className = styles.right;
  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const loginRecordModalCancel = () => {
    dispatch!({
      type: 'global/changeRecentUserLoginModalState',
    })
  }
  const notificationModalCancel = () => {
    dispatch!({
      type: 'global/changeNotificationSettingModalState',
    })
  }
  const notificationSettingOk = () => {
    const { validateFields } = notificationSettingRef.current;
    validateFields((error: any, values: any) => {
      if (!error) {
        let notifications: any[] = [];
        notifications = notificationSetting.notifications!.map(item => {
          const isChecked = values.notifications ===
           undefined ? false : (values.notifications as any[]).includes(item.name);
          const settingItem = { name: item.name!, isSubscribed: isChecked };
          return settingItem;
        })
        dispatch!({
          type: 'global/updateNotificationSettings',
          payload: {
            receiveNotifications: values.receiveNotifications,
            notifications,
          },
        })
        notificationModalCancel();
        notification.success({
          message: '操作成功!',
        })
      }
    })
  }
  return (
    <div className={className}>
      <LoginRecord onCancel={loginRecordModalCancel} visible={loginRecordModal}></LoginRecord>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="搜索"
        dataSource={[

        ]}
      />
      <Notice />
      <Avatar />
      <NotificationSetting
        ref={notificationSettingRef}
        notificationSetting={notificationSetting}
        onOk={notificationSettingOk}
        onCancel={notificationModalCancel}
        visible={notificSettingVisible} />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  loginRecordModal: global.loginRecordModal,
  notificSettingVisible: global.notificationSettingVisible,
  notificationSetting: global.notificationSetting,
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
