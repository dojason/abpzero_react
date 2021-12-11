
import * as React from 'react';
import { notification, message } from 'antd';
import { NotificationApi } from 'antd/lib/notification';
import { MessageApi } from 'antd/lib/message';
import { L, isGranted } from '../../lib/abpUtility';
import AppConsts from '@/lib/appconst';


class AppComponentBase<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  protected readonly maxResultCount: number = AppConsts.defaultPageSize;

  protected readonly skipCount: number = AppConsts.defaultPageIndex;

  // 全局提示
  protected readonly message: MessageApi = message;

  // 通知
  protected readonly notity: NotificationApi = notification;

  showPageTotal(total: number) {
    return `共 ${total} 项`;
  }

  L(key: string, ...args: any[]): string {
    args.unshift(key);
    args.unshift(AppConsts.localization.defaultLocalizationSourceName);
    return this.ls.apply(this, args);
  }

  ls(sourcename: string, key: string, ...args: any[]): string {
    let localizedText = L(key, sourcename);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }
    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, this.flattenDeep(args));
  }

  flattenDeep(array: any[]): any {
    return array.reduce((acc, val) => (Array.isArray(val)
        ? acc.concat(this.flattenDeep(val))
        : acc.concat(val)),
      []);
  }

  // eslint-disable-next-line class-methods-use-this
  isGranted(permissionName: string): boolean {
    return isGranted(permissionName);
  }

  isGrantedAny(...permissions: string[]): boolean {
    if (!permissions) {
      return false;
    }
    permissions.forEach(item => {
      if (this.isGranted(item)) {
        return true;
      }
        return false;
    })
    return false;
  }
}

export default AppComponentBase;
