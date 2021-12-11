import AppComponentBase from '@/components/AppComponentBase';
import React, { Fragment } from 'react';
import { Card, Table, Button, Tag, Dropdown, Menu, Icon, Input, Row, Col, Modal, Select } from 'antd';
import * as _ from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { AnyAction, Dispatch } from 'redux';
import { GetUsersInput } from '@/services/users/dtos/getUsersInput';
import { UsersStateType } from '@/models/admin/users';
import { PaginationConfig } from 'antd/lib/table';
import CreateOrUpdateUser from './components/createOrUpdateUser';
import EntityDto from '../../../shared/dtos/entityDto';
import { OrganizationUnitTreeModelState } from '../../../models/organizationUnitTree';
import { PermissionModelState } from '@/models/permission';
import PermissionsTree from '@/components/PermissionsTree';
import ListResultDto from '@/shared/dtos/listResultDto';
import { RoleListDto } from '@/services/roles/dtos/roleListDto';

interface UsersProps {
  dispatch: Dispatch<AnyAction>;
  users: UsersStateType;
  permissions: PermissionModelState
  organizationUnitTree: OrganizationUnitTreeModelState;
  loading: boolean;
  roles: ListResultDto<RoleListDto>;
}
interface UsersStates {
  request: GetUsersInput;
  formIsOpen: boolean;
  userId: number | null;
  selectPermissionModalVisible: boolean;
  createOrUpdateModalVisible: boolean;
}
const { Search } = Input;
const { Option } = Select;
@connect(({ users, roles, organizationUnitTree, permissions, loading }: ConnectState) => ({
  users,
  permissions,
  roles: roles.roles,
  organizationUnitTree,
  loading: loading.effects['users/getUsers'],
}))
class Users extends AppComponentBase<UsersProps, UsersStates> {
  modalRef: any = React.createRef();

  state = {
    request: {
      filter: '',
      permissions: [],
      onlyLockedUsers: false,
      maxResultCount: 10,
      skipCount: 0,
    },
    formIsOpen: false,
    userId: null,
    selectPermissionModalVisible: false,
    createOrUpdateModalVisible: false,
  }

  async componentDidMount() {
    await this.getTableData();
  }

