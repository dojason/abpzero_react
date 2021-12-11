import { Alert, Checkbox, Icon } from 'antd';
import React from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { LoginModelState } from '@/models/login';
import LoginComponents from './components/Login';
import styles from './style.less';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import { AuthenticateModel } from '@/services/tokenAuth/dtos/authenticateModel';
import ResetPassword from './components/ResetPassword';
import TenantsSelect from '@/components/TenantsSelect';
import AppComponentBase from '@/components/AppComponentBase';

const { Tab, UserName, Password, Submit } = LoginComponents;

export interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: LoginModelState;
  submitting: boolean;
}
export interface LoginState {
  type: string;
  rememberClient: boolean;
}

@connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends AppComponentBase<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    rememberClient: false,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      rememberClient: e.target.checked,
    });
  };

  handleSubmit = (err: unknown, values: AuthenticateModel) => {
    const { rememberClient } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          rememberClient,
        },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise<boolean>((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }
      this.loginForm.validateFields(
        ['mobile'],
        {},
        async (err: unknown, values: LoginParamsType) => {
          if (err) {
            reject(err);
          } else {
            const { dispatch } = this.props;
            try {
              const success = await ((dispatch({
                type: 'login/getCaptcha',
                payload: values.userName,
              }) as unknown) as Promise<unknown>);
              resolve(!!success);
            } catch (error) {
              reject(error);
            }
          }
        },
      );
    });

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  resetPasswordModalOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/changeResetPasswordModalStatus',
      payload: false,
    })
  }

  // 关闭模态框
  resetPasswordModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/changeResetPasswordModalStatus',
      payload: false,
    })
  }

  render() {
    const { userLogin, submitting } = this.props;
    const { status, type: loginType, resetPasswordModalState } = userLogin;
    const { type, rememberClient } = this.state;
    return (
      <div className={styles.main}>
        {
          abp.multiTenancy.isEnabled ? <TenantsSelect /> : null
        }
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >

          <Tab key="account" tab={this.L('GoToApplication')}>
            {status === false &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                this.L('InvalidUserNameOrPassword'),
              )}
            <UserName
              name="userNameOrEmailAddress"
              placeholder={this.L('UserNameOrEmail')}
              rules={[
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={this.L('Password')}
              rules={[
                {
                  required: true,
                  message: this.L('ThisFieldIsRequired'),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          </Tab>
          <div>
            <Checkbox checked={rememberClient} onChange={this.changeAutoLogin}>
              {this.L('RememberMe')}
            </Checkbox>
            <a style={{ float: 'right' }} href="">
            {this.L('ForgotPassword')}
            </a>
          </div>
          <Submit loading={submitting}>
          {this.L('SignUp')}
          </Submit>
          <div className={styles.other}>
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/account/register">
              {this.L('CreateAnAccount')}
            </Link>
          </div>
        </LoginComponents>
        <ResetPassword
         visible={resetPasswordModalState!}
         onOk={() => { }} onCancel={this.resetPasswordModalCancel}>
         </ResetPassword>
      </div>
    );
  }
}

export default Login;
