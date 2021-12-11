import AppComponentBase from '@/components/AppComponentBase';
import { Modal, Form, Input } from 'antd';
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form';

export interface IResetPasswordProps extends FormComponentProps {
    visible: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export interface IResetPasswordStates {
    confirmDirty: boolean;
}
class ResetPassword extends AppComponentBase<IResetPasswordProps, IResetPasswordStates> {
    state = {
        confirmDirty: false,
    }

    compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('您输入的两个密码不一致!');
        } else {
            callback();
        }
    };

    // 确认密码 blur 事件
    handleConfirmBlur = (e: any) => {
        const { value } = e.target;
        this.setState(state => (
          { confirmDirty: state.confirmDirty || !!value }));
    };

    validateToNextPassword = (rule: any, value: any, callback: any) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confrimpassword'], { force: true });
        }
        callback();
    };

    public render() {
        const { visible, onCancel, onOk } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Modal
                title="更改密码"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
            >
                    <Form.Item {...formItemLayout} label="密码" hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: '密码不能为空！',
                                }, {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="确认密码" hasFeedback>
                        {getFieldDecorator('confrimpassword', {
                            rules: [
                                {
                                    required: true,
                                    message: '确认密码不能为空！',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>
            </Modal>
        )
    }
}
export default Form.create<IResetPasswordProps>({})(ResetPassword);
