import { Effect } from 'dva';
import { Reducer } from 'redux';
import { GetLanguagesOutput } from '@/services/languages/dtos/getLanguagesOutput';
import LanguagesService from '@/services/languages/languages'
import { LanguageTextListDto } from '@/services/languages/dtos/languageTextListDto';
import PagedResultDto from '@/shared/dtos/pagedResultDto';

export interface LanguagesModelState {
  languages?: GetLanguagesOutput;
  languageTexts?: PagedResultDto<LanguageTextListDto>
}
export interface LanguagesModelType {
  namespace: string;
  state: LanguagesModelState;
  effects: {
    getLanguages: Effect;
    getLanguageTexts: Effect;
    updateLanguageText: Effect;
    setDefaultLanguage:Effect;
  };
  reducers: {
    saveLanguages: Reducer<LanguagesModelState>;
    saveLanguageTexts: Reducer<LanguagesModelState>;
  };
}
const Model: LanguagesModelType = {
  namespace: 'languages',
  state: {
    languages: undefined,
    languageTexts: undefined,
  },
  effects: {
    *getLanguages(_, { call, put }) {
      const response = yield call(LanguagesService.getLanguages)
      yield put({
        type: 'saveLanguages',
        payload: response.result,
      })
    },
    *getLanguageTexts({ payload }, { call, put }) {
      const response = yield call(LanguagesService.getLanguageTexts, payload)
      yield put({
        type: 'saveLanguageTexts',
        payload: response.result,
      })
    },
    *setDefaultLanguage({ payload }, { call }) {
      yield call(LanguagesService.SetDefaultLanguage, payload)
    },
    *updateLanguageText({ payload }, { call }) {
        yield call(LanguagesService.UpdateLanguageText, payload)
    },
  },
  reducers: {
    saveLanguages(state, { payload }) {
      return {
        ...state,
        languages: payload,
      }
    },

    saveLanguageTexts(state, { payload }) {
      return {
        ...state,
        languageTexts: payload,
      }
    },
  },
}
export default Model;
