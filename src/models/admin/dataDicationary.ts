import { Effect } from 'dva';
import { Reducer } from 'redux';
import DataDictionaryService from '@/services/dataDicationary/dataDictionary';
import { DataDictionaryDto } from '../../services/dataDicationary/dtos/dataDictionaryDto';
import PagedResultDto from '@/shared/dtos/pagedResultDto';

export interface DataDictionaryModelState {
  dataDictionaryEntrys?:DataDictionaryDto[]
  dataDictionaryItems?:PagedResultDto<DataDictionaryDto>
}
export interface DataDictionaryModelType {
  namespace: string;
  state: DataDictionaryModelState;
  effects: {
    getDataDictionaryEntrys: Effect;
    getDataDictionaryItems: Effect;
  };
  reducers: {
    saveDataDictionaryEntrys: Reducer<DataDictionaryModelState>;
    saveDataDictionaryItems: Reducer<DataDictionaryModelState>;
  };
}
const Model: DataDictionaryModelType = {
  namespace: 'dataDictionarys',
  state: {
    dataDictionaryEntrys: undefined,
  },
  effects: {
     *getDataDictionaryEntrys(_, { call, put }) {
         const response = yield call(DataDictionaryService.getDataDictionaryEntrys)
         yield put({
           type: 'saveDataDictionaryEntrys',
           payload: response.result,
         })
     },
     *getDataDictionaryItems({ payload }, { call, put }) {
      const response = yield call(DataDictionaryService.getDataDictionaryItems, payload)
      yield put({
        type: 'saveDataDictionaryItems',
        payload: response.result,
      })
  },
  },
  reducers: {
    saveDataDictionaryEntrys(state, { payload }) {
        return ({
          ...state,
          dataDictionaryEntrys: payload,
        })
    },
    saveDataDictionaryItems(state, { payload }) {
      return ({
        ...state,
        dataDictionaryItems: payload,
      })
    },
  },
}

export default Model;
