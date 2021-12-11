
import { Effect } from 'dva';
import { Reducer } from 'redux';

import ProfileService from '@/services/profile/profile';
import PasswordComplexitySetting from '@/services/profile/dtos/passwordComplexitySetting';

export interface ProfileModelState {
  passwordSetting?:PasswordComplexitySetting
}

export interface ProfileModelType {
  namespace: 'profile';
  state: ProfileModelState;
  effects: {
    getPasswordComplexitySetting: Effect;
  };
  reducers: {
    savePasswordSetting:Reducer<ProfileModelState>;
  };
}

const ProfileModel: ProfileModelType = {
  namespace: 'profile',

  state: {
    passwordSetting: undefined,
  },

  effects: {
    *getPasswordComplexitySetting(_, { call, put }) {
      const response = yield call(ProfileService.getPasswordComplexitySetting);
       yield put({
         type: 'savePasswordSetting',
         payload: response.result.setting,
       })
    },
  },

  reducers: {
    savePasswordSetting(state, { payload }) {
      return {
        passwordSetting: payload,
      }
    },
  },
};

export default ProfileModel;
