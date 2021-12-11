
import { Effect } from 'dva';
import { Reducer } from 'redux';
import TenantSettingsService from '@/services/tenantSettings/tenantSettings';
import { TenantSettingsEditDto } from '@/services/tenantSettings/dtos/tenantSettingsEditDto';

export interface SettingsModelState {
   allSettings?:TenantSettingsEditDto
}

export interface SettingsModelType {
  namespace: 'adminSettings';
  state: SettingsModelState;
  effects: {
    getAllSettings: Effect;
    updateAllSettings: Effect;
  };
  reducers: {
    saveAllSettings:Reducer<SettingsModelState>;
  };
}

const SettingsModel: SettingsModelType = {
  namespace: 'adminSettings',

  state: {
    allSettings: undefined,
  },

  effects: {
    *getAllSettings(_, { call, put }) {
       const response = yield call(TenantSettingsService.getAllSettings)
       yield put({
          type: 'saveAllSettings',
          payload: response.result,
       })
    },
    *updateAllSettings({ payload }, { call }) {
      yield call(TenantSettingsService.updateAllSettings, payload)
      // yield put({
      //    type:'saveAllSettings',
      //    payload:payload
      // })
    },
  },

  reducers: {
    saveAllSettings(state, { payload }) {
      return {
        allSettings: payload,
      }
    },
  },
};

export default SettingsModel;
