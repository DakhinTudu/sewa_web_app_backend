import api from './axios';
import type { ApiResponse } from '../types/api.types';

export interface DropdownItem {
    label: string;
    value: string;
}

/** Backend returns DropdownResponse with key/value; we normalize to label/value */
async function fetchDropdown(path: string): Promise<DropdownItem[]> {
    const response = await api.get<ApiResponse<{ key: string; value: string }[]>>(path);
    const raw = response.data.data;
    return (Array.isArray(raw) ? raw : []).map((item: { key?: string; value?: string }) => ({
        label: item.value ?? item.key ?? '',
        value: item.key ?? item.value ?? '',
    }));
}

export const dropdownsApi = {
    getRoles: () => fetchDropdown('/dropdowns/roles'),
    getPermissions: () => fetchDropdown('/dropdowns/permissions'),
    getMemberStatus: () => fetchDropdown('/dropdowns/member-status'),
    getStudentStatus: () => fetchDropdown('/dropdowns/student-status'),
    getChapterTypes: () => fetchDropdown('/dropdowns/chapter-types'),
    getContentTypes: () => fetchDropdown('/dropdowns/content-types'),
    getVisibilityTypes: () => fetchDropdown('/dropdowns/visibility-types'),
    getCalendarEventTypes: () => fetchDropdown('/dropdowns/calendar-event-types'),
    getDesignations: () => fetchDropdown('/dropdowns/designations'),
    getPaymentStatus: () => fetchDropdown('/dropdowns/payment-status'),
    getGenders: () => fetchDropdown('/dropdowns/genders'),
    getFinancialYears: () => fetchDropdown('/dropdowns/financial-years'),
    getChapters: () => fetchDropdown('/dropdowns/chapters'),
};
