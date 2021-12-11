import AppComponentBase from '@/components/AppComponentBase';
import { Modal, Form, Switch, Typography, Checkbox, Icon } from 'antd';
import React from 'react';
import * as _ from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { GetNotificationSettingsOutput } from '@/services/notification/dtos/getNotificationSettingsOutput';

const { Text } = Typography;
interface INotificationSettingProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  notificationSetting: GetNotificationSettingsOutput;
}
class NotificationSetting extends AppComponentBase<INotificationSettingProps> {
  render() {
    const { visible, onCancel, onOk, notificationSetting } = this.props;
    const { getFieldDecorator } = this.props.form;
    let options:any[] = [];
    if (notificationSetting !== undefined) {
        options = notificationSetting.notifications!.map(x => {
        const role = { label: this.L(x.displayName!), value: x.name! };
        return role;
      });
    }
    return (
      <Modal
        onCancel={onCancel}
        onOk={onOk}
        title="通知设置"
        visible={visible}>
        <Form.Item label="接收通知">
          {getFieldDecorator('receiveNotifications', { valuePropName: 'checked', initialValue: notificationSetting === undefined ? true : notificationSetting.receiveNotifications })(
            <Switch

              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />} />,
          )}

        </Form.Item>
        <Text type="secondary">
          这个选项可以用来完全启用/禁用接收通知。
      </Text>
        <br />
        <br />
        <Form.Item label="通知类型">
          {getFieldDecorator('notifications', { initialValue: notificationSetting === undefined ? [] : _.map(notificationSetting.notifications, 'name') })(
            <Checkbox.Group options={options} />,
          )}

        </Form.Item>
      </Modal>
    )
  }
}

export default Form.create<INotificationSettingProps>({})(NotificationSetting);
