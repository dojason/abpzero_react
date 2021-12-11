import AppComponentBase from '@/components/AppComponentBase';
import { Modal, Input, Form } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';

export interface ICreateOrUpdateOrganizationUnitProps extends FormComponentProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk: () => void;
}

class CreateOrUpdateOrganizationUnit extends
  AppComponentBase<ICreateOrUpdateOrganizationUnitProps> {
  render() {
    const { visible, onCancel, onOk, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}>
        <Form.Item label="名称">
          {getFieldDecorator('displayName', {
            rules: [{
              required: true,
              message: 'Please input your note!',
            }],
          })(<Input />)}
        </Form.Item>
      </Modal>
    )
  }
}
export default
Form.create<ICreateOrUpdateOrganizationUnitProps>({})(CreateOrUpdateOrganizationUnit);
