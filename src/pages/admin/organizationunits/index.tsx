import AppComponentBase from '@/components/AppComponentBase';
import { connect } from 'dva';
import React, { RefObject } from 'react';
import CreateOrUpdateOrganizationUnit from './components/createOrUpdateOrganizationUnit';
import { ConnectState } from '@/models/connect';
import { AnyAction, Dispatch } from 'redux';
import { Card, Row, Col, Tree, Tabs, Table, Button, Modal, notification } from 'antd';
import { contextMenu, Menu, Item } from 'react-contexify';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { OrganizationUnitDto } from '@/services/organizationunits/dtos/organizationUnitDto';
import { createTree } from '@/utils/utils';
import { GetOrganizationUnitRolesInput } from '@/services/organizationunits/dtos/getOrganizationUnitRolesInput';
import { GetOrganizationUnitUsersInput } from '@/services/organizationunits/dtos/getOrganizationUnitUsersInput';
import { AntTreeNodeMouseEvent } from 'antd/lib/tree';
import 'react-contexify/dist/ReactContexify.min.css';
import AddMember from './components/addMember';
import AddRole from './components/addRole';
import { OrganizationUnitsModelState } from '@/models/admin/organizationUnits';

const { TabPane } = Tabs;
const { DirectoryTree } = Tree;
const { confirm } = Modal;
export declare type ModalType = 'create' | 'update';
export interface OrganizationUnitsProps {
  dispatch: Dispatch<AnyAction>;
  organizationUnits: OrganizationUnitsModelState;
  loading: boolean;
}
export interface OrganizationUnitsStates {
  addMemberModalVisible: boolean;
  addRoleModalVisible: boolean;
  creatrOrUpdateModalVisible: boolean;
  getOrganizationRoleInput: GetOrganizationUnitRolesInput;
  getOrganizationUserInput: GetOrganizationUnitUsersInput;
}
@connect(({ organizationUnits, loading }: ConnectState) => ({
  organizationUnits,
  loading: loading.effects['organizationUnits/getOrganizationUnits'],
}))
class OrganizationUnits extends AppComponentBase<OrganizationUnitsProps, OrganizationUnitsStates> {
  // ref
  createTreeNodeModalRef: any = React.createRef();

  addMemberModalRef: RefObject<AddMember> = React.createRef<AddMember>();

  addRoleRef: RefObject<AddRole> = React.createRef<AddRole>();

  // modal类型
  modalType?: ModalType;

  organizationUnitSelectedId: number | null = null;

  state = {
    addMemberModalVisible: false,
    addRoleModalVisible: false,
    creatrOrUpdateModalVisible: false,
    getOrganizationUserInput: {
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
      id: 0,
    },
    getOrganizationRoleInput: {
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
      id: 0,
    },
  }

  componentDidMount() {
    this.getTreeData();
  }

