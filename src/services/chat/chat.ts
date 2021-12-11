import request from '@/utils/request';
import { GetUserChatMessagesInput } from './dtos/getUserChatMessagesInput';
import { MarkAllUnreadMessagesOfUserAsReadInput } from './dtos/markAllUnreadMessagesOfUserAsReadInput';

export default class ChatService {
    async getUserChatFriendsWithSettings() {
        return request('/api/services/app/Chat/GetUserChatFriendsWithSettings', {
            method: 'GET',
        });
    }

    async getUserChatMessages(input:GetUserChatMessagesInput) {
        return request('/api/services/app/Chat/GetUserChatMessages', {
            method: 'GET',
            params: input,
        });
    }

    async markAllUnreadMessagesOfUserAsRead(input:MarkAllUnreadMessagesOfUserAsReadInput) {
        return request('/api/services/app/Chat/MarkAllUnreadMessagesOfUserAsRead', {
            method: 'GET',
            params: input,
        });
    }
}
