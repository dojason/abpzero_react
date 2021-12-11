import request from '@/utils/request';
import { GetUsersInput } from './dtos/getUsersInput';
import EntityDto from '../../shared/dtos/entityDto';
import { CreateOrUpdateUserInput } from './dtos/createOrUpdateUserInput';
import { UpdateUserPermissionsInput } from './dtos/updateUserPermissionsInput';

class UsersService {
    async GetUsers(input: GetUsersInput) {
        return request('api/services/app/User/GetUsers', {
            method: 'POST',
            data: input,
        });
    }

    async GetUserForEdit(input: EntityDto) {
      return request('api/services/app/User/GetUserForEdit', {
          method: 'GET',
          params: input,
      });
   }

   async UnlockUser(input: EntityDto) {
    return request('api/services/app/User/UnlockUser', {
        method: 'POST',
        data: input,
    });
   }

   async DeleteUser(input: EntityDto) {
    return request('api/services/app/User/DeleteUser', {
        method: 'DELETE',
        params: input,
    });
   }

   async CreateOrUpdateUser(input: CreateOrUpdateUserInput) {
    return request('api/services/app/User/CreateOrUpdateUser', {
        method: 'POST',
        data: input,
    });
   }

   async UpdateUserPermissions(input: UpdateUserPermissionsInput) {
    return request('api/services/app/User/UpdateUserPermissions', {
        method: 'PUT',
        data: input,
    });
   }

   async ResetUserSpecificPermissions(input: EntityDto) {
    return request('api/services/app/User/ResetUserSpecificPermissions', {
        method: 'POST',
        data: input,
    });
   }

   async GetUsersToExcel(input: GetUsersInput) {
    return request('api/services/app/User/GetUsersToExcel', {
        method: 'GET',
        params: input,
    });
   }

   async GetUserPermissionsForEdit(input: EntityDto) {
    return request('api/services/app/User/GetUserPermissionsForEdit', {
        method: 'POST',
        data: input,
    });
   }
}
export default new UsersService();
