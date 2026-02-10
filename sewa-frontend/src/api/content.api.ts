import api from './axios';
import type { ApiResponse, ContentResponse, Page } from '../types/api.types';

export const contentApi = {
    getAll: async (page = 0, size = 10): Promise<Page<ContentResponse>> => {
        const response = await api.get<ApiResponse<Page<ContentResponse>>>('/contents', {
            params: { page, size },
        });
        return response.data.data;
    },

    getById: async (id: number): Promise<ContentResponse> => {
        const response = await api.get<ApiResponse<ContentResponse>>(`/contents/${id}`);
        return response.data.data;
    },

    create: async (data: Partial<ContentResponse>): Promise<ContentResponse> => {
        const response = await api.post<ApiResponse<ContentResponse>>('/contents', data);
        return response.data.data;
    },

    update: async (id: number, data: Partial<ContentResponse>): Promise<ContentResponse> => {
        const response = await api.put<ApiResponse<ContentResponse>>(`/contents/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/contents/${id}`);
    },

    uploadFile: async (id: number, file: File): Promise<ContentResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ApiResponse<ContentResponse>>(`/contents/${id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },
};
