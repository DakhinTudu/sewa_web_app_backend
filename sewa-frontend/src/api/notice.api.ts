import api from './axios';
import type { ApiResponse, NoticeResponse } from '../types/api.types';

export interface NoticeRequest {
    title: string;
    content: string;
    expiresAt?: string;
    active?: boolean;
}

export const noticeApi = {
    getAll: async (): Promise<NoticeResponse[]> => {
        const response = await api.get<ApiResponse<NoticeResponse[]>>('/notices');
        return response.data.data;
    },

    create: async (data: NoticeRequest): Promise<NoticeResponse> => {
        const response = await api.post<ApiResponse<NoticeResponse>>('/notices', data);
        return response.data.data;
    },
};
