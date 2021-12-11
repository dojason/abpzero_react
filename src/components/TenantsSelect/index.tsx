import React, { Fragment } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState, ConnectProps } from '@/models/connect';
import AppComponentBase from '../AppComponentBase';
import { TenantLoginInfoDto } from '@/shared/dtos/appSession/tenantLoginInfoDto';

interface TenantsSelectProps extends ConnectProps, FormComponentProps {
  tenant?: TenantLoginInfoDto;
}
interface TenantsSelectStates {
  visible: boolean;
}

@connect(({ global }: ConnectState) => ({
  tenant: global.tenant,
}))
class TenantsSelect extends AppComponentBase<TenantsSelectProps, TenantsSelectStates> {
  state = {
    visible: false,
  }

  modal = () => {
    this.setState(state => ({
      visible: !state.visible,
    }))
  }

  modalOkHandler = () => {
    const { validateFields } = this.props.form;
    validateFields((_errors: any, value: any) => {
      if (!value.tenancyName) {
        abp.multiTenancy.setTenantIdCookie(undefined);
        this.modal();
        window.location.reload();
        return;
      }
      const { dispatch } = this.props;
      dispatch!({
        type: 'global/isTenantAvailable',
        payload: {
          tenancyName: value.tenancyName,
        },
      })
      this.modal();
    })
  }

  changeTenant = () => {
    this.modal();
  }

  public render() {
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const triggerRender = () => {
      const { tenant } = this.props;
      const tenantName = tenant === null || tenant === undefined ? '未选择' : tenant!.tenancyName;

      return (
        <div style={{ textAlign: 'center' }}>
          当前租户名称:{tenantName}(<a href="#" onClick={this.changeTenant}>切换</a>)
        </div>
      )
    }
    return (
      <Fragment>
        {triggerRender()}
        <Modal
          title="切换租户"
          onOk={this.modalOkHandler}
          visible={visible}
          onCancel={this.modal}>
          <Form.Item label="租户编码">
            {getFieldDecorator('tenancyName', {})(
              <Input/>,
            )}

          </Form.Item>
        </Modal>
      </Fragment>
    )
  }
}
export default Form.create<TenantsSelectProps>()(TenantsSelect);
