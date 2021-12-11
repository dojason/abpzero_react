import { AnyAction, Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { RolesModelState } from './admin/roles';
import { OrganizationUnitsModelState } from './admin/organizationUnits';
import { LanguagesModelState } from './admin/languages';
import { AuditLogsModelState } from './admin/auditLogs';
import { PermissionModelState } from './permission';
import { OrganizationUnitTreeModelState } from './organizationUnitTree';
import { LoginState } from '@/pages/account/login';
import { NotificationModelState } from './notification';
import { AccountModelState } from './account';
import { ProfileModelState } from './profile';
import { SettingsModelState } from './admin/settings';
import { DataDictionaryModelState } from './admin/dataDicationary';

export { GlobalModelState, SettingModelState, UserModelState };
export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    users?:boolean;
    roles?:boolean;
    organizationUnits?:boolean;
    languages?:boolean;
    auditLogs?:boolean;
    permissions?:boolean;
    organizationUnitTree?:boolean;
    notification?:boolean;
    account?:boolean;
    profile?:boolean;
    adminSettings?:boolean;
    dataDictionarys?:boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  users:UserModelState;
  roles:RolesModelState;
  login: LoginState;
  organizationUnits: OrganizationUnitsModelState;
  languages: LanguagesModelState;
  auditLogs:AuditLogsModelState;
  permissions:PermissionModelState;
  notification:NotificationModelState;
  organizationUnitTree:OrganizationUnitTreeModelState;
  account:AccountModelState;
  profile:ProfileModelState;
  adminSettings:SettingsModelState;
  dataDictionarys: DataDictionaryModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
