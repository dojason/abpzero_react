import AppComponentBase from '@/components/AppComponentBase';
import { Modal, Typography } from 'antd';
import React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';

const { Title } = Typography;
interface EditLanguageTextProps extends FormComponentProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  baseValue: string;
  targetValue: string;
}

class EditLanguageText extends AppComponentBase<EditLanguageTextProps> {
  public render() {
    const { visible, onOk, onCancel, baseValue, targetValue } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const keyValue = getFieldValue('key')
    return (
      <Modal
        title="编辑文本"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form.Item label="键值">
          {
            getFieldDecorator('key', {})(
              <Title level={4}>{keyValue}</Title>,
            )
          }
        </Form.Item>
        <Form.Item label={baseValue}>
          {
            getFieldDecorator('baseValue', {})(
              <TextArea rows={4} />,
            )
          }
        </Form.Item>
        <Form.Item label={targetValue}>
          {
            getFieldDecorator('targetValue', {})(
              <TextArea rows={4} />,
            )
          }
        </Form.Item>
      </Modal>
    )
  }
}
export default Form.create<EditLanguageTextProps>()(EditLanguageText);
