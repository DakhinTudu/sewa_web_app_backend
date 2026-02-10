import api from './axios';
import type { ApiResponse, ChapterResponse, Page } from '../types/api.types';

export const chaptersApi = {
    // Get all chapters with pagination
    getAll: async (page = 0, size = 10): Promise<Page<ChapterResponse>> => {
        const response = await api.get<ApiResponse<Page<ChapterResponse>>>('/chapters', {
            params: { page, size },
        });
        return response.data.data;
    },

    // Alias for backward compatibility - returns array instead of Page
    getAllChapters: async (): Promise<ChapterResponse[]> => {
        const response = await api.get<ApiResponse<Page<ChapterResponse>>>('/chapters', {
            params: { page: 0, size: 1000 },
        });
        return response.data.data.content ?? [];
    },

    getChapterById: async (id: number): Promise<ChapterResponse> => {
        const response = await api.get<ApiResponse<ChapterResponse>>(`/chapters/${id}`);
        return response.data.data;
    },

    createChapter: async (data: Partial<ChapterResponse>): Promise<ChapterResponse> => {
        const response = await api.post<ApiResponse<ChapterResponse>>('/chapters', data);
        return response.data.data;
    },

    activateChapter: async (id: number): Promise<ChapterResponse> => {
        const response = await api.patch<ApiResponse<ChapterResponse>>(`/chapters/${id}/activate`);
        return response.data.data;
    },

    // Member Assignment
    assignMember: async (chapterId: number, memberId: number, role: string): Promise<void> => {
        await api.post<ApiResponse<void>>(`/chapters/${chapterId}/members/${memberId}?role=${role}`);
    },

    removeMember: async (chapterId: number, memberId: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/chapters/${chapterId}/members/${memberId}`);
    },

    updateMemberRole: async (chapterId: number, memberId: number, role: string): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/chapters/${chapterId}/members/${memberId}/role`, null, {
            params: { role },
        });
    },

    updateChapter: async (id: number, data: Partial<ChapterResponse>): Promise<ChapterResponse> => {
        const response = await api.put<ApiResponse<ChapterResponse>>(`/chapters/${id}`, data);
        return response.data.data;
    },

    deleteChapter: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/chapters/${id}`);
    },
};
