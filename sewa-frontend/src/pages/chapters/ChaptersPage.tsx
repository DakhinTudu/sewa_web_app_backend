import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chaptersApi } from '../../api/chapters.api';
import { dropdownsApi } from '../../api/dropdowns.api';
import type { ChapterResponse } from '../../types/api.types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { Table } from '../../components/tables/Table';
import { MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const PAGE_SIZE = 10;

export default function ChaptersPage() {
    const [page, setPage] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);
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
                                { header: 'Name', accessor: 'chapterName' as const },
                                { header: 'Location', accessor: 'location' as const },
                                { header: 'Type', accessor: 'chapterType' as const },
                                { header: 'Created', accessor: 'createdAt' as const },
                                {
                                    header: 'Actions',
                                    accessor: (row) => (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                                                onClick={() => setEditId(row.id)}
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                onClick={() => deleteMutation.mutate(row.id)}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ),
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
        </div>
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
        <Modal open onClose={onClose} title={isEdit ? 'Edit chapter' : 'Create chapter'}>
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
