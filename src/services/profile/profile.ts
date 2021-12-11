

import request from '@/utils/request';
import { ChangeUserLanguageDto } from './dtos/changeUserLanguageDto';

class ProfileService {
  async getCurrentUserProfileForEdit() {
    return request('api/services/app/Profile/GetCurrentUserProfileForEdit', {
      method: 'GET',
    });
  }

  async changeLanguage(input: ChangeUserLanguageDto) {
    return request('api/services/app/Profile/ChangeLanguage', {
      method: 'POST',
      data: input,
    });
  }

  async getPasswordComplexitySetting() {
    return request('api/services/app/Profile/GetPasswordComplexitySetting', {
      method: 'GET',
    });
  }
}
export default new ProfileService();
