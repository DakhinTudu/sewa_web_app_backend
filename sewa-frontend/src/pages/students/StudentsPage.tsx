import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/students.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { Table } from '../../components/tables/Table';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PAGE_SIZE = 10;

export default function StudentsPage() {
    const [page, setPage] = useState(0);
    const [tab, setTab] = useState<'all' | 'pending'>('all');
    const [editId, setEditId] = useState<number | null>(null);
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: pageData, isLoading, isError } = useQuery({
        queryKey: ['students', page, tab],
        queryFn: () =>
            tab === 'pending'
                ? studentsApi.getPendingStudents(page, PAGE_SIZE)
                : studentsApi.getAllStudents(page, PAGE_SIZE),
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

    const students = pageData?.content ?? [];
    const totalPages = pageData?.totalPages ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Students</h1>
                <p className="mt-1 text-sm text-secondary-600">Manage student members</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-secondary-200">
                <button
                    onClick={() => { setTab('all'); setPage(0); }}
                    className={`px-4 py-2 font-medium ${tab === 'all' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-secondary-600'}`}
                >
                    All Students
                </button>
                <button
                    onClick={() => { setTab('pending'); setPage(0); }}
                    className={`px-4 py-2 font-medium ${tab === 'pending' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-secondary-600'}`}
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
                                { header: 'Name', accessor: 'fullName' as const },
                                { header: 'Email', accessor: 'email' as const },
                                { header: 'Institute', accessor: 'institute' as const },
                                { header: 'Course', accessor: 'course' as const },
                                { header: 'Status', accessor: 'status' as const },
                                {
                                    header: 'Actions',
                                    accessor: (row) => (
                                        <div className="flex gap-2">
                                            {tab === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                        onClick={() => approveMutation.mutate(row.id)}
                                                        disabled={approveMutation.isPending}
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        onClick={() => rejectMutation.mutate(row.id)}
                                                        disabled={rejectMutation.isPending}
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                                                onClick={() => setEditId(row.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                onClick={() => deleteMutation.mutate(row.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ),
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
                />
            )}
        </div>
    );
}

function StudentFormModal({
    id,
    onClose,
    onSuccess,
}: {
    id: number;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [institute, setInstitute] = useState('');
    const [course, setCourse] = useState('');
    const [phone, setPhone] = useState('');

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
