import api from './axios';
import type { ApiResponse, AdminDashboardStats } from '../types/api.types';

export const adminApi = {
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
        const response = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats');
        return response.data.data;
    },
};
