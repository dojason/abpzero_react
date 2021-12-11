import request from '@/utils/request';
import { GetDataDictionaryItemsRequest } from './dtos/getDataDictionaryItemsRequest';

class DataDictionaryService {
    async getDataDictionaryEntrys() {
        return request('api/services/app/DataDictionary/GetDataDictionaryEntrys', {
            method: 'GET',
        });
    }

    async getDataDictionaryItems(input: GetDataDictionaryItemsRequest) {
      return request('api/services/app/DataDictionary/GetDataDictionaryItems', {
          method: 'GET',
          params: input,
      });
  }
}
export default new DataDictionaryService();
