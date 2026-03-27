import api from './axios';
import type { ApiResponse, MembershipFeeResponse, Page } from '../types/api.types';

export interface FeeRequest {
    memberId?: number;
    membershipCode?: string;
    financialYear: string;
    amount: number;
    feeDate?: string;
    paymentDate?: string;
    status?: string;
    receiptNumber?: string;
    transactionId?: string;
    remarks?: string;
    paymentMethod?: string;
    screenshotUrl?: string;
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

    /** Pass signal to cancel previous in-flight request when search changes. */
    getAllFees: async (
        page = 0,
        size = 20,
        query?: string,
        status?: string,
        year?: string,
        config?: { signal?: AbortSignal }
    ): Promise<Page<MembershipFeeResponse>> => {
        const response = await api.get<ApiResponse<Page<MembershipFeeResponse>>>('/fees', {
            params: { page, size, query, status, year },
            signal: config?.signal,
        });
        return response.data.data;
    },

    addFee: async (data: FeeRequest): Promise<MembershipFeeResponse> => {
        const response = await api.post<ApiResponse<MembershipFeeResponse>>('/fees', data);
        return response.data.data;
    },

    submitPayment: async (data: FeeRequest): Promise<MembershipFeeResponse> => {
        const response = await api.post<ApiResponse<MembershipFeeResponse>>('/fees/submit', data);
        return response.data.data;
    },

    getPendingPayments: async (page = 0, size = 20): Promise<Page<MembershipFeeResponse>> => {
        const response = await api.get<ApiResponse<Page<MembershipFeeResponse>>>('/fees/pending', {
            params: { page, size }
        });
        return response.data.data;
    },

    approvePayment: async (id: number): Promise<MembershipFeeResponse> => {
        const response = await api.post<ApiResponse<MembershipFeeResponse>>(`/fees/${id}/approve`);
        return response.data.data;
    },

    rejectPayment: async (id: number, reason: string): Promise<MembershipFeeResponse> => {
        const response = await api.post<ApiResponse<MembershipFeeResponse>>(`/fees/${id}/reject`, null, {
            params: { reason }
        });
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
