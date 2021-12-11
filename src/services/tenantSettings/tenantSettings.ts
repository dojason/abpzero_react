import request from '@/utils/request';
import { TenantSettingsEditDto } from './dtos/tenantSettingsEditDto';

class TenantSettingsService {
  async getAllSettings() {
    return request('api/services/app/TenantSettings/GetAllSettings', {
      method: 'GET',
    });
  }

  async updateAllSettings(input:TenantSettingsEditDto) {
    return request('api/services/app/TenantSettings/UpdateAllSettings', {
      method: 'PUT',
      data: input,
    });
  }
}
export default new TenantSettingsService();
