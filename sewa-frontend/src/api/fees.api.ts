import api from './axios';
import type { ApiResponse, MembershipFeeResponse } from '../types/api.types';

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

    addFee: async (data: FeeRequest): Promise<MembershipFeeResponse> => {
        const response = await api.post<ApiResponse<MembershipFeeResponse>>('/fees', data);
        return response.data.data;
    },
};
