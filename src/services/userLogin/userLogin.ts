import request from '@/utils/request';


class UserLoginService {
    async getRecentUserLoginAttempts() {
        return request('api/services/app/UserLogin/GetRecentUserLoginAttempts', {
            method: 'GET',
        });
    }
}
export default new UserLoginService();
