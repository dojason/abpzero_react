import { Effect } from 'dva';
import { Reducer } from 'redux';
import ListResultDto from '@/shared/dtos/listResultDto';
import OrganizationUnitsService from '@/services/organizationunits/organizationunits'
import { OrganizationUnitDto } from '@/services/organizationunits/dtos/organizationUnitDto';

export interface OrganizationUnitTreeModelState {
   allOrganizationUnits?:ListResultDto<OrganizationUnitDto>;
   selectedOrganizationUnits?:string[];
}

export interface OrganizationUnitTreeModelType {
  namespace: 'organizationUnitTree';
  state: OrganizationUnitTreeModelState;
  effects: {
    getAllOrganizationUnits:Effect;
    selectOrganizationUnits:Effect;
  };
  reducers: {
    saveAllOrganizationUnits: Reducer<OrganizationUnitTreeModelState>;
    saveSelectedOrganizationUnits: Reducer<OrganizationUnitTreeModelState>;
  };
}

const OrganizationUnitTreeModel: OrganizationUnitTreeModelType = {
  namespace: 'organizationUnitTree',
  state: {
    allOrganizationUnits: undefined,
    selectedOrganizationUnits: [],
  },

  effects: {
    *getAllOrganizationUnits(_, { call, put }) {
        const response = yield call(OrganizationUnitsService.getOrganizationUnits)
        yield put({
          type: 'saveAllOrganizationUnits',
          payload: response.result,
        })
    },
    *selectOrganizationUnits({ payload }, { put }) {
      yield put({
        type: 'saveSelectedOrganizationUnits',
        payload,
      })
    },
  },

  reducers: {
    saveAllOrganizationUnits(state, { payload }) {
      return {
        ...state,
        allOrganizationUnits: payload,
      }
    },
    saveSelectedOrganizationUnits(state, { payload }) {
      return {
        ...state,
        selectedOrganizationUnits: payload,
      }
    },
  },
};

export default OrganizationUnitTreeModel;
