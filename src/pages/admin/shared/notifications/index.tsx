import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { Card, Button, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import moment from 'moment';
import { FormattedUserNotification } from '@/services/notification/dtos/userNotification';
import ButtonGroup from 'antd/lib/button/button-group';
import { Dispatch, AnyAction } from 'redux';

export interface INotificationProps {
  notifications?: FormattedUserNotification[];
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
}
@connect(({ notification, loading }: ConnectState) => ({
  notifications: notification.notifications,
  loading: loading.effects['notification/getUserNotifications'],
}))
class Notification extends AppComponentBase<INotificationProps> {
  formatNotification(record: any): string {
    return abp.utils.truncateStringWithPostfix(record, 120);
  }

  fromNow(date: string): string {
    return moment(date).fromNow();
  }

  openSettingModal=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNotificationSettingModalState',
    })
  }

  async loadNotifications() {
    const { dispatch } = this.props;
    if (dispatch) {
      await dispatch({
        type: 'notification/getUserNotifications',
      });
    }
  }

  readAll=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/setAllNotificationsAsRead',
    })
    this.notity.success({
      message: '操作成功!',
    })
    this.loadNotifications();
  }

  render() {
    const { notifications, loading } = this.props;
    const columns = [{
      title: '操作',
      width: '280px',
      dataIndex: 'action',
      key: 'action',
    }, {
      title: '内容',
      dataIndex: 'text',
      key: 'text',
      render: (text: string) => <div>{this.formatNotification(text)}</div>,
    }, {
      title: '创建时间',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (text: string) => <div>{this.fromNow(text)}</div>,
    }]
    return (
      <PageHeaderWrapper
        content="通知."
        extraContent={<ButtonGroup>

          <Button icon="setting" onClick={this.openSettingModal} type="default">通知设置</Button>
          <Button icon="check" onClick={this.readAll} type="primary">忽略全部</Button>

        </ButtonGroup>}>
        <Card>
          <Table
            bordered
            size="default"
            dataSource={notifications}
            loading={loading}
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default Notification;
