import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { Card, Table, Button, Tag, Dropdown, Menu, Icon, Modal, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { AnyAction, Dispatch } from 'redux';
import { GetRolesInput } from '@/services/roles/dtos/getRolesInput';
import { RolesModelState } from '@/models/admin/roles';
import CreateOrUpdateRoleModal from './components/createOrUpdateRole'
import { PermissionModelState } from '@/models/permission';
import PermissionsTree from '@/components/PermissionsTree';
import EntityDto from '@/shared/dtos/entityDto';

export interface RolesProps {
  dispatch: Dispatch<AnyAction>;
  roles: RolesModelState;
  permissions: PermissionModelState
  loading: boolean;
}
export interface RolesStates {
  request: GetRolesInput;
  createOrUpdateModalVisible: boolean;
  selectPermissionModalVisible:boolean;
  roleId: number | null;
}
@connect(({ roles, permissions, loading }: ConnectState) => ({
  roles,
  permissions,
  loading: loading.effects['roles/getRoles'],
}))
class Roles extends AppComponentBase<RolesProps, RolesStates> {
  createOrUpdateRoleRef: any = React.createRef();

  state = {
    request: {
      permissions: [],
    },
    selectPermissionModalVisible: false,
    roleId: null,
    createOrUpdateModalVisible: false,
  }

  async componentDidMount() {
    await this.getTableData();
  }

  // 获取表格数据
  async getTableData() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'roles/getRoles',
      payload: this.state.request,
    });
  }

  // modal 确认按钮处理
  createOrUpdateModalOkHandler = () => {
    const { validateFields } = this.createOrUpdateRoleRef.current;
    validateFields(async (errors: any, values: any) => {
      if (!errors) {
        const { dispatch } = this.props;
        await dispatch({
          type: 'roles/createOrUpdateRole',
          payload: {
            grantedPermissionNames: this.props.permissions.selectedPermissionsName,
            role: {
              ...values,
              id: this.state.roleId,
            },
          },
        })
        await this.getTableData();
        this.createOrUpdateModal();
        this.notity.success({
          message: '操作成功!',
          description: '添加角色成功!',
        })
      }
    })
  }

  // 打开modal
  async createOrUpdateModalOpen(roleId: number | null = null) {
    const { dispatch } = this.props;
    const { setFieldsValue } = this.createOrUpdateRoleRef.current;
    await dispatch({
      type: 'roles/getRoleForEdit',
      payload: {
        id: roleId,
      },
    })
    await setFieldsValue({
      ...this.props.roles.editRole!.role,
    })
    await dispatch({
      type: 'permissions/selectPermissionsTree',
      payload: this.props.roles.editRole!.grantedPermissionNames,
    })
    this.setState({
      roleId,
    })
    await this.createOrUpdateModal();
  }

  // 打开或关闭Modal
  createOrUpdateModal = async () => {
    await this.setState(state => ({
      createOrUpdateModalVisible: !state.createOrUpdateModalVisible,
    }))
  }

  selectPermissionModal=() => {
    this.setState(state => ({
      selectPermissionModalVisible: !state.selectPermissionModalVisible,
    }))
  }

 async deleteRole(entityDto:EntityDto) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'roles/deleteRole',
      payload: entityDto,
    })
    this.notity.success({
      message: '操作成功!',
      description: '删除角色成功!',
    })
  }

  selectPermissionModalOpen= async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'permissions/selectPermissionsTree',
      payload: this.state.request.permissions,
    })
    this.selectPermissionModal();
  }

  selectPermissionModalOk=() => {
    this.setState(state => ({
      request: {
        ...state.request,
        permissions: this.props.permissions.selectedPermissionsName!,
      },
    }), () => {
      this.getTableData();
    })
    this.selectPermissionModal();
  }

  public render() {
    const {
      createOrUpdateModalVisible, roleId, selectPermissionModalVisible, request,
     } = this.state;
    const { loading } = this.props;
    const { roles } = this.props.roles;
    const columns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <div>
            <Dropdown overlay={
              <Menu>
                <Menu.Item onClick={() => { this.createOrUpdateModalOpen(record.id) }}>
                    修改
                </Menu.Item>
                <Menu.Item onClick={async() => { this.deleteRole({ id: record.id }) }}>
                    删除
               </Menu.Item>
              </Menu>
            } trigger={['click']} placement="bottomLeft">
              <Button icon="setting" type="primary">操作<Icon type="down" /></Button>
            </Dropdown>
          </div>,
      },
      {
        title: '角色名称',
        dataIndex: 'displayName',
        key: 'displayName',
        render: (text: string, record: any) => <div>
            <span> {text}&nbsp;</span>
            {
              record.isStatic ?
                <Tag color="#108ee9">系统</Tag> : null
            }
            {
              record.isDefault ?
                <Tag color="black">默认</Tag> : null
            }
          </div>,
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        render: (text: string) => <div>{new Date(text).toLocaleDateString()}</div>,
      },

    ];
    return (
      <PageHeaderWrapper
        content="使用角色进行权限分组."
        extraContent={<Button onClick={() => { this.createOrUpdateModalOpen() }} type="primary" icon="plus">添加角色</Button>}>
        <Card>

          <Col style={{ textAlign: 'right' }}>
          <Button icon="search" onClick={this.selectPermissionModalOpen} style={{ marginBottom: '10px' }} type="primary">选择权限点({request.permissions.length})</Button>
          </Col>
          <Table
            rowKey="id"
            bordered
            loading={loading}
            dataSource={roles === undefined ? [] : roles.items}
            pagination={false}
            columns={columns} />
        </Card>
        <Modal
        title="选择权限点"
        onCancel={this.selectPermissionModal}
        onOk={this.selectPermissionModalOk}
        okText="选择"
        visible={selectPermissionModalVisible}>
          <PermissionsTree />
        </Modal>
        <CreateOrUpdateRoleModal
          onOk={this.createOrUpdateModalOkHandler}
          ref={this.createOrUpdateRoleRef}
          visible={createOrUpdateModalVisible}
          onCancel={this.createOrUpdateModal}
          roleId={roleId} />
      </PageHeaderWrapper>
    )
  }
}
export default Roles;
