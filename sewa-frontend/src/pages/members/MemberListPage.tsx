import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../../api/members.api';
import { authApi } from '../../api/auth.api';
import { Table } from '../../components/tables/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import type { MemberResponse, ChapterResponse, MasterDataResponse } from '../../types/api.types';
import { MembershipStatus } from '../../types/api.types';
import { masterApi } from '../../api/master.api';
import { chaptersApi } from '../../api/chapters.api';
import { MagnifyingGlassIcon, EyeIcon, EllipsisVerticalIcon, CheckIcon, NoSymbolIcon, PencilSquareIcon, FunnelIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../../components/ui/Dropdown';
import { StatusBadge } from '../../components/ui/StatusBadge';


export default function MemberListPage() {
    const [page, setPage] = useState(0);
    const [addOpen, setAddOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [viewId, setViewId] = useState<number | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);

    // Current filter states (what's actually applied to the query)
    const [appliedFilters, setAppliedFilters] = useState({
        query: '',
        chapterId: '' as number | '',
        educationalLevel: '',
        workingSector: '',
        status: '' as MembershipStatus | '',
    });

    // Temporary filter states (what's in the inputs)
    const [tempFilters, setTempFilters] = useState({
        query: '',
        chapterId: '' as number | '',
        educationalLevel: '',
        workingSector: '',
        status: '' as MembershipStatus | '',
    });

    const pageSize = 10;
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: chapters } = useQuery({
        queryKey: ['chapters-list'],
        queryFn: chaptersApi.getAllChapters,
    });

    const { data: masterData } = useQuery({
        queryKey: ['master-data'],
        queryFn: masterApi.getAllMasterData,
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['members', page, appliedFilters],
        queryFn: () => membersApi.getAllMembers(page, pageSize, {
            query: appliedFilters.query || undefined,
            chapterId: appliedFilters.chapterId || undefined,
            educationalLevel: appliedFilters.educationalLevel || undefined,
            workingSector: appliedFilters.workingSector || undefined,
            status: appliedFilters.status || undefined,
        }),
    });

    const approveMutation = useMutation({
        mutationFn: membersApi.approveMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            toast.success('Member approved successfully.');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Approval failed.');
        }
    });

    const rejectMutation = useMutation({
        mutationFn: membersApi.rejectMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            toast.success('Member rejected.');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Rejection failed.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: membersApi.deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            toast.success('Member deleted successfully.');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Deletion failed.');
        }
    });

    const applyFilters = () => {
        setAppliedFilters(tempFilters);
        setPage(0);
    };

    const resetFilters = () => {
        const defaultFilters = {
            query: '',
            chapterId: '' as number | '',
            educationalLevel: '',
            workingSector: '',
            status: '' as MembershipStatus | '',
        };
        setTempFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setPage(0);
    };

    const columns = [
        {
            header: 'Name',
            className: 'w-full min-w-[140px] px-4',
            accessor: (row: MemberResponse) => (
                <span className="font-medium text-secondary-900 line-clamp-1">{row.fullName}</span>
            ),
        },
        {
            header: 'Chapter',
            className: 'hidden md:table-cell',
            accessor: (row: MemberResponse) => (
                <span className="text-secondary-700">{row.chapterName || '—'}</span>
            ),
        },
        {
            header: 'Position',
            className: 'hidden md:table-cell',
            accessor: (row: MemberResponse) => (
                <span className="text-secondary-600 text-sm whitespace-nowrap">{row.designation || '—'}</span>
            ),
        },
        {
            header: 'Status',
            className: 'w-0 px-2 sm:px-3 text-center',
            accessor: (row: MemberResponse) => (
                <div className="flex justify-center">
                    <StatusBadge status={row.membershipStatus} showLabel={false} />
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'w-0 px-2 sm:px-3 text-right',
            accessor: (row: MemberResponse) => {
                const actionItems: { label: string; icon: any; onClick: () => void; variant?: 'default' | 'danger' }[] = [
                    {
                        label: 'View details',
                        icon: <EyeIcon className="h-4 w-4" />,
                        onClick: () => setViewId(row.id),
                    },
                    {
                        label: 'Edit member',
                        icon: <PencilSquareIcon className="h-4 w-4" />,
                        onClick: () => setEditId(row.id),
                    },
                ];

                if (row.membershipStatus === MembershipStatus.PENDING) {
                    actionItems.push(
                        {
                            label: 'Approve',
                            icon: <CheckIcon className="h-4 w-4" />,
                            onClick: () => approveMutation.mutate(row.id),
                        },
                        {
                            label: 'Reject',
                            icon: <NoSymbolIcon className="h-4 w-4" />,
                            onClick: () => rejectMutation.mutate(row.id),
                            variant: 'danger',
                        }
                    );
                }

                actionItems.push({
                    label: 'Delete',
                    icon: <TrashIcon className="h-4 w-4" />,
                    onClick: () => {
                        if (window.confirm('Are you certain you want to delete this member record? This action cannot be undone.')) {
                            deleteMutation.mutate(row.id);
                        }
                    },
                    variant: 'danger',
                });

                return (
                    <div className="flex justify-center md:justify-end">
                        <Dropdown
                            minimal
                            icon={<EllipsisVerticalIcon className="h-5 w-5" />}
                            items={actionItems}
                        />
                    </div>
                );
            },
        },
    ];

    const totalPages = data?.totalPages ?? 0;
    const content = data?.content ?? [];

    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700 shadow-sm border border-red-100">Error loading members. Please try again.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Members</h1>
                    <p className="mt-1 text-sm text-secondary-600">
                        Manage association membership and pending registrations.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 sm:flex-none md:hidden" onClick={() => setFilterOpen(true)} leftIcon={<FunnelIcon className="h-4 w-4" />}>
                        Filters
                    </Button>
                    <Button onClick={() => setAddOpen(true)} className="hidden md:flex shadow-md" leftIcon={<PlusIcon className="h-5 w-5" />}>
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="fixed bottom-6 right-6 z-50 md:hidden">
                <Button
                    onClick={() => setAddOpen(true)}
                    className="h-14 w-14 rounded-full shadow-2xl p-0 flex items-center justify-center transition-transform active:scale-90"
                >
                    <PlusIcon className="h-8 w-8 text-white" />
                </Button>
            </div>

            {/* Quick Search on Desktop / Main View */}
            <div className="hidden md:block">
                <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-secondary-200">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 text-secondary-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search name, code, phone..."
                                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                value={tempFilters.query}
                                onChange={(e) => setTempFilters({ ...tempFilters, query: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>

                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.chapterId}
                            onChange={(e) => setTempFilters({ ...tempFilters, chapterId: e.target.value ? Number(e.target.value) : '' })}
                        >
                            <option value="">All Chapters</option>
                            {chapters?.map((c) => (
                                <option key={c.id} value={c.id}>{c.chapterName}</option>
                            ))}
                        </select>

                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.educationalLevel}
                            onChange={(e) => setTempFilters({ ...tempFilters, educationalLevel: e.target.value })}
                        >
                            <option value="">All Education</option>
                            {masterData?.educationalLevels?.map((lv) => (
                                <option key={lv.id} value={lv.name}>{lv.name}</option>
                            ))}
                        </select>

                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.workingSector}
                            onChange={(e) => setTempFilters({ ...tempFilters, workingSector: e.target.value })}
                        >
                            <option value="">All Sectors</option>
                            {masterData?.workingSectors?.map((s) => (
                                <option key={s.id} value={s.name}>{s.name.replace('_', ' ')}</option>
                            ))}
                        </select>

                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.status}
                            onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value as MembershipStatus | '' })}
                        >
                            <option value="">All Status</option>
                            {Object.values(MembershipStatus).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2 border-t border-secondary-100 pt-4">
                        <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
                        <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
                    </div>
                </div>
            </div>

            {/* Filter Modal for Mobile */}
            <Modal isOpen={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Members">
                <div className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Search</label>
                        <Input
                            placeholder="Name, code, phone..."
                            value={tempFilters.query}
                            onChange={(e) => setTempFilters({ ...tempFilters, query: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Chapter</label>
                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.chapterId}
                            onChange={(e) => setTempFilters({ ...tempFilters, chapterId: e.target.value ? Number(e.target.value) : '' })}
                        >
                            <option value="">All Chapters</option>
                            {chapters?.map((c) => (
                                <option key={c.id} value={c.id}>{c.chapterName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.status}
                            onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value as MembershipStatus | '' })}
                        >
                            <option value="">All Status</option>
                            {Object.values(MembershipStatus).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" className="flex-1" onClick={() => { resetFilters(); setFilterOpen(false); }}>Reset</Button>
                        <Button className="flex-1" onClick={() => { applyFilters(); setFilterOpen(false); }}>Show Results</Button>
                    </div>
                </div>
            </Modal>

            <div className="bg-white shadow-sm ring-1 ring-secondary-200 rounded-xl">
                <Table
                    data={content}
                    columns={columns}
                    keyExtractor={(row) => String(row.id)}
                    isLoading={isLoading}
                />
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-secondary-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-secondary-700">
                                Page <span className="font-medium">{page + 1}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 0}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="rounded-l-md rounded-r-none"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-r-md rounded-l-none border-l-0"
                                >
                                    Next
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {addOpen && (
                <AddMemberModal
                    onClose={() => setAddOpen(false)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['members'] });
                        setAddOpen(false);
                        toast.success('Member registration submitted. Pending approval.');
                    }}
                    toast={toast}
                    chapters={chapters ?? []}
                    masterData={masterData}
                />
            )}
            {editId != null && (
                <EditMemberModal
                    id={editId}
                    onClose={() => setEditId(null)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['members'] });
                        setEditId(null);
                        toast.success('Member updated.');
                    }}
                    toast={toast}
                    chapters={chapters ?? []}
                    masterData={masterData}
                />
            )}
            {viewId != null && (
                <MemberDetailModal
                    id={viewId}
                    onClose={() => setViewId(null)}
                    onEdit={() => { setViewId(null); setEditId(viewId); }}
                />
            )}
        </div>
    );
}

