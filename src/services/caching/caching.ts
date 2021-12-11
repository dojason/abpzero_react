import request from '@/utils/request';
import EntityDto from '@/shared/dtos/entityDto';

export default class CachingService {
    async getAllCaches() {
        return request('/api/services/app/Caching/GetAllCaches', {
            method: 'GET',
        });
    }

    async clearCache(input:EntityDto<string>) {
        return request('/api/services/app/Caching/ClearCache', {
            method: 'POST',
            params: input,
        });
    }

    async clearAllCaches() {
        return request('/api/services/app/Caching/clearAllCaches', {
            method: 'POST',
        });
    }
}
