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
};
