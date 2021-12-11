
import { Effect } from 'dva';
import { Reducer } from 'redux';
import * as lodash from 'lodash';
import NotificationService from '@/services/notification/notification'
import { FormattedUserNotification, UserNotification } from '@/services/notification/dtos/userNotification';
import UserNotificationHelper from '@/shared/helpers/UserNotificationHelper';

export interface NotificationModelState {
  unreadCount?: number;
  notifications?: FormattedUserNotification[];
}
export interface NotificationModelType {
  namespace: string;
  state: NotificationModelState;
  effects: {
    getUserNotifications: Effect;
    setNotificationAsRead: Effect;
    setAllNotificationsAsRead: Effect;
  };
  reducers: {
    saveUserNotifications: Reducer<NotificationModelState>
  };
}
const Model: NotificationModelType = {
  namespace: 'notification',
  state: {
    unreadCount: 0,
    notifications: undefined,
  },
  effects: {
    *getUserNotifications(_, { call, put }) {
      const response = yield call(NotificationService.getUserNotifications);
      const notifications:FormattedUserNotification[] = [];
      lodash.forEach(response.result.items, (item: UserNotification) => {
        notifications.push(UserNotificationHelper.format(<any>item));
      });

      yield put({
        type: 'saveUserNotifications',
        payload: {
          notifications,
          unreadCount: response.result.unreadCount,
        },
      })
    },
    *setNotificationAsRead({ payload }, { call }) {
        yield call(NotificationService.setNotificationAsRead, payload);
    },
    *setAllNotificationsAsRead(_, { call }) {
      yield call(NotificationService.setAllNotificationsAsRead);
    },
  },
  reducers: {
    saveUserNotifications(state, { payload }) {
      return {
        notifications: payload.notifications,
        unreadCount: payload.unreadCount,
      }
    },
  },
}
export default Model;
