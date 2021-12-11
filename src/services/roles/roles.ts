import request from '@/utils/request';
import { GetRolesInput } from './dtos/getRolesInput';
import EntityDto from '@/shared/dtos/entityDto';
import { CreateOrUpdateRoleInput } from './dtos/createOrUpdateRoleInput';

class RolesService {
  async getRoles(input: GetRolesInput) {
    return request('api/services/app/Role/GetRoles', {
      method: 'POST',
      data: input,
    });
  }

  async getRoleForEdit(input: EntityDto) {
    return request('api/services/app/Role/GetRoleForEdit', {
      method: 'GET',
      params: input,
    });
  }

  async createOrUpdateRole(input: CreateOrUpdateRoleInput) {
    return request('api/services/app/Role/CreateOrUpdateRole', {
      method: 'POST',
      data: input,
    });
  }

  async deleteRole(input: CreateOrUpdateRoleInput) {
    return request('api/services/app/Role/DeleteRole', {
      method: 'DELETE',
      params: input,
    });
  }
}
export default new RolesService();
