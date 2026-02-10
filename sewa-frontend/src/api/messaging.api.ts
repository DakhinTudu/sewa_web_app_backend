import api from './axios';
import type { ApiResponse, MessageResponse } from '../types/api.types';

export interface MessageRequest {
    subject: string;
    content: string;
    recipientUsername: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH';
}

export const messagingApi = {
    getAll: async (): Promise<MessageResponse[]> => {
        const response = await api.get<ApiResponse<MessageResponse[]>>('/messages');
        return response.data.data;
    },

    send: async (data: MessageRequest): Promise<MessageResponse> => {
        const response = await api.post<ApiResponse<MessageResponse>>('/messages', data);
        return response.data.data;
    },
};
