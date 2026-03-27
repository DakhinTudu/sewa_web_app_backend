import api from './axios';
import type { ApiResponse } from '../types/api.types';

export interface ContactRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactApi = {
    send: async (payload: ContactRequest): Promise<void> => {
        await api.post<ApiResponse<unknown>>('/contact', payload);
    },
};
