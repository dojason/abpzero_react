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

  // modal??????
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

  // ??????????????????
  getTreeData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organizationUnits/getOrganizationUnits',
    });
  }

  // ???????????????
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
          message: '???????????????',
        })
      }
    });
  }

  // ???????????????
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

  // ???????????????
  deleteTreeNodeHandler = () => {
    const self = this;
    confirm({
      title: '????????????',
      content: '??????????????????????????????',
      okText: '??????',
      cancelText: '??????',
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

  // ??????AddMerBermodal
  addRoleModalOpen = () => {
    if (this.organizationUnitSelectedId === null) {
      this.message.error({
        title: '??????',
        content: '????????????????????????',
      })
      return;
    }
    this.addRoleRef.current!.findRoles();
    this.addRoleModal();
  }

  // ??????????????????modal???????????????
  addMermberModal = () => {
    this.setState(state => ({
      addMemberModalVisible: !state.addMemberModalVisible,
    }))
  }

  // ??????AddMerBermodal
  addMermberModalOpen = () => {
    if (this.organizationUnitSelectedId === null) {
      this.message.error({
        title: '??????',
        content: '????????????????????????',
      })
      return;
    }
    this.addMemberModalRef.current!.findUsers();
    this.addMermberModal();
  }

  // ???????????????????????????
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

  // ???????????????????????????
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

  // ???????????????
  treeRightClickHandler = (e: AntTreeNodeMouseEvent) => {
    this.organizationUnitSelectedId = Number(e.node.props.eventKey);
    contextMenu.show({
      id: 'rightMenu',
      event: e.event,
    });
  }

   // ????????????????????????
   removeRoleFromOrganizationUnit(roleId: number) {
    const self = this;
    confirm({
      title: '????????????',
      content: '?????????????????????????',
      okText: '??????',
      cancelText: '??????',
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

  // ????????????????????????
  removeUserFromOrganizationUnit(userid: number) {
    const self = this;
    confirm({
      title: '????????????',
      content: '?????????????????????????',
      okText: '??????',
      cancelText: '??????',
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

  // ???????????????
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
          ??????
        </Item>
        <Item onClick={() => { this.openCreateOrUpdateModal('create') }}>
          ???????????????
       </Item>
        <Item onClick={this.deleteTreeNodeHandler}>
          ??????
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
            return <span>{item.displayName}&nbsp;<small style={{ fontSize: '.82em', opacity: 0.5 }}>{item.memberCount}????????????,{item.roleCount}??????</small></span>;
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
        title: '??????',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Button onClick={() => { this.removeUserFromOrganizationUnit(record.id) }} icon="close-circle" type="primary">??????</Button>,
      },
      {
        title: '?????????',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '????????????',
        dataIndex: 'addedTime',
        key: 'addedTime',
      },
    ];
    const organizationUnitRoleTableColumns = [
      {
        title: '??????',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Button onClick={() => { this.removeRoleFromOrganizationUnit(record.id) }} icon="close-circle" type="primary">??????</Button>,
      },
      {
        title: '??????',
        dataIndex: 'displayName',
        key: 'displayName',
      },
      {
        title: '????????????',
        dataIndex: 'addedTime',
        key: 'addedTime',
      },
    ]
    return (
      <PageHeaderWrapper
      content="???????????????????????????????????????????????????.">
        <Row gutter={[24, 24]}>

          <Col xs={24} xl={12}>

            <Card extra={<Button onClick={this.creatrRootNodeHandler} type="primary" icon="plus">???????????????</Button>} title="???????????????">
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
            <Card title="??????">
              <Tabs type="card" >
                <TabPane tab="????????????" key="user">
                  {
                    this.organizationUnitSelectedId === undefined ? (<p>????????????????????????</p>) :
                      (<div><Col style={{ textAlign: 'right' }}>
                        <Button onClick={this.addMermberModalOpen} icon="plus" type="primary">??????????????????</Button>
                      </Col>
                        <Table
                          dataSource={
                            organizationUnitUsers === undefined ? [] : organizationUnitUsers.items
                          }
                          columns={organizationUnitUserTableColumns} />
                      </div>)

                  }

                </TabPane>
                <TabPane tab="??????" key="role">
                  {
                    this.organizationUnitSelectedId === undefined ? (<p>??????????????????</p>) :
                      (<div>   <Col style={{ textAlign: 'right' }}>
                        <Button onClick={this.addRoleModalOpen} icon="plus" type="primary">????????????</Button>
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
                title={this.modalType === 'create' ? '??????????????????' : '??????????????????'}
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
