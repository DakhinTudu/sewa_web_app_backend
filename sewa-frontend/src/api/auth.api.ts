import api from './axios';
import type { ApiResponse, AuthResponse } from '../types/api.types';

type LoginRequest = { username: string; password: string };

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        return response.data.data;
    },

    register: async (data: Record<string, unknown>): Promise<string> => {
        const response = await api.post<ApiResponse<string>>('/auth/register', data);
        return response.data.data;
    },

    me: async (): Promise<AuthResponse> => {
        const response = await api.get<ApiResponse<AuthResponse>>('/auth/me');
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        const token = localStorage.getItem('token');
        if (token) {
            await api.post<ApiResponse<void>>('/auth/logout', null, {
                headers: { Authorization: token },
            });
        }
    },

    forgotPassword: async (email: string): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/forgot-password', null, { params: { email } });
    },

    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/reset-password', null, {
            params: { token, newPassword },
        });
    },
};
