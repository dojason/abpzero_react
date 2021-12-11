import React from 'react';
import AppComponentBase from '../AppComponentBase';

interface PermissionCheckProps {
  permission:string|string[];
  children: React.ReactNode
}

class PermissionCheck extends AppComponentBase<PermissionCheckProps> {
    childrenIsShow:boolean = true;

    public render() {
      const type = typeof (this.props.permission)
      if (type === 'string') {
        this.childrenIsShow = this.isGranted(this.props.permission as string)
      } else {
        this.childrenIsShow = this.isGrantedAny(this.props.permission as any)
      }
      return (
        this.childrenIsShow ? this.props.children : null
      )
    }
}
export default PermissionCheck
