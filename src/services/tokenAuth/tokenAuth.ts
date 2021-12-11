import request from '@/utils/request';
import { AuthenticateModel } from './dtos/authenticateModel';


class TokenAuthService {
    async authenticate(input: AuthenticateModel) {
        return request('api/TokenAuth/Authenticate', {
            method: 'POST',
            data: input,
        });
    }
}
export default new TokenAuthService();
