import api from './axios';
import type { ApiResponse, AuditLogResponse, Page } from '../types/api.types';

export const auditApi = {
    getAll: async (page = 0, size = 10): Promise<Page<AuditLogResponse>> => {
        const response = await api.get<ApiResponse<Page<AuditLogResponse>>>('/audit-logs', {
            params: { page, size },
        });
        return response.data.data;
    },
};
