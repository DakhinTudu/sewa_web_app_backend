import api from './axios';
import type { ApiResponse, MemberResponse, Page } from '../types/api.types';

/** Optional request config: pass signal to cancel in-flight request when a new search is triggered. */
export interface MembersRequestConfig {
    signal?: AbortSignal;
}

export const membersApi = {
    getSelf: async (): Promise<MemberResponse> => {
        const response = await api.get<ApiResponse<MemberResponse>>('/members/self');
        return response.data.data;
    },

    updateSelf: async (data: Partial<MemberResponse>): Promise<MemberResponse> => {
        const response = await api.put<ApiResponse<MemberResponse>>('/members/self', data);
        return response.data.data;
    },

    /**
     * Paginated members list with optional filters. Pass signal (e.g. from React Query) to cancel
     * previous request when search/filters change. Pagination: page=0&size=15 unchanged.
     */
    getAllMembers: async (
        page = 0,
        size = 10,
        filters?: {
            query?: string;
            chapterId?: number;
            educationalLevel?: string;
            workingSector?: string;
            status?: string;
        },
        config?: MembersRequestConfig
    ): Promise<Page<MemberResponse>> => {
        const response = await api.get<ApiResponse<Page<MemberResponse>>>('/members', {
            params: { page, size, ...filters },
            signal: config?.signal,
        });
        return response.data.data;
    },

    getMemberById: async (id: number): Promise<MemberResponse> => {
        const response = await api.get<ApiResponse<MemberResponse>>(`/members/${id}`);
        return response.data.data;
    },

    getMemberByCode: async (code: string): Promise<MemberResponse> => {
        const response = await api.get<ApiResponse<MemberResponse>>(`/members/code/${code}`);
        return response.data.data;
    },

    getPendingMembers: async (page = 0, size = 10): Promise<Page<MemberResponse>> => {
        const response = await api.get<ApiResponse<Page<MemberResponse>>>('/members/pending', {
            params: { page, size }
        });
        return response.data.data;
    },

    updateMember: async (id: number, data: Partial<MemberResponse>): Promise<MemberResponse> => {
        const response = await api.put<ApiResponse<MemberResponse>>(`/members/${id}`, data);
        return response.data.data;
    },

    approveMember: async (id: number): Promise<MemberResponse> => {
        const response = await api.patch<ApiResponse<MemberResponse>>(`/members/${id}/approve`);
        return response.data.data;
    },

    rejectMember: async (id: number): Promise<MemberResponse> => {
        const response = await api.patch<ApiResponse<MemberResponse>>(`/members/${id}/reject`);
        return response.data.data;
    },

    deleteMember: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/members/${id}`);
    },

    getMembersByChapter: async (chapterId: number, page = 0, size = 10): Promise<Page<MemberResponse>> => {
        const response = await api.get<ApiResponse<Page<MemberResponse>>>(`/members/chapter/${chapterId}`, {
            params: { page, size },
        });
        return response.data.data;
    },

    getActiveMembersByChapter: async (chapterId: number, page = 0, size = 10): Promise<Page<MemberResponse>> => {
        const response = await api.get<ApiResponse<Page<MemberResponse>>>(`/members/chapter/${chapterId}/active`, {
            params: { page, size },
        });
        return response.data.data;
    },
};
