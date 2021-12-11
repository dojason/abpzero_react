
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Card, Button, Table } from 'antd';
import DirectoryTree from 'antd/lib/tree/DirectoryTree';
import AppComponentBase from '@/components/AppComponentBase';
import { AnyAction, Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { createTree } from '@/utils/utils';
import { DataDictionaryDto } from '@/services/dataDicationary/dtos/dataDictionaryDto';
import { AntTreeNodeMouseEvent } from 'antd/lib/tree';
import { contextMenu, Menu, Item } from 'react-contexify';
import CreateOrUpdateDataDictionary from './components/createOrUpdateDataDictionary';
import PagedResultDto from '@/shared/dtos/pagedResultDto';

interface DataDictionarysProps {
  dispatch: Dispatch<AnyAction>;
  dataDictionaryEntrys: DataDictionaryDto[];
  dataDictionaryItems: PagedResultDto<DataDictionaryDto>
}
export declare type ModalType = 'create' | 'update';
export interface DataDictionarysStates {
  creatrOrUpdateModalVisible: boolean;
}
@connect(({ dataDictionarys, loading }: ConnectState) => ({
  dataDictionaryEntrys: dataDictionarys.dataDictionaryEntrys,
  dataDictionaryItems: dataDictionarys.dataDictionaryItems,
  loading: loading.effects['dataDictionarys/getDataDictionaryEntrys'],
}))
class DataDictionarys extends AppComponentBase<DataDictionarysProps, DataDictionarysStates> {
  createTreeNodeModalRef: any = React.createRef();

  // modal类型
  modalType?: ModalType;

  selectedId: number | null = null;

  state = {
    creatrOrUpdateModalVisible: false,
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'dataDictionarys/getDataDictionaryEntrys',
    })
  }

  creatrRootNodeHandler = () => {
    this.selectedId = null;
    this.openCreateOrUpdateModal('create');
  }

  openCreateOrUpdateModal(type: ModalType) {
    this.modalType = type;
    const { resetFields, setFieldsValue } = this.createTreeNodeModalRef.current;
    resetFields();
    if (type === 'update') {
      const selectNode = this.props.dataDictionaryEntrys!
        .filter(t => t.id === this.selectedId);
      setFieldsValue({
        name: selectNode[0].name,
      })
    }
    this.createOrUpdateModal();
  }

  getDataDictionaryItems = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'dataDictionarys/getDataDictionaryItems',
      payload: {
        parentId: this.selectedId,
      },
    })
  }

  createOrUpdateModal = () => {
    this.setState(state => ({
      creatrOrUpdateModalVisible: !state.creatrOrUpdateModalVisible,
    }))
  }

  // 选中树节点
  selectTree = (selectedKeys: string[]) => {
    if (Number.isNaN(Number(selectedKeys[0])) === true) {
      this.selectedId = 0;
    } else {
      this.selectedId = Number(selectedKeys[0]);
    }
    this.getDataDictionaryItems();
  }

  openCreateOrUpdateModalOk = () => {
    const { validateFields } = this.createTreeNodeModalRef.current;
    validateFields((errors:any, values:any) => {
      if (!errors === true) {
        const { dispatch } = this.props;
        if (this.modalType === 'create') {
          dispatch({
            type: 'organizationUnits/createOrganizationUnit',
            payload: {
              ...values, parentId: this.selectedId,
            },
          })
        } else {
          dispatch({
            type: 'organizationUnits/updateOrganizationUnit',
            payload: {
              ...values, id: this.selectedId,
            },
          })
        }
      }
    })
  }

  // 树右键菜单
  treeRightClickHandler = (e: AntTreeNodeMouseEvent) => {
    this.selectedId = Number(e.node.props.eventKey);
    contextMenu.show({
      id: 'rightMenu',
      event: e.event,
    });
  }

  public render() {
    const MyMenu = () => (
      <Menu style={{ zIndex: 1000 }} id="rightMenu">
        <Item onClick={() => { this.openCreateOrUpdateModal('update') }}>
          修改
        </Item>
        <Item onClick={() => { this.openCreateOrUpdateModal('create') }}>
          添加子分类项
        </Item>
        <Item>
          添加字典项
      </Item>
        <Item>
          删除
        </Item>
      </Menu>
    );
    const { dataDictionaryEntrys, dataDictionaryItems } = this.props;
    const { creatrOrUpdateModalVisible } = this.state;
    const treeData = createTree(dataDictionaryEntrys === undefined ? [] : dataDictionaryEntrys,
      'parentId',
      'id',
      null,
      'children',
      [
        {
          target: 'title',
          targetFunction(item: DataDictionaryDto) {
            return item.name
          },
        }, {
          target: 'key',
          targetFunction(item: DataDictionaryDto) {
            return item.id;
          },
        },
      ]);
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '是否激活',
        dataIndex: 'isActive',
        key: 'isActive',
      },
      {
        title: '是否默认项',
        dataIndex: 'isDefault',
        key: 'isDefault',
      },
      {
        title: '描述',
        dataIndex: 'dedscription',
        key: 'dedscription',
      },
    ];
    return (
      <PageHeaderWrapper>
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={8}>

            <Card extra={<Button onClick={this.creatrRootNodeHandler} type="primary" icon="plus">添加分类</Button>} title="字典分类">
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
          <Col xs={24} xl={16}>

            <Card title="字典项">
              <Table
              dataSource={dataDictionaryItems === undefined ? [] : dataDictionaryItems.items}
              columns={columns} />
            </Card>
          </Col>
        </Row>
        <CreateOrUpdateDataDictionary
          title={this.modalType === 'create' ? '新增字典项' : '编辑字典项'}
          ref={this.createTreeNodeModalRef}
          visible={creatrOrUpdateModalVisible}
          onCancel={this.createOrUpdateModal}
          onOk={this.openCreateOrUpdateModalOk} />
      </PageHeaderWrapper>
    )
  }
}

export default DataDictionarys;
