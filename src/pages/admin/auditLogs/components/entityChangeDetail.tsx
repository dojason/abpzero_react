
import React from 'react';
import {
  Modal, Button, Table, Alert,
} from 'antd';
import { EntityPropertyChangeDto } from '@/services/auditLog/dtos/entityPropertyChangeDto';
import { EntityChangeListDto } from '@/services/auditLog/dtos/entityChangeListDto';
import AppComponentBase from '@/components/AppComponentBase';

export interface IEntityChangeDetailProps {
  visible: boolean;
  onCancel: () => void;
  entityChangeItem: EntityChangeListDto;
  entityPropertyChanges?: EntityPropertyChangeDto[];
}
class EntityChangeDetail extends AppComponentBase<IEntityChangeDetailProps> {
  public render() {
    const {
      visible, onCancel, entityPropertyChanges, entityChangeItem,
    } = this.props;
    const columns = [
      {
        title: '属性',
        dataIndex: 'propertyName',
        key: 'propertyName',
      },
      {
        title: '旧值',
        width: '200px',
        dataIndex: 'originalValue',
        key: 'originalValue',
      },
      {
        title: '新值',
        dataIndex: 'newValue',
        key: 'newValue',
      },
    ];
    function formatChangeType() {
      let information = '';
      let changeType = '';
      if (entityChangeItem !== undefined) {
        switch (entityChangeItem.changeType) {
          case 0:
            changeType = '创建';
            break;
          case 1:
            changeType = '更新';
            break;
          case 2:
            changeType = '删除';
            break;
          default:
            changeType = '';
        }
        information = `由${`${entityChangeItem.userName + changeType}于${entityChangeItem.changeTime}`}`;
      }
      return information;
    }
    return (
      <Modal
        width="50%"
        onCancel={onCancel}
        footer={<Button onClick={onCancel} >取消</Button>}
        title={`详情--${entityChangeItem === undefined ? '' : entityChangeItem.entityTypeFullName}`}
        visible={visible}>
        <Alert showIcon message={formatChangeType()} type="info" />
        <br />
        <Table
          bordered
          dataSource={entityPropertyChanges === undefined ? [] : entityPropertyChanges}
          pagination={false}
          columns={columns} />


      </Modal>
    )
  }
}
export default EntityChangeDetail;
