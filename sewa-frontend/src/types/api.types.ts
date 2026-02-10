export interface User {
    username: string;
    roles: string[];
    permissions: string[];
}

export interface AuthResponse {
    token: string;
    username: string;
    roles: string[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pageable?: any; // You might want to type this properly if backend sends Page implementation details here
    status?: number; // HTTP status code or custom status
    timestamp: string;
}

export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export const MembershipStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
} as const;

export type MembershipStatus = typeof MembershipStatus[keyof typeof MembershipStatus];

export interface MemberResponse {
    id: number;
    username: string;
    email: string;
    membershipCode: string;
    fullName: string;
    phone: string;
    address: string;
    designation: string;
    membershipStatus: MembershipStatus;
    joinedDate: string; // LocalDate
    organization: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    college: string;
    university: string;
    graduationYear: number;
    createdAt: string; // LocalDateTime
    updatedAt: string; // LocalDateTime
}

export interface StudentResponse {
    id: number;
    username: string;
    email: string;
    fullName: string;
    membershipCode: string;
    institute: string;
    course: string;
    phone: string;
    status: MembershipStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ChapterResponse {
    id: number;
    chapterName: string;
    location: string;
    chapterType: 'NATIONAL' | 'STATE' | 'LOCAL';
    createdAt: string;
    updatedAt: string;
}

export interface ContentResponse {
    id: number;
    contentType: 'NOTICE' | 'EVENT' | 'NEWS' | 'PUBLICATION';
    title: string;
    description: string;
    visibility: 'PUBLIC' | 'MEMBERS_ONLY';
    eventDate: string;
    authorName: string;
    published: boolean;
    fileUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MembershipFeeResponse {
    id: number;
    membershipCode: string;
    financialYear: string;
    amount: number;
    paymentDate: string;
    paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
    receiptNumber: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
}

export interface InternalMessageResponse {
    id: number;
    subject: string;
    content: string;
    senderUsername: string;
    recipientUsername: string; // For individual messages
    priority: 'LOW' | 'NORMAL' | 'HIGH';
    read: boolean;
    sentAt: string;
    // attachments: AttachmentResponse[]; // TODO: Add attachment support later
}

/** Alias for message API */
export type MessageResponse = InternalMessageResponse;

export interface CalendarEventResponse {
    id: number;
    title: string;
    description?: string;
    eventDate: string;
    eventType?: string;
    chapterId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface NoticeResponse {
    id: number;
    title: string;
    description?: string;
    published: boolean;
    authorName?: string;
    createdAt: string;
    updatedAt: string;
}

/** Admin dashboard stats from GET /admin/dashboard/stats */
export interface AdminDashboardStats {
    totalUsers: number;
    totalMembers: number;
    totalStudents: number;
}

export interface ElectedRepresentativeResponse {
    id: number;
    member: MemberResponse;
    roleName: string;
    termStart: string; // LocalDate
    termEnd: string; // LocalDate
    active: boolean;
}

export interface SystemSetting {
    key: string;
    value: string;
    updatedAt: string;
}

export interface AuditLogResponse {
    id: number;
    user: {
        username: string;
        fullName?: string;
    };
    action: string;
    entity: string;
    entityId: number;
    createdAt: string;
}