  // 获取树形数据
  getTreeData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organizationUnits/getOrganizationUnits',
    });
  }

  // 选中树节点
  selectTree = (selectedKeys: string[]) => {
    this.organizationUnitSelectedId = Number(selectedKeys[0]);
    this.getTableData();
  }

  createOrUpdateModal = () => {
    this.setState(state => ({
      creatrOrUpdateModalVisible: !state.creatrOrUpdateModalVisible,
    }))
  }

  openCreateOrUpdateModalOk = () => {
    const { validateFields, resetFields } = this.createTreeNodeModalRef.current;
    validateFields((errors: any, values: any) => {
      if (!errors) {
        const { dispatch } = this.props;
        if (this.modalType === 'create') {
          dispatch({
            type: 'organizationUnits/createOrganizationUnit',
            payload: {
              ...values, parentId: this.organizationUnitSelectedId,
            },
          })
        } else {
          dispatch({
            type: 'organizationUnits/updateOrganizationUnit',
            payload: {
              ...values, id: this.organizationUnitSelectedId,
            },
          })
        }
        resetFields();
        this.createOrUpdateModal();
        notification.success({
          message: '操作成功！',
        })
      }
    });
  }

  // 创建根节点
  creatrRootNodeHandler = () => {
    this.organizationUnitSelectedId = null;
    this.openCreateOrUpdateModal('create');
  }

  openCreateOrUpdateModal(type: ModalType) {
    this.modalType = type;
    if (type === 'update') {
      const { setFieldsValue } = this.createTreeNodeModalRef.current;
     const selectNode = this.props.organizationUnits.organizationUnits!
     .items.filter(t => t.id === this.organizationUnitSelectedId);

      setFieldsValue({
        displayName: selectNode[0].displayName,
      })
    }
    this.createOrUpdateModal();
  }

  // 删除树节点
  deleteTreeNodeHandler = () => {
    const self = this;
    confirm({
      title: '确认操作',
      content: '确认要删除此项内容吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = self.props;
        dispatch({
          type: 'organizationUnits/deleteOrganizationUnit',
          payload: {
            id: self.organizationUnitSelectedId,
          },
        });
      },
      onCancel() {

      },
    });
  }

  addRoleModal = () => {
    this.setState(state => ({
      addRoleModalVisible: !state.addRoleModalVisible,
    }))
  }

  // 打开AddMerBermodal
  addRoleModalOpen = () => {
    if (this.organizationUnitSelectedId === null) {
      this.message.error({
        title: '错误',
        content: '请先选择组织机构',
      })
      return;
    }
    this.addRoleRef.current!.findRoles();
    this.addRoleModal();
  }

  // 新增组织机构modal打开或关闭
  addMermberModal = () => {
    this.setState(state => ({
      addMemberModalVisible: !state.addMemberModalVisible,
    }))
  }

  // 打开AddMerBermodal
  addMermberModalOpen = () => {
    if (this.organizationUnitSelectedId === null) {
      this.message.error({
        title: '错误',
        content: '请先选择组织机构',
      })
      return;
    }
    this.addMemberModalRef.current!.findUsers();
    this.addMermberModal();
  }

  // 添加角色至组织机构
  addRoleModalOkHandler = async () => {
    const { dispatch, organizationUnits } = this.props;
    await dispatch({
      type: 'organizationUnits/addRolesToOrganizationUnit',
      payload: {
        roleIds: organizationUnits.selectFindUsers,
        organizationUnitId: this.organizationUnitSelectedId,
      },
    });
    await dispatch({
      type: 'organizationUnits/getOrganizationUnitRoles',
      payload: {
        ...this.state.getOrganizationRoleInput,
        id: this.organizationUnitSelectedId,
      },
    })
    this.addRoleModal();
  }

  // 添加成员至组织机构
  addMermberModalOkHandler = async () => {
    const { dispatch, organizationUnits } = this.props;
    await dispatch({
      type: 'organizationUnits/addUsersToOrganizationUnit',
      payload: {
        userIds: organizationUnits.selectFindUsers,
        organizationUnitId: this.organizationUnitSelectedId,
      },
    });
    await dispatch({
      type: 'organizationUnits/getOrganizationUnitUsers',
      payload: {
        ...this.state.getOrganizationUserInput,
        id: this.organizationUnitSelectedId,
      },
    })
    this.addMermberModal();
  }

  // 树右键菜单
  treeRightClickHandler = (e: AntTreeNodeMouseEvent) => {
    this.organizationUnitSelectedId = Number(e.node.props.eventKey);
    contextMenu.show({
      id: 'rightMenu',
      event: e.event,
    });
  }

   // 移除组织机构角色
   removeRoleFromOrganizationUnit(roleId: number) {
    const self = this;
    confirm({
      title: '确认操作',
      content: '确认要移除此项吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = self.props;
        dispatch({
          type: 'organizationUnits/removeRoleFromOrganizationUnit',
          payload: {
            roleId,
            organizationUnitId: self.organizationUnitSelectedId,
          },
        });
      },
      onCancel() {

      },
    });
  }

  // 移除组织机构成员
  removeUserFromOrganizationUnit(userid: number) {
    const self = this;
    confirm({
      title: '确认操作',
      content: '确认要移除此项吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = self.props;
        dispatch({
          type: 'organizationUnits/removeUserFromOrganizationUnit',
          payload: {
            userId: userid,
            organizationUnitId: self.organizationUnitSelectedId,
          },
        });
      },
      onCancel() {

      },
    });
  }

  // 标签页选择
  getTableData = () => {
    if (this.organizationUnitSelectedId !== 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'organizationUnits/getOrganizationUnitUsers',
        payload: {
          ...this.state.getOrganizationUserInput,
          id: this.organizationUnitSelectedId,
        },
      })
      dispatch({
        type: 'organizationUnits/getOrganizationUnitRoles',
        payload: {
          ...this.state.getOrganizationRoleInput,
          id: this.organizationUnitSelectedId,
        },
      })
    }
  }

  render() {
    const MyMenu = () => (
      <Menu style={{ zIndex: 1000 }} id="rightMenu">
        <Item onClick={() => { this.openCreateOrUpdateModal('update') }}>
          修改
        </Item>
        <Item onClick={() => { this.openCreateOrUpdateModal('create') }}>
          添加子组织
       </Item>
        <Item onClick={this.deleteTreeNodeHandler}>
          删除
        </Item>
      </Menu>
    );
    const {
      organizationUnits, organizationUnitUsers, organizationUnitRoles,
    } = this.props.organizationUnits;
    const { addMemberModalVisible, addRoleModalVisible, creatrOrUpdateModalVisible } = this.state;
    const treeData = createTree(organizationUnits === undefined ? [] : organizationUnits.items,
      'parentId',
      'id',
      null,
      'children',
      [
        {
          target: 'title',
          targetFunction(item: OrganizationUnitDto) {
            return <span>{item.displayName}&nbsp;<small style={{ fontSize: '.82em', opacity: 0.5 }}>{item.memberCount}组织成员,{item.roleCount}角色</small></span>;
          },
        }, {
          target: 'key',
          targetFunction(item: OrganizationUnitDto) {
            return item.id;
          },
        },
      ]);
    const organizationUnitUserTableColumns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Button onClick={() => { this.removeUserFromOrganizationUnit(record.id) }} icon="close-circle" type="primary">删除</Button>,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '添加时间',
        dataIndex: 'addedTime',
        key: 'addedTime',
      },
    ];
    const organizationUnitRoleTableColumns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Button onClick={() => { this.removeRoleFromOrganizationUnit(record.id) }} icon="close-circle" type="primary">删除</Button>,
      },
      {
        title: '角色',
        dataIndex: 'displayName',
        key: 'displayName',
      },
      {
        title: '添加时间',
        dataIndex: 'addedTime',
        key: 'addedTime',
      },
    ]
    return (
      <PageHeaderWrapper
      content="应用组织机构和行政区划到用户和实体.">
        <Row gutter={[24, 24]}>

          <Col xs={24} xl={12}>

            <Card extra={<Button onClick={this.creatrRootNodeHandler} type="primary" icon="plus">添加根组织</Button>} title="组织结构树">
              <DirectoryTree
                onSelect={this.selectTree}
                showIcon
                treeData={treeData}
                draggable
                onRightClick={this.treeRightClickHandler}
              >
              </DirectoryTree>
              <MyMenu></MyMenu>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card title="成员">
              <Tabs type="card" >
                <TabPane tab="组织成员" key="user">
                  {
                    this.organizationUnitSelectedId === undefined ? (<p>选择一个组织成员</p>) :
                      (<div><Col style={{ textAlign: 'right' }}>
                        <Button onClick={this.addMermberModalOpen} icon="plus" type="primary">添加组织成员</Button>
                      </Col>
                        <Table
                          dataSource={
                            organizationUnitUsers === undefined ? [] : organizationUnitUsers.items
                          }
                          columns={organizationUnitUserTableColumns} />
                      </div>)

                  }

                </TabPane>
                <TabPane tab="角色" key="role">
                  {
                    this.organizationUnitSelectedId === undefined ? (<p>选择一个角色</p>) :
                      (<div>   <Col style={{ textAlign: 'right' }}>
                        <Button onClick={this.addRoleModalOpen} icon="plus" type="primary">添加角色</Button>
                      </Col>
                        <Table
                          dataSource={
                            organizationUnitRoles === undefined ? [] : organizationUnitRoles.items
                          }
                          columns={organizationUnitRoleTableColumns} />
                      </div>)

                  }


                </TabPane>
              </Tabs>
              <CreateOrUpdateOrganizationUnit
                title={this.modalType === 'create' ? '新增组织机构' : '修改组织机构'}
                ref={this.createTreeNodeModalRef}
                visible={creatrOrUpdateModalVisible}
                onCancel={this.createOrUpdateModal}
                onOk={this.openCreateOrUpdateModalOk} />
              <AddMember
                organizationUnitId={this.organizationUnitSelectedId}
                ref={this.addMemberModalRef}
                dispatch={this.props.dispatch}
                organizationUnits={this.props.organizationUnits}
                visible={addMemberModalVisible}
                onCancel={() => {
                  this.addMermberModal()
                }}

                onOk={this.addMermberModalOkHandler} />
              <AddRole
                organizationUnitId={this.organizationUnitSelectedId}
                ref={this.addRoleRef}
                dispatch={this.props.dispatch}
                organizationUnits={this.props.organizationUnits}
                visible={addRoleModalVisible}
                onCancel={() => {
                  this.addRoleModal()
                }}

                onOk={this.addRoleModalOkHandler} />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    )
  }
}
export default OrganizationUnits;
