import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { studentsApi } from '../../api/students.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { Table } from '../../components/tables/Table';
import { CheckIcon, XMarkIcon, EyeIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../../components/ui/Dropdown';
import type { StudentResponse, MasterDataResponse } from '../../types/api.types';
import { MembershipStatus } from '../../types/api.types';
import { masterApi } from '../../api/master.api';

const PAGE_SIZE = 10;


export default function StudentsPage() {
    const [page, setPage] = useState(0);
    const [tab, setTab] = useState<'all' | 'pending'>('all');
    const [editId, setEditId] = useState<number | null>(null);
    const [viewId, setViewId] = useState<number | null>(null);
    const [tempFilters, setTempFilters] = useState({
        query: '',
        status: '' as string,
    });
    const [appliedFilters, setAppliedFilters] = useState({
        query: '',
        status: '' as string,
    });
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: masterData } = useQuery({
        queryKey: ['master-data'],
        queryFn: masterApi.getAllMasterData,
    });

    const { data: pageData, isLoading, isError } = useQuery({
        queryKey: ['students', page, tab, appliedFilters],
        queryFn: () =>
            tab === 'pending'
                ? studentsApi.getPendingStudents(page, PAGE_SIZE)
                : studentsApi.getAllStudents(page, PAGE_SIZE, {
                    query: appliedFilters.query || undefined,
                    status: appliedFilters.status || undefined,
                }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => studentsApi.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student deleted.');
        },
        onError: () => toast.error('Failed to delete student.'),
    });

    const approveMutation = useMutation({
        mutationFn: (id: number) => studentsApi.approveStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student approved.');
        },
        onError: () => toast.error('Failed to approve student.'),
    });

    const rejectMutation = useMutation({
        mutationFn: (id: number) => studentsApi.rejectStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student rejected.');
        },
        onError: () => toast.error('Failed to reject student.'),
    });

    const applyFilters = () => {
        setAppliedFilters(tempFilters);
        setPage(0);
    };

    const resetFilters = () => {
        const defaults = { query: '', status: '' };
        setTempFilters(defaults);
        setAppliedFilters(defaults);
        setPage(0);
    };

    const students = pageData?.content ?? [];
    const totalPages = pageData?.totalPages ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Students</h1>
                <p className="mt-1 text-sm text-secondary-600">Manage student members</p>
            </div>

            {/* Tabs */}
            {/* Filters Section (Only for 'All Students' tab) */}
            {tab === 'all' && (
                <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-secondary-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            placeholder="Search name, code, phone..."
                            value={tempFilters.query}
                            onChange={(e) => setTempFilters({ ...tempFilters, query: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                        <select
                            className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                            value={tempFilters.status}
                            onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            {Object.values(MembershipStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2 border-t border-secondary-100 pt-4">
                        <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
                        <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
                    </div>
                </div>
            )}

            <div className="flex gap-4 border-b border-secondary-200">
                <button
                    onClick={() => { setTab('all'); setPage(0); }}
                    className={`px - 4 py - 2 font - medium transition - colors ${tab === 'all' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-secondary-600 hover:text-secondary-900'} `}
                >
                    All Students
                </button>
                <button
                    onClick={() => { setTab('pending'); setPage(0); }}
                    className={`px - 4 py - 2 font - medium transition - colors ${tab === 'pending' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-secondary-600 hover:text-secondary-900'} `}
                >
                    Pending Approval
                </button>
            </div>

            {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
            {isError && <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load students.</div>}

            {!isLoading && !isError && (
                <Card>
                    <CardContent className="p-0">
                        <Table
                            data={students}
                            keyExtractor={(row) => row.id}
                            isLoading={false}
                            columns={[
                                {
                                    header: 'Name',
                                    className: 'w-full min-w-[140px] px-4',
                                    accessor: (row: StudentResponse) => <span className="font-medium text-secondary-900 line-clamp-1">{row.fullName}</span>
                                },
                                {
                                    header: 'Code',
                                    className: 'hidden md:table-cell',
                                    accessor: (row: StudentResponse) => <span className="font-mono text-sm text-secondary-600">{row.membershipCode || '—'}</span>
                                },
                                {
                                    header: 'Institute',
                                    className: 'hidden md:table-cell',
                                    accessor: (row: StudentResponse) => <span className="text-secondary-700">{row.institute || '—'}</span>
                                },
                                {
                                    header: 'Status',
                                    className: 'w-0 px-2 sm:px-3 text-center',
                                    accessor: (row: StudentResponse) => (
                                        <div className="flex justify-center">
                                            <StatusBadge status={row.status} showLabel={false} />
                                        </div>
                                    )
                                },
                                {
                                    header: 'Actions',
                                    className: 'w-0 px-2 sm:px-3 text-right',
                                    accessor: (row) => {
                                        const actionItems: any[] = [
                                            {
                                                label: 'View details',
                                                icon: <EyeIcon className="h-4 w-4" />,
                                                onClick: () => setViewId(row.id),
                                            },
                                            {
                                                label: 'Edit student',
                                                icon: <PencilSquareIcon className="h-4 w-4" />,
                                                onClick: () => setEditId(row.id),
                                            },
                                        ];

                                        if (tab === 'pending') {
                                            actionItems.push(
                                                {
                                                    label: 'Approve',
                                                    icon: <CheckIcon className="h-4 w-4" />,
                                                    onClick: () => approveMutation.mutate(row.id),
                                                },
                                                {
                                                    label: 'Reject',
                                                    icon: <XMarkIcon className="h-4 w-4" />,
                                                    onClick: () => rejectMutation.mutate(row.id),
                                                    variant: 'danger',
                                                }
                                            );
                                        }

                                        actionItems.push({
                                            label: 'Delete',
                                            icon: <TrashIcon className="h-4 w-4" />,
                                            onClick: () => {
                                                if (window.confirm('Are you certain you want to delete this student record? This action cannot be undone.')) {
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
                            ]}
                        />
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-secondary-200 px-4 py-3">
                                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                                    Previous
                                </Button>
                                <span className="text-sm text-secondary-600">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {editId != null && (
                <StudentFormModal
                    id={editId}
                    onClose={() => setEditId(null)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['students'] });
                        setEditId(null);
                        toast.success('Student updated.');
                    }}
                    masterData={masterData}
                />
            )}
            {viewId != null && (
                <StudentDetailModal
                    id={viewId}
                    onClose={() => setViewId(null)}
                    onEdit={() => { setViewId(null); setEditId(viewId); }}
                />
            )}
        </div>
    );
}

function StudentDetailModal({
    id,
    onClose,
    onEdit,
}: {
    id: number;
    onClose: () => void;
    onEdit: () => void;
}) {
    const { data: student, isLoading } = useQuery({
        queryKey: ['student', id],
        queryFn: () => studentsApi.getStudentById(id),
    });

    return (
        <Modal isOpen={true} onClose={onClose} title="Student details" maxWidth="2xl">
            {isLoading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : student ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Full name</p><p className="text-secondary-900 font-medium">{student.fullName}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Membership code</p><p className="font-mono text-secondary-900">{student.membershipCode || '—'}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Email</p><p className="text-secondary-900">{student.email}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Phone</p><p className="text-secondary-900">{student.phone || '—'}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Institute</p><p className="text-secondary-900">{student.institute || '—'}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Course</p><p className="text-secondary-900">{student.course || '—'}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Status</p><StatusBadge status={student.status} /></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Created</p><p className="text-secondary-900">{student.createdAt ?? '—'}</p></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-secondary-200 mt-4">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button onClick={onEdit}>Edit</Button>
                    </div>
                </>
            ) : (
                <p className="text-secondary-500 py-4">Student not found.</p>
            )}
        </Modal>
    );
}

function StudentFormModal({
    id,
    onClose,
    onSuccess,
    masterData,
}: {
    id: number;
    onClose: () => void;
    onSuccess: () => void;
    masterData?: MasterDataResponse;
}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [institute, setInstitute] = useState('');
    const [course, setCourse] = useState('');
    const [phone, setPhone] = useState('');
    const [educationalLevel, setEducationalLevel] = useState('');

    const { data: existing } = useQuery({
        queryKey: ['student', id],
        queryFn: () => studentsApi.getStudentById(id),
        enabled: id != null,
    });

    const updateMutation = useMutation({
        mutationFn: () =>
            studentsApi.updateStudent(id, {
                fullName,
                email,
                institute,
                course,
                phone,
                educationalLevel,
            }),
        onSuccess,
    });

    React.useEffect(() => {
        if (existing) {
            setFullName(existing.fullName ?? '');
            setEmail(existing.email ?? '');
            setInstitute(existing.institute ?? '');
            setCourse(existing.course ?? '');
            setPhone(existing.phone ?? '');
            setEducationalLevel(existing.educationalLevel ?? '');
        }
    }, [existing]);

    const submit = () => {
        if (!fullName.trim() || !email.trim()) {
            return;
        }
        updateMutation.mutate();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Edit student">
            <div className="space-y-4">
                <Input
                    label="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                />
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <Input
                    label="Institute"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    placeholder="Institute"
                />
                <Input
                    label="Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="Course"
                />
                <Input
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                />

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Educational Level</label>
                    <select
                        className="block w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                        value={educationalLevel}
                        onChange={(e) => setEducationalLevel(e.target.value)}
                    >
                        <option value="">Select Level</option>
                        {masterData?.educationalLevels.map(v => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={submit} isLoading={updateMutation.isPending}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
