import api from './axios';
import type { ApiResponse } from '../types/api.types';

export interface AnnouncementResponse {
    id: number;
    title: string;
    content: string;
    createdByUserId: number;
    createdByUsername: string;
    createdAt: string;
    read: boolean;
}

export interface AnnouncementRequest {
    title: string;
    content: string;
}

export const announcementsApi = {
    list: async (): Promise<AnnouncementResponse[]> => {
        const response = await api.get<ApiResponse<AnnouncementResponse[]>>('/announcements');
        return response.data.data ?? [];
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<ApiResponse<{ unreadCount: number }>>('/announcements/unread-count');
        return response.data.data?.unreadCount ?? 0;
    },

    create: async (data: AnnouncementRequest): Promise<void> => {
        await api.post<ApiResponse<unknown>>('/announcements', data);
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/announcements/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch<ApiResponse<void>>('/announcements/read-all');
    },
};
