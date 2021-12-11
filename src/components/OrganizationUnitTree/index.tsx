import React from 'react';
import { Tree } from 'antd';
import { connect } from 'dva';
import AppComponentBase from '../AppComponentBase';
import { ConnectState, ConnectProps } from '@/models/connect';
import { createTree } from '@/utils/utils';
import { ListResultDto } from '@/shared/dtos/listResultDto';
import { OrganizationUnitDto } from '@/services/organizationunits/dtos/organizationUnitDto';

const { DirectoryTree } = Tree;

export interface OrganizationUnitTreeProps extends ConnectProps {
  allOrganizationUnits: ListResultDto<OrganizationUnitDto>;
  selectedOrganizationUnits: string[];
}
class OrganizationUnitTree extends AppComponentBase<OrganizationUnitTreeProps> {
  async componentWillMount() {
    const { dispatch } = this.props;
    await dispatch!({
      type: 'organizationUnitTree/getAllOrganizationUnits',
    })
  }

  treeCheckedHandler = (selectKeys: any) => {
    const { dispatch } = this.props;
    dispatch!({
      type: 'organizationUnitTree/selectOrganizationUnits',
      payload: selectKeys,
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch!({
      type: 'organizationUnitTree/selectOrganizationUnits',
      payload: [],
    })
  }

  render() {
    const { allOrganizationUnits, selectedOrganizationUnits } = this.props
    const treeData = createTree(
      allOrganizationUnits === undefined ? [] : allOrganizationUnits.items,
      'parentId',
      'id',
      null,
      'children',
      [
        {
          target: 'title',
          targetFunction(item: OrganizationUnitDto) {
            return <span>{item.displayName}</span>;
          },
        }, {
          target: 'key',
          targetFunction(item: OrganizationUnitDto) {
            return item.id;
          },
        },
      ]);
    return (
      <DirectoryTree
        checkable
        defaultCheckedKeys={selectedOrganizationUnits}
        multiple
        showLine
        treeData={treeData}
        defaultExpandAll
        onCheck={this.treeCheckedHandler}>
      </DirectoryTree>
    )
  }
}
export default connect(({ organizationUnitTree }: ConnectState) => ({
  allOrganizationUnits: organizationUnitTree.allOrganizationUnits,
  selectedOrganizationUnits: organizationUnitTree.selectedOrganizationUnits,
}))(OrganizationUnitTree);
