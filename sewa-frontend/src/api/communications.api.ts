import api from './axios';
import type { ApiResponse } from '../types/api.types';

export const BASE_ALL = 'ALL';
export const BASE_BY_CHAPTER = 'BY_CHAPTER';
export const BASE_BY_PAYMENT_STATUS = 'BY_PAYMENT_STATUS';
export const BASE_MANUAL = 'MANUAL';
export const PAYMENT_UNPAID_CURRENT_YEAR = 'UNPAID_CURRENT_YEAR';

export interface CommunicationRecipientRequest {
    baseType: string;
    chapterIds?: number[];
    paymentFilter?: string;
    memberIds?: number[];
    includeMemberIds?: number[];
    excludeMemberIds?: number[];
}

export interface CommunicationPreviewResponse {
    recipientCount: number;
    sampleEmails: string[];
}

export interface SendCommunicationRequest {
    subject: string;
    body: string;
    recipientSelection: CommunicationRecipientRequest;
}

export interface CommunicationLogResponse {
    id: number;
    sentByUserId: number;
    subject: string;
    recipientCount: number;
    criteriaSummary: string;
    sentAt: string;
}

export interface CommunicationReceivedResponse {
    id: number;
    subject: string;
    sentAt: string;
    read: boolean;
}

export const communicationsApi = {
    preview: async (selection: CommunicationRecipientRequest): Promise<CommunicationPreviewResponse> => {
        const response = await api.post<ApiResponse<CommunicationPreviewResponse>>('/communications/preview', selection);
        return response.data.data;
    },

    send: async (payload: SendCommunicationRequest): Promise<void> => {
        await api.post<ApiResponse<void>>('/communications/send', payload);
    },

    getHistory: async (): Promise<CommunicationLogResponse[]> => {
        const response = await api.get<ApiResponse<CommunicationLogResponse[]>>('/communications/history');
        return response.data.data ?? [];
    },

    getReceivedByMe: async (): Promise<CommunicationReceivedResponse[]> => {
        const response = await api.get<ApiResponse<CommunicationReceivedResponse[]>>('/communications/received-by-me');
        return response.data.data ?? [];
    },

    getReceivedUnreadCount: async (): Promise<number> => {
        const response = await api.get<ApiResponse<{ unreadCount: number }>>('/communications/received-by-me/unread-count');
        return response.data.data?.unreadCount ?? 0;
    },

    markReceivedAsRead: async (recipientId: number): Promise<void> => {
        await api.patch<ApiResponse<void>>(`/communications/received-by-me/${recipientId}/read`);
    },
};
