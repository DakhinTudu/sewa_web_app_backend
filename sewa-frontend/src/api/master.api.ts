import api from './axios';
import type { ApiResponse, MasterDataResponse } from '../types/api.types';

export const masterApi = {
    getAllMasterData: async (): Promise<MasterDataResponse> => {
        const response = await api.get<ApiResponse<MasterDataResponse>>('/master');
        return response.data.data;
    },
};
