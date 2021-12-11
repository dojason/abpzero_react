import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { Modal, Table } from 'antd';
import * as _ from 'lodash';
import { AnyAction, Dispatch } from 'redux';
import { OrganizationUnitsModelState } from '@/models/admin/organizationUnits';
import { FindOrganizationUnitUsersInput } from '@/services/organizationunits/dtos/findOrganizationUnitUsersInput';
import { PaginationConfig } from 'antd/lib/table';

interface IAddMemberProps {
  dispatch: Dispatch<AnyAction>;
  organizationUnits: OrganizationUnitsModelState;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  organizationUnitId: number | null;
}
interface IAddMemberStates {
  findUsersInput: FindOrganizationUnitUsersInput;
  selectedMember: any[];
}
class AddMember extends AppComponentBase<IAddMemberProps, IAddMemberStates> {
  state = {
    selectedMember: [],
    findUsersInput: {
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
      filter: '',
      organizationUnitId: null,
    },
  }

  findUsers = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'organizationUnits/findUsers',
      payload: { ...this.state.findUsersInput, organizationUnitId: this.props.organizationUnitId },
    })
  }

  // 复选框选中
  onSelectChange = (selectedMember: any[], selectedRows: any[]) => {
    const { dispatch } = this.props;
    const selectValues = _.map(selectedRows, item => Number(item.value));
    dispatch({
      type: 'organizationUnits/selectFindUsers',
      payload: selectValues,
    })
  };

  handleTableChange = (pagination: PaginationConfig) => {
    this.setState(state => ({
      findUsersInput: {
        ...state.findUsersInput,
        skipCount: (pagination.current! - 1) * state.findUsersInput.maxResultCount!,
      },
    }))
  }

  render() {
    const { visible, onOk, onCancel, organizationUnits } = this.props;
    const { selectedMember } = this.state;
    const columns = [
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    const rowSelection = {
      selectedMember,
      onChange: this.onSelectChange,
    };
    function showPageTotal(total: number) {
      return `共 ${total} 项`;
    }
    return (
      <Modal
        onOk={onOk}
        visible={visible}
        title="添加组织成员"
        onCancel={onCancel}>
        <Table
          loading={organizationUnits.findUsers === undefined}
          rowKey="value"
          dataSource={
            organizationUnits.findUsers === undefined ? [] : organizationUnits.findUsers!.items}
          columns={columns}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          pagination={{
            showTotal: showPageTotal,
            pageSize: this.state.findUsersInput.maxResultCount,
            current: this.state.findUsersInput.skipCount,
            total: organizationUnits.findUsers
            === undefined ? 0 : organizationUnits.findUsers!.totalCount,
          }} >

        </Table>
      </Modal>
    )
  }
}
export default AddMember;
