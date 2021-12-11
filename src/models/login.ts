import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import TokenAuthService from '@/services/tokenAuth/tokenAuth'
import { getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import AppConsts from '@/lib/appconst';

export interface LoginModelState {
  status?: true | false;
  type?: string;
  resetPasswordModalState?:boolean;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: LoginModelState;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginModelState>;
    changeResetPasswordModalStatus: Reducer<LoginModelState>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    resetPasswordModalState: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(TokenAuthService.authenticate, payload)
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success === true) {
        const { result } = response;
        if (result.shouldResetPassword) {
          // Password reset
          yield put({
            type: 'resetPassword',
            payload: result.shouldResetPassword,
          });
          return;
        }

        // token重置时间
        const tokenExpireDate = payload.rememberClient ?
         (new Date(new Date().getTime() + 1000 * result.expireInSeconds)) : undefined;
        // set Token
        abp.auth.setToken(result.accessToken, tokenExpireDate);
        // set cookie
        abp.utils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName,
          result.encryptedAccessToken, tokenExpireDate, abp.appPath);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/account/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/account/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    // 修改登录状态
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      return {
        ...state,
        status: payload.success,
        type: payload.type,
      };
    },
    changeResetPasswordModalStatus(state, { payload }) {
      return {
        ...state,
        resetPasswordModalState: payload,
      };
    },
  },
};

export default Model;
