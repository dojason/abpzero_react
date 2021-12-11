import request from '@/utils/request';

 class PermissionService {
    async getAllPermissions() {
        return request('api/services/app/Permission/GetAllPermissions', {
            method: 'GET',
        });
    }
}
export default new PermissionService();
