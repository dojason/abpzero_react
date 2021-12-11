import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { Modal, Table } from 'antd';
import * as _ from 'lodash';
import { AnyAction, Dispatch } from 'redux';
import { OrganizationUnitsModelState } from '@/models/admin/organizationUnits';
import { FindOrganizationUnitRolesInput } from '@/services/organizationunits/dtos/findOrganizationUnitRolesInput';
import { PaginationConfig } from 'antd/lib/table';

interface IAddRoleProps {
  dispatch: Dispatch<AnyAction>;
  organizationUnits: OrganizationUnitsModelState;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  organizationUnitId: number | null;
}
interface IAddRoleStates {
  findRolesInput: FindOrganizationUnitRolesInput;
  selectedRole: any[];
}
class AddRole extends AppComponentBase<IAddRoleProps, IAddRoleStates> {
  state = {
    selectedRole: [],
    organizationUnitId: null,
    findRolesInput: {
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
      filter: '',
      organizationUnitId: null,
    },
  }

  findRoles = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'organizationUnits/findRoles',
      payload: {
        ...this.state.findRolesInput,
        organizationUnitId: this.props.organizationUnitId,
      },
    })
  }

  // 复选框选中
  onSelectChange = (selectedMember: any[], selectedRows: any[]) => {
    const { dispatch } = this.props;
    const selectValues = _.map(selectedRows, item => Number(item.value));
    dispatch({
      type: 'organizationUnits/selectFindRoles',
      payload: selectValues,
    })
  };

  handleTableChange = (pagination: PaginationConfig) => {
    this.setState(state => ({
      findRolesInput: {
        ...state.findRolesInput,
        skipCount: (pagination.current! - 1) * state.findRolesInput.maxResultCount!,
      },
    }))
  }

  render() {
    const { visible, onOk, onCancel, organizationUnits } = this.props;
    const { selectedRole } = this.state;
    const columns = [
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    const rowSelection = {
      selectedRole,
      onChange: this.onSelectChange,
    };
    function showPageTotal(total: number) {
      return `共 ${total} 项`;
    }
    return (
      <Modal
        onOk={onOk}
        visible={visible}
        title="添加组织机构角色"
        onCancel={onCancel}>
        <Table
          loading={organizationUnits.findRoles === undefined}
          dataSource={organizationUnits.findRoles
            === undefined ? [] : organizationUnits.findRoles!.items}
          columns={columns}
          rowKey="value"
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          pagination={{
            showTotal: showPageTotal,
            pageSize: this.state.findRolesInput.maxResultCount,
            current: this.state.findRolesInput.skipCount,
            total: organizationUnits.findRoles
             === undefined ? 0 : organizationUnits.findRoles!.totalCount,
          }} >

        </Table>
      </Modal>
    )
  }
}
export default AddRole;
