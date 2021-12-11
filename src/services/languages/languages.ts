import request from '@/utils/request';
import { GetLanguageTextsInput } from './dtos/getLanguageTextsInput';
import { UpdateLanguageTextInput } from './dtos/updateLanguageTextInput';
import { SetDefaultLanguageInput } from './dtos/setDefaultLanguageInput';

 class LanguagesService {
    async getLanguages() {
        return request('api/services/app/Language/GetLanguages', {
            method: 'GET',
        });
    }

    async getLanguageForEdit() {
        return request('api/services/app/Language/GetLanguageForEdit', {
            method: 'GET',
        });
    }

    async createOrUpdateLanguage() {
        return request('api/services/app/Language/CreateOrUpdateLanguage', {
            method: 'POST',
        });
    }

    async deleteLanguage() {
        return request('api/services/app/Language/DeleteLanguage', {
            method: 'DELETE',
        });
    }

    async SetDefaultLanguage(input:SetDefaultLanguageInput) {
        return request('api/services/app/Language/SetDefaultLanguage', {
            method: 'POST',
            data: input,
        });
    }

    async getLanguageTexts(input:GetLanguageTextsInput) {
        return request('api/services/app/Language/GetLanguageTexts', {
            method: 'GET',
            params: input,
        });
    }

    async UpdateLanguageText(input:UpdateLanguageTextInput) {
        return request('api/services/app/Language/UpdateLanguageText', {
            method: 'PUT',
            data: input,
        });
    }
}
export default new LanguagesService();
