import AppComponentBase from '@/components/AppComponentBase';
import { Modal, Tabs, Form, Input, Row, Col, Checkbox } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import defaultAvate from '@/assets/default-profile-picture.png';
import FormItem from 'antd/es/form/FormItem';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import { UserRoleDto } from '@/services/users/dtos/userRoleDto';
import OrganizationUnitTree from '@/components/OrganizationUnitTree';

export interface CreateOrUpdateUserProps extends FormComponentProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  userId: number | null;
  roles: UserRoleDto[];
}


class CreateOrUpdateUser extends AppComponentBase<CreateOrUpdateUserProps> {
  render() {
    const { visible, onCancel, onOk, userId, form, roles } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const options = roles.map((x: UserRoleDto) => {
      const role = { label: x.roleDisplayName!, value: x.roleName! };
      return role;
    });
    return (
      <Modal
        width={600}
        title={userId == null ? '新增用户' : '编辑用户'}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
      >
        <Tabs defaultActiveKey="user">
          <Tabs.TabPane tab="用户" key="user">
            <Row type="flex" justify="space-around" align="middle">
              <Col span={8} >
                <img alt="" src={defaultAvate} height={128} width={128} />
              </Col>
              <Col span={16}>
                <FormItem className="customFormItem" label="名称">
                  {getFieldDecorator('name', {

                  })(<Input />)
                  }
                </FormItem>
                <FormItem className="customFormItem" label="完整名称">
                  {getFieldDecorator('surname', {

                  })(<Input />)
                  }
                </FormItem>
              </Col>
            </Row>
            <FormItem className="customFormItem" label="邮箱地址">
              {getFieldDecorator('emailAddress', {

              })(<Input />)
              }
            </FormItem>
            <FormItem className="customFormItem" label="联系电话">
              {getFieldDecorator('phoneNumber', {

              })(<Input />)
              }
            </FormItem>
            <FormItem className="customFormItem" label="用户名">
              {getFieldDecorator('userName', {

              })(<Input />)
              }
            </FormItem>
            <FormItem className="customFormItem">
              {getFieldDecorator('setRandomPassword', {
                valuePropName: 'checked',
              })(<Checkbox>使用随机密码
                </Checkbox>)
              }
            </FormItem>
            {!getFieldValue('setRandomPassword') ?
             (<div>
              <FormItem className="customFormItem" label="密码">
              {getFieldDecorator('password', {

              })(<Input />)
              }
            </FormItem>  <FormItem className="customFormItem" label="确认密码">
            {getFieldDecorator('passwordRepeat', {

            })(<Input />)
            }
          </FormItem>
              </div>) : null
            }
            <FormItem className="customFormItem">
              {getFieldDecorator('shouldChangePasswordOnNextLogin', {
                valuePropName: 'checked',
              })(<Checkbox>下次登录需要修改密码.
                </Checkbox>)
              }
            </FormItem>
            <FormItem className="customFormItem">
              {getFieldDecorator('sendActivationEmail', {
                valuePropName: 'checked',
              })(<Checkbox>发送激活邮件.
                </Checkbox>)
              }
            </FormItem>
            <FormItem className="customFormItem">
              {getFieldDecorator('isActive', {
               valuePropName: 'checked',
              })(<Checkbox>激活
                </Checkbox>)
              }
            </FormItem>
            <FormItem className="customFormItem">
              {getFieldDecorator('isLockoutEnabled', {
                valuePropName: 'checked',
              })(<Checkbox>是否启用锁定？
                </Checkbox>)
              }
            </FormItem>
          </Tabs.TabPane>
          <Tabs.TabPane tab="角色" key="role">
            <FormItem className="customFormItem">
              {getFieldDecorator('roles', {
                valuePropName: 'value',
              })(
                <CheckboxGroup options={options} />,
              )}
            </FormItem>

          </Tabs.TabPane>
          <Tabs.TabPane tab="组织机构" key="organizationUnit">
            <OrganizationUnitTree />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    )
  }
}
export default Form.create<CreateOrUpdateUserProps>({})(CreateOrUpdateUser);
