import api from './axios';
import type { ApiResponse, SystemSetting } from '../types/api.types';

export const settingsApi = {
    getAll: async (): Promise<SystemSetting[]> => {
        const response = await api.get<ApiResponse<SystemSetting[]>>('/settings');
        return response.data.data;
    },

    update: async (key: string, data: { key?: string; value: string }): Promise<SystemSetting> => {
        const response = await api.put<ApiResponse<SystemSetting>>(`/settings/${key}`, data);
        return response.data.data;
    },
};
