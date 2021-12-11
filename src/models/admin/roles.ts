import { Reducer } from 'redux';
import { Effect } from 'dva';
import RolesService from '@/services/roles/roles'
import { RoleListDto } from '@/services/roles/dtos/roleListDto';
import ListResultDto from '@/shared/dtos/listResultDto';
import { GetRoleForEditOutput } from '@/services/roles/dtos/getRoleForEditOutput';

export interface RolesModelState {
  roles?: ListResultDto<RoleListDto>;
  editRole?: GetRoleForEditOutput;
}
export interface RolesModelType {
  namespace: string;
  state: RolesModelState;
  effects: {
    getRoles: Effect;
    createOrUpdateRole: Effect;
    getRoleForEdit: Effect;
    deleteRole: Effect;
  };
  reducers: {
    saveRoles: Reducer<RolesModelState>;
    saveEditRole: Reducer<RolesModelState>;
    saveDeleteRole: Reducer<RolesModelState>;
  };
}
const Model: RolesModelType = {
  namespace: 'roles',
  state: {
    roles: undefined,
  },
  effects: {
    *getRoles({ payload }, { call, put }) {
      const response = yield call(RolesService.getRoles, payload)
      yield put({
        type: 'saveRoles',
        payload: response.result,
      })
    },
    *getRoleForEdit({ payload }, { call, put }) {
      const response = yield call(RolesService.getRoleForEdit, payload)
      yield put({
        type: 'saveEditRole',
        payload: response.result,
      })
    },
    *createOrUpdateRole({ payload }, { call }) {
      yield call(RolesService.createOrUpdateRole, payload)
    },
    *deleteRole({ payload }, { call, put }) {
      yield call(RolesService.deleteRole, payload)
      yield put({
        type: 'saveDeleteRole',
        payload,
      })
    },
  },
  reducers: {
    saveEditRole(state, { payload }) {
      return ({
        ...state,
        editRole: payload,
      })
    },
    saveRoles(state, { payload }) {
      return ({
        ...state,
        roles: payload,
      })
    },
    saveDeleteRole(state, { payload }) {
      return ({
        ...state,
        roles: {
          items: state!.roles!.items.filter(t => t.id !== payload),
        },
      })
    },
  },
}
export default Model;