  // 获取表格数据
  async getTableData() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'users/getUsers',
      payload: this.state.request,
    });
  }

  // modal 确认按钮处理
  createOrUpdateModalOkHandler = () => {
    const { validateFields } = this.modalRef.current!;
    validateFields((errors: any, values: any) => {
      if (!errors) {
        const { dispatch } = this.props;
        const user = {
          id: this.state.userId,
          ...values,
        };
        delete user.roles;
        dispatch({
          type: 'users/createOrUpdateUser',
          payload: {
            user,
            assignedRoleNames: values.roles,
            organizationUnits: this.props.organizationUnitTree.selectedOrganizationUnits,
          },
        })
      }
    });
    this.createOrUpdateModal();
    this.notity.success({
      message: '操作成功!',
    })
  }

  async createOrUpdateModalOpen(userId: number | null) {
    await this.setState({
      userId,
    });
    const { dispatch } = this.props;
    await dispatch({
      type: 'users/getUserForEdit',
      payload: {
        id: userId,
      },
    });
    const { setFieldsValue } = this.modalRef.current!;
    await setFieldsValue({
      ...this.props.users.editUser!.user,
      roles: _.map(_.filter(this.props.users.editUser!.roles, 'isAssigned'), 'roleName'),
    })

    const { memberedOrganizationUnits, allOrganizationUnits } = this.props.users.editUser!;
    const selectOrganizationUnits = _.filter(allOrganizationUnits,
      o => memberedOrganizationUnits!.includes(o.code))
    await dispatch({
      type: 'organizationUnitTree/selectOrganizationUnits',
      payload: _.map(selectOrganizationUnits, 'id'),
    })

    this.createOrUpdateModal();
  }

  // 打开或关闭modal
  createOrUpdateModal = () => {
    this.setState(state => ({
      createOrUpdateModalVisible: !state.createOrUpdateModalVisible,
    }))
  }

  handleTableChange = (pagination: PaginationConfig) => {
    this.setState(state => ({
      request: {
        ...state.request,
        skipCount: (pagination.current! - 1) * state.request.maxResultCount!,
      },
    }), () => {
      this.getTableData();
    })
  }

  async deleteUser(input: EntityDto) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'users/deleteUser',
      payload: input,
    })
    this.notity.success({
      message: '操作成功!',
      description: '删除用户成功!',
    })
  }

  formOpenOrClose = () => {
    this.setState(state => ({
      formIsOpen: !state.formIsOpen,
    }), () => {
      if (this.state.formIsOpen) {
        const { dispatch } = this.props;
        dispatch({
          type: 'roles/getRoles',
          payload: undefined,
        })
      }
    })
  }

  async unlockUser(input: EntityDto) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'users/unlockUser',
      payload: input,
    })
    await this.getTableData();
    this.notity.success({
      message: '操作成功!',
      description: '解锁用户成功!',
    })
  }

  exportUserHandler = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/getUsersToExcel',
      payload: this.state.request,
    })
  }

  selectPermissionModal = () => {
    this.setState(state => ({
      selectPermissionModalVisible: state.selectPermissionModalVisible,
    }))
  }

  selectPermissionModalOpen = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'permissions/selectPermissionsTree',
      payload: this.state.request.permissions,
    })
    this.selectPermissionModal();
  }

  rolesSelect = (value: any) => {
    this.setState(state => ({
      request: {
        ...state.request,
        role: value,
      },
    }))
  }

  selectPermissionModalOk = () => {
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

  searchHandler = (value: any) => {
    this.setState(state => ({
      request: {
        ...state.request,
        filter: value,
      },
    }), () => {
      this.getTableData();
    })
  }

  public render() {
    const { loading, roles } = this.props;

    const { users, editUser } = this.props.users;
    const {
      createOrUpdateModalVisible, userId, formIsOpen, selectPermissionModalVisible, request,
    } = this.state;
    const formRender = () => {
      const triggerIconType = formIsOpen ? 'caret-up' : 'caret-down'
      const triggerText = formIsOpen ? '隐藏高级过滤' : '显示高级过滤';
      const trigger = () => <a onClick={this.formOpenOrClose}>
        <Icon type={triggerIconType} />{triggerText}
      </a>;
      return (
        <Fragment>
          <Row>
            <Col span={24}>
              <Search
                placeholder="搜索..."
                enterButton="刷新"
                onSearch={this.searchHandler}
              />
            </Col>
          </Row>

          {formIsOpen ? (
            <Row gutter={24} style={{ marginTop: '10px', marginBottom: '10px' }}>
              <Col xl={12}>
                <Button onClick={this.selectPermissionModalOpen} style={{ width: '100%' }}>选择权限点({request.permissions.length})</Button>
              </Col>
              <Col xl={12}>
                <Select onSelect={this.rolesSelect} className="selectWidth">
                  {
                    roles === undefined ? null : (
                      roles.items.map((item: RoleListDto) => <Option
                        key={item.id} value={item.id}>{item.displayName}
                      </Option>)
                    )
                  }
                </Select>
              </Col>
            </Row>
          ) : null}
          <div style={{ marginTop: '20px', marginBottom: '10px' }}>
            {trigger()}
          </div>
        </Fragment>
      )
    }
    const columns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Fragment>
          <Dropdown overlay={
            <Menu>
              {/* <Menu.Item>
                    使用这个用户登录
                </Menu.Item> */}
              <Menu.Item onClick={() => { this.createOrUpdateModalOpen(record.id) }}>
                修改
              </Menu.Item>

              <Menu.Item>

                权限
              </Menu.Item>
                <Menu.Item onClick={async () => { await this.unlockUser({ id: record.id }) }}>
                  解锁
                </Menu.Item>
                <Menu.Item onClick={async () => { await this.deleteUser({ id: record.id }) }}>
                  删除
                </Menu.Item>
            </Menu>
          } trigger={['click']} placement="bottomLeft">

            <Button icon="setting" type="primary">操作<Icon type="down" /></Button>
          </Dropdown>
        </Fragment>,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '姓氏',
        dataIndex: 'surname',
        key: 'surname',
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        render: (text: any) => <div>{text[0].roleName}</div>,
      },
      {
        title: '邮箱地址',
        dataIndex: 'emailAddress',
        key: 'emailAddress',
      },
      {
        title: '邮箱地址确认',
        dataIndex: 'isEmailConfirmed',
        key: 'isEmailConfirmed',
        render: (text: any) => <div>{text ? <Tag color="#108ee9">是</Tag> : <Tag color="#f50">否</Tag>}</div>,
      },
    ];
    function showPageTotal(total: number) {
      return `共 ${total} 项`;
    }
    return (
      <PageHeaderWrapper
        content="管理用户及权限."
        extraContent={
          <Fragment>
            <Button onClick={this.exportUserHandler} icon="export">导出到Excel</Button>
            <Button style={{ marginLeft: '5px' }} onClick={() => { this.createOrUpdateModalOpen(null) }} type="primary" icon="plus">添加用户</Button>
          </Fragment>
        }>
        <Card>
          {formRender()}
          <Table
            loading={loading}
            bordered
            onChange={this.handleTableChange}
            rowKey="id"
            dataSource={users === undefined ? [] : users.items}
            pagination={{
              showTotal: showPageTotal,
              pageSize: this.state.request.maxResultCount,
              total: users === undefined ? 0 : users.totalCount,
            }}
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
        <CreateOrUpdateUser
          ref={this.modalRef}
          userId={userId}
          roles={editUser === undefined ? [] : editUser.roles}
          onOk={this.createOrUpdateModalOkHandler}
          visible={createOrUpdateModalVisible}
          onCancel={this.createOrUpdateModal} />
      </PageHeaderWrapper>
    )
  }
}
export default Users;
