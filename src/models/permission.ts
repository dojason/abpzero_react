import { Effect } from 'dva';
import { Reducer } from 'redux';
import ListResultDto from '@/shared/dtos/listResultDto';
import { FlatPermissionWithLevelDto } from '@/services/permission/dtos/flatPermissionWithLevelDto';
import PermissionService from '@/services/permission/permission';

export interface PermissionModelState {
   allPermissions?:ListResultDto<FlatPermissionWithLevelDto>;
   selectedPermissionsName?:string[];
}

export interface PermissionModelType {
  namespace: 'permissions';
  state: PermissionModelState;
  effects: {
    getAllPermissions:Effect;
    selectPermissionsTree:Effect;
  };
  reducers: {
    saveAllPermissions: Reducer<PermissionModelState>;
    saveSelectedPermissions: Reducer<PermissionModelState>;
  };
}

const PermissionModel: PermissionModelType = {
  namespace: 'permissions',
  state: {
    allPermissions: undefined,
    selectedPermissionsName: [],
  },

  effects: {
    *getAllPermissions(_, { call, put }) {
        const response = yield call(PermissionService.getAllPermissions)
        yield put({
          type: 'saveAllPermissions',
          payload: response.result,
        })
    },
    *selectPermissionsTree({ payload }, { put }) {
      yield put({
        type: 'getAllPermissions',
      })
      yield put({
        type: 'saveSelectedPermissions',
        payload,
      })
    },
  },

  reducers: {
    saveAllPermissions(state, { payload }) {
      return {
        ...state,
        allPermissions: payload,
      }
    },
    saveSelectedPermissions(state, { payload }) {
      return {
        ...state,
        selectedPermissionsName: payload,
      }
    },
  },
};

export default PermissionModel;
