import api from './axios';
import type { ApiResponse, AuthResponse } from '../types/api.types';

type LoginRequest = { login?: string; username?: string; password: string };

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const loginValue = String(data.login ?? data.username ?? '').trim();
        const passwordValue = String(data.password ?? '').trim();
        const body = {
            login: loginValue,
            username: loginValue,
            password: passwordValue,
        };
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', body);
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

    forgotPassword: async (email: string): Promise<{ email: string }> => {
        const response = await api.post<ApiResponse<{ email: string }>>('/auth/forgot-password', null, {
            params: { email },
        });
        return response.data.data ?? { email };
    },

    validateOtp: async (data: { email: string; otp: string }): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/validate-otp', data);
    },

    resetPassword: async (data: { email: string; otp: string; newPassword: string }): Promise<void> => {
        await api.post<ApiResponse<void>>('/auth/reset-password', data);
    },
};
