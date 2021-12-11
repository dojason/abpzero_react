import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { Modal, Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

export interface ICreateOrUpdateDataDictionaryProps extends FormComponentProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk: () => void;
}

class CreateOrUpdateDataDictionary extends AppComponentBase<ICreateOrUpdateDataDictionaryProps> {
 public render() {
  const { visible, onCancel, onOk, title } = this.props;
  const { getFieldDecorator } = this.props.form;
  return (
    <Modal
    title={title}
    visible={visible}
    onCancel={onCancel}
    onOk={onOk}>
    <Form.Item label="名称">
      {getFieldDecorator('name', {
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
Form.create<ICreateOrUpdateDataDictionaryProps>({})(CreateOrUpdateDataDictionary);
