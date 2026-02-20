import api from './axios';
import type { ApiResponse, MembershipFeeResponse, Page } from '../types/api.types';

export interface FeeRequest {
    membershipCode: string;
    financialYear: string;
    amount: number;
    paymentDate?: string;
    paymentStatus?: string;
    receiptNumber?: string;
    remarks?: string;
}

export const feesApi = {
    getByMemberId: async (memberId: number): Promise<MembershipFeeResponse[]> => {
        const response = await api.get<ApiResponse<MembershipFeeResponse[]>>(`/fees/member/${memberId}`);
        return response.data.data;
    },

    getByCode: async (code: string): Promise<MembershipFeeResponse[]> => {
        const response = await api.get<ApiResponse<MembershipFeeResponse[]>>(`/fees/code/${code}`);
        return response.data.data;
    },

    getAllFees: async (page = 0, size = 20, query?: string, status?: string, year?: string): Promise<Page<MembershipFeeResponse>> => {
        const response = await api.get<ApiResponse<Page<MembershipFeeResponse>>>('/fees', {
            params: { page, size, query, status, year },
        });
        return response.data.data;
    },

    addFee: async (data: FeeRequest): Promise<MembershipFeeResponse> => {
        const response = await api.post<ApiResponse<MembershipFeeResponse>>('/fees', data);
        return response.data.data;
    },

    updateFee: async (id: number, data: Partial<FeeRequest>): Promise<MembershipFeeResponse> => {
        const response = await api.put<ApiResponse<MembershipFeeResponse>>(`/fees/${id}`, data);
        return response.data.data;
    },

    deleteFee: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/fees/${id}`);
    },
};
