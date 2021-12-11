/* eslint-disable import/no-unresolved */
import React from 'react';
import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { Dispatch } from 'redux';
import { Input, Button, Form } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { ProfileModelState } from '../../../models/profile';
import AppComponentBase from '@/components/AppComponentBase';

interface RegisterUserProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  profile: ProfileModelState
  submitting: boolean;
}
interface RegisterUserStates {
  confirmDirty: boolean;
}
@connect(({ global, profile, loading }: ConnectState) => ({
  profile,
  tenant: global.tenant,
  submitting: loading.effects['account/register'],
}))
class RegisterUser extends AppComponentBase<RegisterUserProps, RegisterUserStates> {
  state = {
    confirmDirty: false,
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'profile/getPasswordComplexitySetting',
    })
  }

  get useCaptcha(): boolean {
    return abp.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration');
  }

  compareToFirstPassword = (_rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(this.L('PasswordsDontMatch'));
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['passwordRepeat'], { force: true });
    }
    callback();
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (_err, values) => {
      // if (this.useCaptcha && !values.captchaResponse) {
      //   this.message.warn(this.L('CaptchaCanNotBeEmpty'));
      //   return;
      // }
      dispatch({
        type: 'account/register',
        payload: {
          ...values,
        },
      })
    });
  };

  public render() {
    const { form, profile } = this.props;
    const { passwordSetting } = profile;
    const passwordRole: ValidationRule[] = [];
    const { getFieldDecorator } = form;
    if (passwordSetting !== undefined) {
      if (passwordSetting!.requireDigit) {
        passwordRole.push({
          validator: (_rule: any, value: any, callback: any) => {
            if (value && /[0-9]/.test(value)) {
              callback(this.L('PasswordComplexity_RequireDigit_Hint'))
            }
            callback()
          },
        })
      }
      if (passwordSetting!.requireUppercase) {
        passwordRole.push({
          validator: (rule: any, value: any, callback: any) => {
            if (value && /[A-Z]/.test(value)) {
              callback(this.L('PasswordComplexity_RequireUppercase_Hint'))
            }
            callback()
          },
        })
      }
      if (passwordSetting!.requireLowercase) {
        passwordRole.push({
          validator: (rule: any, value: any, callback: any) => {
            if (value && /[a-z]/.test(value)) {
              callback(this.L('PasswordComplexity_RequireLowercase_Hint'))
            }
            callback()
          },
        })
      }
      if (passwordSetting!.requiredLength) {
        passwordRole.push({
          min: Number(passwordSetting!.requiredLength),
          message: this.L('PasswordComplexity_RequiredLength_Hint', passwordSetting!.requiredLength),
        })
      }
    }
    return (
      <div className={styles.main}>
        <h3>
          {this.L('CreateAnAccount')}
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
                {
                  max: 32,
                  message: this.L('PleaseEnterNoMoreThanNCharacter'),
                },
              ],
            })(
              <Input
                placeholder={this.L('Name')}
              />,
            )}
          </Form.Item>
          <Form.Item >
            {getFieldDecorator('surname', {
              rules: [
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
              ],
            })(
              <Input
                placeholder={this.L('Surname')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('emailAddress', {
              rules: [
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
                {
                  type: 'email',
                  message: this.L('InvalidEmailAddress'),
                },
              ],
            })(
              <Input
                placeholder={this.L('EmailAddress')}

              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
              ],
            })(
              <Input
                placeholder={this.L('UserName')}

              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
                {
                  validator: this.validateToNextPassword,
                },
                ...passwordRole,
              ],
            })(
              <Input
                type="password"
                placeholder={this.L('Password')}

              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('passwordRepeat', {
              rules: [
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                type="password"
                placeholder={this.L('PasswordRepeat')}

              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              {this.L('CreateAnAccount')}
            </Button>
            <Link className={styles.login} to="/account/login">
              {this.L('Back')}
            </Link>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default Form.create<RegisterUserProps>()(RegisterUser);
