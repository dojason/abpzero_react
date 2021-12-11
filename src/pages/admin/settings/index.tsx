import AppComponentBase from '@/components/AppComponentBase';
import React, { Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Tabs, Typography, Form, Input, Checkbox, Icon, Upload } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import AppConsts from '@/lib/appconst';
import { UploadProps } from 'antd/lib/upload';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { AnyAction, Dispatch } from 'redux';
import { TenantSettingsEditDto } from '@/services/tenantSettings/dtos/tenantSettingsEditDto';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Dragger } = Upload;
interface SettingsProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  allSettings?: TenantSettingsEditDto;
}
@connect(({ adminSettings }: ConnectState) => ({
  allSettings: adminSettings.allSettings,
}))
class Settings extends AppComponentBase<SettingsProps> {
  state = {
    allSettings: undefined,
  }

  async componentWillMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'adminSettings/getAllSettings',
    })
  }

  componentDidMount() {
    const { form, allSettings } = this.props;
    form.setFieldsValue({ ...allSettings })
  }

  saveAll = () => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((errors: any, values: any) => {
      if (!errors) {
        dispatch({
          type: 'adminSettings/updateAllSettings',
          payload: {
            ...values,
          },
        })
        this.notity.success({
          message: '操作成功!',
          description: '更新全部设置成功!',
        })
      }
    })
  }

  public render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const token = abp.auth.getToken();
    const uploadProps: UploadProps = {
      name: 'file',
      multiple: false,
      action: `${AppConsts.remoteServiceBaseUrl}TenantCustomization/UploadLogo`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return (
      <PageHeaderWrapper
        content="显示和修改程序设置."
        extraContent={<Button type="primary" onClick={this.saveAll} icon="save">保存全部</Button>}>
        <Card>
          <Tabs defaultActiveKey="1" >
            <TabPane key="1" tab="LOGO">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                   uploading company data or other
                  band files
            </p>
              </Dragger>
            </TabPane>
            <TabPane tab="用户管理" key="2">
              <Title level={3}>基于表单身份验证</Title>
              <Form.Item extra="如果此项被禁用，只能由管理员通过用户管理页面添加用户.">
                {
                  getFieldDecorator('userManagement.allowSelfRegistration', { valuePropName: 'checked' })(<Checkbox >允许用户注册.</Checkbox>)
                }
              </Form.Item>
              <Form.Item extra="如果此项被禁用，新用户需要通过邮件激活后才能登录.">
                {
                  getFieldDecorator('userManagement.isNewRegisteredUserActiveByDefault', { valuePropName: 'checked' })(<Checkbox >注册用户默认激活.</Checkbox>)
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('userManagement.useCaptchaOnRegistration', { valuePropName: 'checked' })(<Checkbox >用户注册时使用图片验证码(captcha).</Checkbox>)
                }
              </Form.Item>
              <Form.Item >
                {
                  getFieldDecorator('userManagement.useCaptchaOnRegistration', { valuePropName: 'checked' })(<Checkbox >在登录时使用图片验证码(captcha).</Checkbox>)
                }
              </Form.Item>
              <Title level={3}>允许Cookie</Title>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('userManagement.isCookieConsentEnabled', { valuePropName: 'checked' })(<Checkbox >允许使用Cookie</Checkbox>)
                }
              </Form.Item>
              <Title level={3}>其它设置</Title>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('userManagement.isEmailConfirmationRequiredForLogin', { valuePropName: 'checked' })(<Checkbox >必须验证邮箱地址后才能登录.</Checkbox>)
                }
              </Form.Item>
            </TabPane>
            <TabPane tab="安全" key="3">
              <Title level={3}>密码复杂性</Title>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('security.useDefaultPasswordComplexitySettings', { valuePropName: 'checked' })(<Checkbox >使用默认设置.</Checkbox>)
                }
              </Form.Item>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('security.passwordComplexity.requireDigit', { valuePropName: 'checked' })(<Checkbox >缺少数字.</Checkbox>)
                }
              </Form.Item>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('security.passwordComplexity.requireLowercase', { valuePropName: 'checked' })(<Checkbox >缺少小写字母.</Checkbox>)
                }
              </Form.Item>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('security.passwordComplexity.requireNonAlphanumeric', { valuePropName: 'checked' })(<Checkbox >缺少特殊字符.</Checkbox>)
                }
              </Form.Item>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('security.passwordComplexity.requireUppercase', { valuePropName: 'checked' })(<Checkbox >缺少大写字母.</Checkbox>)
                }
              </Form.Item>
              <Form.Item label="长度不足">
                {
                  getFieldDecorator('security.passwordComplexity.requiredLength', {})(<Input />)
                }
              </Form.Item>
              <Title level={3}>用户锁定</Title>
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('security.userLockOut.isEnabled', { valuePropName: 'checked' })(<Checkbox >登录失败后启用用户的帐户锁定.</Checkbox>)
                }
              </Form.Item>
              <Form.Item label="在锁定帐户之前的累计登录失败的最大数量">
                {
                  getFieldDecorator('security.userLockOut.maxFailedAccessAttemptsBeforeLockout', {})(<Input />)
                }
              </Form.Item>
              <Form.Item label="帐户锁定持续时间（秒）">
                {
                  getFieldDecorator('security.userLockOut.defaultAccountLockoutSeconds', {})(<Input />)
                }
              </Form.Item>
            </TabPane>
            <TabPane tab={this.L('EmailSmtp')} key="4">
              <Form.Item className="customFormItem">
                {
                  getFieldDecorator('email.useHostDefaultEmailSettings', { valuePropName: 'checked' })(<Checkbox>使用主机默认设置</Checkbox>)
                }
              </Form.Item>
              {
                getFieldValue('email.useHostDefaultEmailSettings') ? null : (
                  <Fragment>
                    <Form.Item label={this.L('DefaultFromAddress')}>
                      {
                        getFieldDecorator('email.defaultFromAddress', {})(<Input />)
                      }
                    </Form.Item>
                    <Form.Item label={this.L('DefaultFromDisplayName')}>
                      {
                        getFieldDecorator('email.defaultFromDisplayName', {})(<Input />)
                      }
                    </Form.Item>
                    <Form.Item label={this.L('SmtpHost')}>
                      {
                        getFieldDecorator('email.smtpHost', {})(<Input />)
                      }
                    </Form.Item>
                    <Form.Item label={this.L('SmtpPort')}>
                      {
                        getFieldDecorator('email.smtpPort', {})(<Input />)
                      }
                    </Form.Item>
                    <Form.Item className="customFormItem">
                      {
                        getFieldDecorator('email.smtpEnableSsl', { valuePropName: 'checked' })(<Checkbox>{this.L('UseSsl')}</Checkbox>)
                      }
                    </Form.Item>
                    <Form.Item className="customFormItem">
                      {
                        getFieldDecorator('email.smtpUseDefaultCredentials', { valuePropName: 'checked' })(<Checkbox>{this.L('UseDefaultCredentials')}</Checkbox>)
                      }
                    </Form.Item>
                    {
                      getFieldValue('email.smtpUseDefaultCredentials') ? null : (
                        <Fragment>
                          <Form.Item label={this.L('DomainName')}>
                            {
                              getFieldDecorator('email.DomainName', {})(<Input />)
                            }
                          </Form.Item>
                          <Form.Item label={this.L('UserName')}>
                            {
                              getFieldDecorator('email.smtpUserName', {})(<Input />)
                            }
                          </Form.Item>
                          <Form.Item label={this.L('Password')}>
                            {
                              getFieldDecorator('email.smtpPassword', {})(<Input />)
                            }
                          </Form.Item>
                        </Fragment>
                      )
                    }
                  </Fragment>
                )
              }
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<SettingsProps>()(Settings);