function MemberDetailModal({
    id,
    onClose,
    onEdit,
}: {
    id: number;
    onClose: () => void;
    onEdit: () => void;
}) {
    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: () => membersApi.getMemberById(id),
    });

    return (
        <Modal isOpen onClose={onClose} title="Member details" maxWidth="2xl">
            {isLoading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : member ? (
                <>
                    <div className="overflow-y-auto flex-1 space-y-6 py-2 -mx-4 px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Full name</p>
                                <p className="text-secondary-900 font-medium">{member.fullName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Membership code</p>
                                <p className="font-mono text-secondary-900">{member.membershipCode || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Email</p>
                                <p className="text-secondary-900">{member.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Phone</p>
                                <p className="text-secondary-900">{member.phone || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Status</p>
                                <StatusBadge status={member.membershipStatus} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Chapter</p>
                                <p className="text-secondary-900">{member.chapterName || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Designation</p>
                                <p className="text-secondary-900">{member.designation || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Organization</p>
                                <p className="text-secondary-900">{member.organization || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Educational level</p>
                                <p className="text-secondary-900">{member.educationalLevel ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Working sector</p>
                                <p className="text-secondary-900">{member.workingSector ? member.workingSector.replace('_', ' ') : '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Gender</p>
                                <p className="text-secondary-900">{member.gender ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">College / University</p>
                                <p className="text-secondary-900">{[member.college, member.university].filter(Boolean).join(' / ') || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Graduation year</p>
                                <p className="text-secondary-900">{member.graduationYear ?? '—'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs font-medium text-secondary-500 uppercase">Address</p>
                                <p className="text-secondary-900">{member.address || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-secondary-500 uppercase">Joined date</p>
                                <p className="text-secondary-900">{member.joinedDate ?? '—'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4 border-t border-secondary-200 mt-4">
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>
                        <Button onClick={onEdit} className="w-full sm:w-auto">Edit</Button>
                    </div>
                </>
            ) : (
                <p className="text-secondary-500 py-4">Member not found.</p>
            )}
        </Modal>
    );
}

function AddMemberModal({
    onClose,
    onSuccess,
    toast,
    chapters,
    masterData,
}: {
    onClose: () => void;
    onSuccess: () => void;
    toast: any;
    chapters: ChapterResponse[];
    masterData?: MasterDataResponse;
}) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        chapterId: '',
        educationalLevel: '',
        workingSector: '',
        gender: '',
    });

    // Chrome 80+ ignores autoComplete="off". The ONLY reliable fix:
    // start inputs as readOnly, then remove readOnly on first user focus.
    const [readOnly, setReadOnly] = useState(true);
    const removeReadOnly = () => setReadOnly(false);

    const inputClass = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
    const selectClass = "block w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    const registerMutation = useMutation({
        mutationFn: () =>
            authApi.register({
                ...formData,
                chapterId: formData.chapterId ? Number(formData.chapterId) : undefined,
                memberType: 'MEMBER',
            }),
        onSuccess,
        onError: (err: any) => toast.error(err.response?.data?.message ?? 'Registration failed.'),
    });

    return (
        <Modal isOpen onClose={onClose} title="Register New Member">
            <form onSubmit={(e) => { e.preventDefault(); registerMutation.mutate(); }}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className={labelClass}>Full Name *</label>
                            <input
                                className={inputClass}
                                type="text"
                                readOnly={readOnly}
                                onFocus={removeReadOnly}
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Email *</label>
                            <input
                                className={inputClass}
                                type="text"
                                readOnly={readOnly}
                                onFocus={removeReadOnly}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="Enter email"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Username *</label>
                            <input
                                className={inputClass}
                                type="text"
                                readOnly={readOnly}
                                onFocus={removeReadOnly}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Password *</label>
                            <input
                                className={inputClass}
                                type={readOnly ? 'text' : 'password'}
                                readOnly={readOnly}
                                onFocus={removeReadOnly}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Set a password"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Chapter</label>
                            <select className={selectClass} value={formData.chapterId}
                                onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}>
                                <option value="">Select Chapter</option>
                                {chapters.map(c => <option key={c.id} value={c.id}>{c.chapterName}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Educational Level</label>
                            <select className={selectClass} value={formData.educationalLevel}
                                onChange={(e) => setFormData({ ...formData, educationalLevel: e.target.value })}>
                                <option value="">Select Level</option>
                                {masterData?.educationalLevels?.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Working Sector</label>
                            <select className={selectClass} value={formData.workingSector}
                                onChange={(e) => setFormData({ ...formData, workingSector: e.target.value })}>
                                <option value="">Select Sector</option>
                                {masterData?.workingSectors?.map(v => <option key={v.id} value={v.name}>{v.name.replace('_', ' ')}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Gender</label>
                            <select className={selectClass} value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="">Select Gender</option>
                                {masterData?.genders?.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>

                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                        <Button type="submit" isLoading={registerMutation.isPending} className="w-full sm:w-auto">Register Member</Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

function EditMemberModal({
    id,
    onClose,
    onSuccess,
    toast,
    chapters: _chapters,
    masterData,
}: {
    id: number;
    onClose: () => void;
    onSuccess: () => void;
    toast: any;
    chapters: ChapterResponse[];
    masterData?: MasterDataResponse;
}) {
    const [formData, setFormData] = useState<Partial<MemberResponse>>({});

    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: () => membersApi.getMemberById(id),
    });

    const updateMutation = useMutation({
        mutationFn: () => membersApi.updateMember(id, formData),
        onSuccess,
        onError: (err: any) => toast.error(err.response?.data?.message ?? 'Update failed.'),
    });

    useEffect(() => {
        if (member) setFormData(member);
    }, [member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Modal isOpen onClose={onClose} title="Edit Member Details">
            {isLoading ? (
                <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleChange} />
                        <Input label="Email" name="email" value={formData.email || ''} onChange={handleChange} />
                        <Input label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        <Input label="Organization" name="organization" value={formData.organization || ''} onChange={handleChange} />
                        <Input label="Designation" name="designation" value={formData.designation || ''} onChange={handleChange} />
                        <Input label="College" name="college" value={formData.college || ''} onChange={handleChange} />
                        <Input label="University" name="university" value={formData.university || ''} onChange={handleChange} />
                        <Input label="Grad Year" name="graduationYear" type="number" value={formData.graduationYear || ''} onChange={handleChange} />

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Educational Level</label>
                            <select name="educationalLevel" className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" value={formData.educationalLevel || ''} onChange={handleChange}>
                                <option value="">Select Level</option>
                                {masterData?.educationalLevels?.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Working Sector</label>
                            <select name="workingSector" className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" value={formData.workingSector || ''} onChange={handleChange}>
                                <option value="">Select Sector</option>
                                {masterData?.workingSectors?.map(v => <option key={v.id} value={v.name}>{v.name.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                    </div>

                    <Input label="Address" name="address" value={formData.address || ''} onChange={handleChange} />

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4">
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                        <Button onClick={() => updateMutation.mutate()} isLoading={updateMutation.isPending} className="w-full sm:w-auto">Save Changes</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
