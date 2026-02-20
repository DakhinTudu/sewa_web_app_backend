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
    ACTIVE: 'ACTIVE',
    REJECTED: 'REJECTED',
    INACTIVE: 'INACTIVE'
} as const;

export type MembershipStatus = typeof MembershipStatus[keyof typeof MembershipStatus];

export const EducationalLevel = {
    DIPLOMA: 'DIPLOMA',
    BACHELORS: 'BACHELORS',
    MASTERS: 'MASTERS',
    PHD: 'PHD',
    OTHER: 'OTHER'
} as const;
export type EducationalLevel = typeof EducationalLevel[keyof typeof EducationalLevel];

export const WorkingSector = {
    GOVERNMENT: 'GOVERNMENT',
    PRIVATE: 'PRIVATE',
    PSU: 'PSU',
    SELF_EMPLOYED: 'SELF_EMPLOYED',
    RETIRED: 'RETIRED',
    OTHER: 'OTHER'
} as const;
export type WorkingSector = typeof WorkingSector[keyof typeof WorkingSector];

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
    gender: string;
    college: string;
    university: string;
    graduationYear: number;
    chapterId?: number;
    chapterName?: string;
    educationalLevel?: string;
    workingSector?: string;
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
    educationalLevel?: string;
    status: MembershipStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ChapterResponse {
    id: number;
    chapterName: string;
    location: string;
    chapterType: 'NATIONAL' | 'STATE' | 'LOCAL';
    totalMembers?: number;
    representatives?: {
        memberName: string;
        membershipCode: string;
        role: string;
    }[];
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
    memberName?: string;
    membershipCode: string;
    financialYear: string;
    amount: number;
    paymentDate: string;
    paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED';
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
    content: string;
    authorName?: string;
    active?: boolean;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

/** Admin dashboard stats from GET /admin/dashboard/stats */
export interface AdminDashboardStats {
    totalUsers: number;
    totalMembers: number;
    totalStudents: number;
    totalChapters: number;
    membersByChapter: Record<string, number>;
    studentsByChapter: Record<string, number>;
    membersByEducationalLevel: Record<string, number>;
    membersByWorkingSector: Record<string, number>;
    studentsByEducationalLevel: Record<string, number>;
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

export interface MasterItem {
    id: number;
    name: string;
    description?: string;
    active: boolean;
}

export interface MasterDataResponse {
    educationalLevels: MasterItem[];
    workingSectors: MasterItem[];
    genders: MasterItem[];
}
