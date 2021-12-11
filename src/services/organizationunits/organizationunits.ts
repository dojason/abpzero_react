import request from '@/utils/request';
import { FindOrganizationUnitUsersInput } from './dtos/findOrganizationUnitUsersInput';
import { FindOrganizationUnitRolesInput } from './dtos/findOrganizationUnitRolesInput';
import { GetOrganizationUnitUsersInput } from './dtos/getOrganizationUnitUsersInput';
import { GetOrganizationUnitRolesInput } from './dtos/getOrganizationUnitRolesInput';
import EntityDto from '@/shared/dtos/entityDto';
import { CreateOrganizationUnitInput } from './dtos/createOrganizationUnitInput';
import { RolesToOrganizationUnitInput } from './dtos/rolesToOrganizationUnitInput';
import { UsersToOrganizationUnitInput } from './dtos/usersToOrganizationUnitInput';
import { UserToOrganizationUnitInput } from './dtos/userToOrganizationUnitInput';
import { UpdateOrganizationUnitInput } from './dtos/updateOrganizationUnitInput';

class OrganizationUnitsService {
  async getOrganizationUnits() {
    return request('api/services/app/OrganizationUnit/GetOrganizationUnits', {
      method: 'GET',
    });
  }

  async deleteOrganizationUnit(input: EntityDto) {
    return request('api/services/app/OrganizationUnit/DeleteOrganizationUnit', {
      method: 'DELETE',
      params: input,
    });
  }

  async createOrganizationUnit(input: CreateOrganizationUnitInput) {
    return request('api/services/app/OrganizationUnit/CreateOrganizationUnit', {
      method: 'POST',
      data: input,
    });
  }

  async updateOrganizationUnit(input: UpdateOrganizationUnitInput) {
    return request('api/services/app/OrganizationUnit/UpdateOrganizationUnit', {
      method: 'PUT',
      data: input,
    });
  }

  async findUsers(input: FindOrganizationUnitUsersInput) {
    return request('api/services/app/OrganizationUnit/FindUsers', {
      method: 'POST',
      data: input,
    });
  }

  async findRoles(input: FindOrganizationUnitRolesInput) {
    return request('api/services/app/OrganizationUnit/FindRoles', {
      method: 'POST',
      data: input,
    });
  }

  async getOrganizationUnitUsers(input: GetOrganizationUnitUsersInput) {
    return request('api/services/app/OrganizationUnit/GetOrganizationUnitUsers', {
      method: 'GET',
      params: input,
    });
  }

  async getOrganizationUnitRoles(input: GetOrganizationUnitRolesInput) {
    return request('api/services/app/OrganizationUnit/GetOrganizationUnitRoles', {
      method: 'GET',
      params: input,
    });
  }

  async addUsersToOrganizationUnit(input: UsersToOrganizationUnitInput) {
    return request('api/services/app/OrganizationUnit/AddUsersToOrganizationUnit', {
      method: 'POST',
      data: input,
    });
  }

  async addRolesToOrganizationUnit(input: UsersToOrganizationUnitInput) {
    return request('api/services/app/OrganizationUnit/AddRolesToOrganizationUnit', {
      method: 'POST',
      data: input,
    });
  }

  async removeUserFromOrganizationUnit(input: UserToOrganizationUnitInput) {
    return request('api/services/app/OrganizationUnit/RemoveUserFromOrganizationUnit', {
      method: 'DELETE',
      params: input,
    });
  }

  async removeRoleFromOrganizationUnit(input: RolesToOrganizationUnitInput) {
    return request('api/services/app/OrganizationUnit/RemoveRoleFromOrganizationUnit', {
      method: 'DELETE',
      params: input,
    });
  }
}
export default new OrganizationUnitsService();
