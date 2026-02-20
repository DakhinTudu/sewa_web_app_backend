import api from './axios';
import type { ApiResponse, ElectedRepresentativeResponse } from '../types/api.types';

/** Payload for creating an elected representative (member id, role, term dates) */
export interface CreateRepresentativeRequest {
    member: { id: number };
    roleName: string;
    termStart: string; // ISO date YYYY-MM-DD
    termEnd: string;
    active?: boolean;
}

export const representativesApi = {
    getActive: async (): Promise<ElectedRepresentativeResponse[]> => {
        const response = await api.get<ApiResponse<ElectedRepresentativeResponse[]>>('/representatives/active');
        return response.data.data;
    },

    create: async (data: CreateRepresentativeRequest): Promise<ElectedRepresentativeResponse> => {
        const response = await api.post<ApiResponse<ElectedRepresentativeResponse>>('/representatives', {
            ...data,
            active: data.active ?? true,
        });
        return response.data.data;
    },
};
