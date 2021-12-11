import AppComponentBase from '@/components/AppComponentBase';
import { Modal, Tabs, Form, Alert } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import Input from 'antd/es/input';
import Checkbox from 'antd/es/checkbox';
import PermissionsTree from '@/components/PermissionsTree';

const { TabPane } = Tabs;
export interface ICreateOrUpdateRoleProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  roleId: number | null;
}
class CreateOrUpdateRoleModal extends AppComponentBase<ICreateOrUpdateRoleProps> {
  render() {
    const { visible, onOk, onCancel, roleId } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let editRoleName = '';
    if (roleId !== null) {
      editRoleName = `: ${getFieldValue('displayName')}`
    }
    return (
      <Modal
        title={roleId == null ? '新增角色' : `编辑角色${editRoleName}`}
        visible={visible}
        onCancel={onCancel}
        destroyOnClose
        onOk={onOk}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="角色名称" key="1">
            <Form.Item label="角色名称" hasFeedback>
              {
                getFieldDecorator('displayName', {
                  rules: [
                    {
                      required: true,
                      message: '这是必填项!',
                    },
                  ],
                })(<Input />)
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('isDefault', {
                  valuePropName: 'checked',
                  rules: [
                    {
                      required: true,
                      message: '这是必填项!',
                    },
                  ],
                })(<Checkbox >
                  默认
               </Checkbox>,

                )
              }
              <p style={{ marginTop: 5 }}>新用户将默认拥有此角色. </p>
            </Form.Item>


          </TabPane>
          <TabPane tab="权限" key="2">
            <PermissionsTree />
          </TabPane>
        </Tabs>
        <Alert message="如果您正在更改自己的权限，则可能需要刷新页面（F5）以在您所做的权限更改生效！" type="info" />
      </Modal>
    )
  }
}
export default Form.create<ICreateOrUpdateRoleProps>({})(CreateOrUpdateRoleModal);
