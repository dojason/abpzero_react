import request from '@/utils/request';

export async function getCurrentLoginInformations() {
    return request('api/services/app/Session/GetCurrentLoginInformations');
  }
