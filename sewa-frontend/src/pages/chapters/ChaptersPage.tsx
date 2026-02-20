import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chaptersApi } from '../../api/chapters.api';
import { dropdownsApi } from '../../api/dropdowns.api';
import type { ChapterResponse } from '../../types/api.types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { Table } from '../../components/tables/Table';
import { PencilIcon, TrashIcon, EyeIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../../components/ui/Dropdown';

const PAGE_SIZE = 10;

export default function ChaptersPage() {
    const [page, setPage] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);
    const [viewId, setViewId] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: pageData, isLoading, isError } = useQuery({
        queryKey: ['chapters', page],
        queryFn: () => chaptersApi.getAll(page, PAGE_SIZE),
    });

    const { data: chapterTypes } = useQuery({
        queryKey: ['dropdowns', 'chapter-types'],
        queryFn: dropdownsApi.getChapterTypes,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => chaptersApi.deleteChapter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters'] });
            toast.success('Chapter deleted.');
        },
        onError: () => toast.error('Failed to delete chapter.'),
    });

    const chapters = pageData?.content ?? [];
    const totalPages = pageData?.totalPages ?? 0;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Chapters</h1>
                    <p className="mt-1 text-sm text-secondary-600">Manage association chapters</p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>Create chapter</Button>
            </div>

            {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
            {isError && <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load chapters.</div>}

            {!isLoading && !isError && (
                <Card>
                    <CardContent className="p-0">
                        <Table
                            data={chapters}
                            keyExtractor={(row) => row.id}
                            isLoading={false}
                            columns={[
                                {
                                    header: 'Name',
                                    className: 'w-full min-w-[140px] px-4',
                                    accessor: (row: ChapterResponse) => <span className="font-medium text-secondary-900 line-clamp-1">{row.chapterName}</span>
                                },
                                {
                                    header: 'Location',
                                    className: 'hidden md:table-cell',
                                    accessor: (row: ChapterResponse) => <span className="text-secondary-700">{row.location}</span>
                                },
                                {
                                    header: 'Type',
                                    className: 'hidden md:table-cell',
                                    accessor: (row: ChapterResponse) => <span className="text-secondary-600">{row.chapterType}</span>
                                },
                                {
                                    header: 'Actions',
                                    className: 'w-0 px-2 sm:px-3 text-right',
                                    accessor: (row) => {
                                        const actionItems: { label: string; icon: any; onClick: () => void; variant?: 'default' | 'danger' }[] = [
                                            {
                                                label: 'View details',
                                                icon: <EyeIcon className="h-4 w-4" />,
                                                onClick: () => setViewId(row.id),
                                            },
                                            {
                                                label: 'Edit chapter',
                                                icon: <PencilIcon className="h-4 w-4" />,
                                                onClick: () => setEditId(row.id),
                                            },
                                            {
                                                label: 'Delete',
                                                icon: <TrashIcon className="h-4 w-4" />,
                                                onClick: () => {
                                                    if (window.confirm('Are you certain you want to delete this chapter? All associated data will be affected.')) {
                                                        deleteMutation.mutate(row.id);
                                                    }
                                                },
                                                variant: 'danger',
                                            },
                                        ];

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
                                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                                <span className="text-sm text-secondary-600">Page {page + 1} of {totalPages}</span>
                                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {createOpen && (
                <ChapterFormModal
                    onClose={() => setCreateOpen(false)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['chapters'] });
                        setCreateOpen(false);
                        toast.success('Chapter created.');
                    }}
                    chapterTypes={chapterTypes ?? []}
                />
            )}
            {editId != null && (
                <ChapterFormModal
                    id={editId}
                    onClose={() => setEditId(null)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['chapters'] });
                        setEditId(null);
                        toast.success('Chapter updated.');
                    }}
                    chapterTypes={chapterTypes ?? []}
                />
            )}
            {viewId != null && (
                <ChapterDetailModal
                    id={viewId}
                    onClose={() => setViewId(null)}
                    onEdit={() => { setViewId(null); setEditId(viewId); }}
                />
            )}
        </div>
    );
}

function ChapterDetailModal({
    id,
    onClose,
    onEdit,
}: {
    id: number;
    onClose: () => void;
    onEdit: () => void;
}) {
    const { data: chapter, isLoading } = useQuery({
        queryKey: ['chapter', id],
        queryFn: () => chaptersApi.getChapterById(id),
    });

    return (
        <Modal isOpen={true} onClose={onClose} title="Chapter details" maxWidth="2xl">
            {isLoading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : chapter ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Chapter name</p><p className="text-secondary-900 font-medium">{chapter.chapterName}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Location</p><p className="text-secondary-900">{chapter.location}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Type</p><p className="text-secondary-900">{chapter.chapterType}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Total Members</p><p className="text-secondary-900 font-bold">{chapter.totalMembers ?? 0}</p></div>
                        <div><p className="text-xs font-medium text-secondary-500 uppercase">Created</p><p className="text-secondary-900">{chapter.createdAt ?? '—'}</p></div>
                    </div>

                    {chapter.representatives && chapter.representatives.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-secondary-900 mb-3 border-b pb-1">Executive Body / Representatives</h3>
                            <div className="overflow-hidden rounded-lg border border-secondary-200">
                                <table className="min-w-full divide-y divide-secondary-200">
                                    <thead className="bg-secondary-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Code</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500 uppercase">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-200 bg-white">
                                        {chapter.representatives.map((rep, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-sm text-secondary-900 font-medium">{rep.memberName}</td>
                                                <td className="px-4 py-2 text-sm text-secondary-600">{rep.membershipCode}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                                                        {rep.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-secondary-200 mt-6">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button onClick={onEdit}>Edit</Button>
                    </div>
                </>
            ) : (
                <p className="text-secondary-500 py-4">Chapter not found.</p>
            )}
        </Modal>
    );
}

function ChapterFormModal({
    id,
    onClose,
    onSuccess,
    chapterTypes,
}: {
    id?: number;
    onClose: () => void;
    onSuccess: () => void;
    chapterTypes: { label: string; value: string }[];
}) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');

    const { data: existing } = useQuery({
        queryKey: ['chapter', id],
        queryFn: () => chaptersApi.getChapterById(id!),
        enabled: id != null,
    });

    const createMutation = useMutation({
        mutationFn: () =>
            chaptersApi.createChapter({
                chapterName: name,
                location,
                chapterType: type as ChapterResponse['chapterType'],
            }),
        onSuccess,
    });

    const updateMutation = useMutation({
        mutationFn: () =>
            chaptersApi.updateChapter(id!, {
                chapterName: name,
                location,
                chapterType: type as ChapterResponse['chapterType'],
            }),
        onSuccess,
    });

    React.useEffect(() => {
        if (existing) {
            setName(existing.chapterName ?? '');
            setLocation(existing.location ?? '');
            setType(existing.chapterType ?? '');
        }
    }, [existing]);

    const isEdit = id != null;
    const submit = () => {
        if (!name.trim() || !location.trim() || !type) {
            return;
        }
        if (isEdit) updateMutation.mutate();
        else createMutation.mutate();
    };

    return (
        <Modal isOpen onClose={onClose} title={isEdit ? 'Edit chapter' : 'Create chapter'}>
            <div className="space-y-4">
                <Input label="Chapter name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chapter name" />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                    <select
                        className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select type</option>
                        {chapterTypes.map((ct) => (
                            <option key={ct.value} value={ct.value}>
                                {ct.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={submit} isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
                </div>
            </div>
        </Modal>
    );
}
