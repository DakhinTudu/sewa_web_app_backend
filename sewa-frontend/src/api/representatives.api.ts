import api from './axios';
import type { ApiResponse, ElectedRepresentativeResponse } from '../types/api.types';

export const representativesApi = {
    getActive: async (): Promise<ElectedRepresentativeResponse[]> => {
        const response = await api.get<ApiResponse<ElectedRepresentativeResponse[]>>('/representatives/active');
        return response.data.data;
    },

    create: async (data: Partial<ElectedRepresentativeResponse>): Promise<ElectedRepresentativeResponse> => {
        const response = await api.post<ApiResponse<ElectedRepresentativeResponse>>('/representatives', data);
        return response.data.data;
    },
};
