import api from './axios';
import type { ApiResponse, CalendarEventResponse } from '../types/api.types';

export const calendarApi = {
    getEvents: async (): Promise<CalendarEventResponse[]> => {
        const response = await api.get<ApiResponse<CalendarEventResponse[]>>('/calendar/events');
        return response.data.data;
    },

    getChapterEvents: async (chapterId: number): Promise<CalendarEventResponse[]> => {
        const response = await api.get<ApiResponse<CalendarEventResponse[]>>(`/calendar/chapter/${chapterId}`);
        return response.data.data;
    },

    createEvent: async (data: Partial<CalendarEventResponse>): Promise<CalendarEventResponse> => {
        const response = await api.post<ApiResponse<CalendarEventResponse>>('/calendar', data);
        return response.data.data;
    },

    updateEvent: async (id: number, data: Partial<CalendarEventResponse>): Promise<CalendarEventResponse> => {
        const response = await api.put<ApiResponse<CalendarEventResponse>>(`/calendar/${id}`, data);
        return response.data.data;
    },

    deleteEvent: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/calendar/${id}`);
    },
};
