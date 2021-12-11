import AppComponentBase from "../AppComponentBase";
import React from "react";
import { Tree } from 'antd';
import { connect } from "dva";
import { ConnectState, ConnectProps } from "@/models/connect";
import { createTree } from "@/utils/utils";
import { FlatPermissionWithLevelDto } from "@/services/permission/dtos/flatPermissionWithLevelDto";
import { ListResultDto } from "@/shared/dtos/listResultDto";

const { DirectoryTree } = Tree;

export interface PermissionsTreeProps extends ConnectProps {
  allPermissions: ListResultDto<FlatPermissionWithLevelDto>;
  selectedPermissionsName:string[];
}
class PermissionsTree extends AppComponentBase<PermissionsTreeProps>{

  treeCheckedHandler=(selectKeys:any)=>{
    const { dispatch } = this.props;
     dispatch!({
      type: "permissions/selectPermissionsTree",
      payload:selectKeys
    })
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
     dispatch!({
      type: "permissions/selectPermissionsTree",
      payload:[]
    })
  }
  render() {
    const { allPermissions,selectedPermissionsName } = this.props;
    let treeData = createTree(allPermissions == undefined ? [] : allPermissions.items,
      'parentName',
      'name',
      null,
      'children',
      [
        {
          target: 'title',
          targetFunction:(item: FlatPermissionWithLevelDto)=>{
            return <span>{this.L(item.displayName)}</span>;
          }
        }, {
          target: 'key',
          targetFunction(item: FlatPermissionWithLevelDto) {
            return item.name;
          }
        }
      ]);

    return (
      <DirectoryTree
        checkable
        defaultCheckedKeys={selectedPermissionsName}
        multiple
        showLine
        treeData={treeData}
        defaultExpandAll
        onCheck={this.treeCheckedHandler}>

      </DirectoryTree>
    )
  }
}
export default connect(({ permissions }: ConnectState) => ({
  allPermissions: permissions.allPermissions,
  selectedPermissionsName: permissions.selectedPermissionsName,
}))(PermissionsTree);
