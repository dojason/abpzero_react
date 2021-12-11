import request from '@/utils/request';
import { GetAuditLogsInput } from './dtos/getAuditLogsInput';
import { GetEntityChangeInput } from './dtos/getEntityChangeInput';
import { GetEntityTypeChangeInput } from './dtos/getEntityTypeChangeInput';

 class AuditLogService {
    async getAuditLogs(input: GetAuditLogsInput) {
        return request('api/services/app/AuditLog/GetAuditLogs', {
            method: 'GET',
            params: input,
        });
    }

    async getAuditLogsToExcel(input: GetAuditLogsInput) {
        return request('api/services/app/AuditLog/GetAuditLogsToExcel', {
            method: 'GET',
            params: input,
        });
    }

    async getEntityHistoryObjectTypes() {
        return request('api/services/app/AuditLog/GetEntityHistoryObjectTypes', {
            method: 'GET',
        });
    }

    async getEntityChanges(input: GetEntityChangeInput) {
        return request('api/services/app/AuditLog/GetEntityChanges', {
            method: 'GET',
            params: input,
        });
    }

    async getEntityTypeChanges(input: GetEntityTypeChangeInput) {
        return request('api/services/app/AuditLog/GetEntityTypeChanges', {
            method: 'GET',
            params: input,
        });
    }

    async getEntityChangesToExcel(input: GetEntityChangeInput) {
        return request('api/services/app/AuditLog/GetEntityChangesToExcel', {
            method: 'GET',
            params: input,
        });
    }

    async getEntityPropertyChanges(entityChangeId: number) {
        return request('api/services/app/AuditLog/GetEntityPropertyChanges', {
            method: 'GET',
            params: {
                entityChangeId,
            },
        });
    }
}
export default new AuditLogService();
