import api from './axios';
import type { ApiResponse, StudentResponse, Page } from '../types/api.types';

export const studentsApi = {
    getAllStudents: async (page = 0, size = 10): Promise<Page<StudentResponse>> => {
        const response = await api.get<ApiResponse<Page<StudentResponse>>>('/students', {
            params: { page, size },
        });
        return response.data.data;
    },

    getPendingStudents: async (page = 0, size = 10): Promise<Page<StudentResponse>> => {
        const response = await api.get<ApiResponse<Page<StudentResponse>>>('/students/pending', {
            params: { page, size },
        });
        return response.data.data;
    },

    getStudentById: async (id: number): Promise<StudentResponse> => {
        const response = await api.get<ApiResponse<StudentResponse>>(`/students/${id}`);
        return response.data.data;
    },

    updateStudent: async (id: number, data: Partial<StudentResponse>): Promise<StudentResponse> => {
        const response = await api.put<ApiResponse<StudentResponse>>(`/students/${id}`, data);
        return response.data.data;
    },

    approveStudent: async (id: number): Promise<StudentResponse> => {
        const response = await api.patch<ApiResponse<StudentResponse>>(`/students/${id}/approve`);
        return response.data.data;
    },

    rejectStudent: async (id: number): Promise<StudentResponse> => {
        const response = await api.patch<ApiResponse<StudentResponse>>(`/students/${id}/reject`);
        return response.data.data;
    },

    deleteStudent: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/students/${id}`);
    }
};
