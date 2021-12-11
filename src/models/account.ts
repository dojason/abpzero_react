import { Effect } from 'dva';

import AccountService from '@/services/account/account';

export interface AccountModelState {

}

export interface AccountModelType {
  namespace: 'account';
  state: AccountModelState;
  effects: {
    register: Effect;
  };
  reducers: {

  };
}

const AccountModel: AccountModelType = {
  namespace: 'account',

  state: {

  },

  effects: {
    *register({ payload }, { call }) {
       yield call(AccountService.register, payload);
    },
  },

  reducers: {

  },
};

export default AccountModel;
