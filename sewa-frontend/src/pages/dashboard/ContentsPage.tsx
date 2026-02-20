import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../../api/content.api';
import type { ContentResponse } from '../../types/api.types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { Table } from '../../components/tables/Table';
import { PencilSquareIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../../components/ui/Dropdown';

const PAGE_SIZE = 10;

export default function ContentsPage() {
    const [page, setPage] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: pageData, isLoading, isError } = useQuery({
        queryKey: ['contents', page],
        queryFn: () => contentApi.getAll(page, PAGE_SIZE),
    });

    const deleteMutation = useMutation({
        mutationFn: contentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contents'] });
            toast.success('Content deleted.');
        },
        onError: () => toast.error('Failed to delete content.'),
    });

    const content = pageData?.content ?? [];
    const totalPages = pageData?.totalPages ?? 0;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Contents</h1>
                    <p className="mt-1 text-sm text-secondary-600">Manage notices, events, news and publications</p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>Add content</Button>
            </div>

            {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
            {isError && <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load contents.</div>}
            {!isLoading && !isError && (
                <Card>
                    <CardContent className="p-0">
                        <Table
                            data={content}
                            keyExtractor={(row) => row.id}
                            isLoading={false}
                            columns={[
                                {
                                    header: 'Title',
                                    className: 'w-full min-w-[140px] px-4',
                                    accessor: (row) => <span className="font-medium text-secondary-900 line-clamp-1">{row.title}</span>
                                },
                                {
                                    header: 'Type',
                                    className: 'hidden sm:table-cell',
                                    accessor: 'contentType' as const
                                },
                                { header: 'Visibility', className: 'hidden lg:table-cell', accessor: 'visibility' as const },
                                { header: 'Published', className: 'hidden md:table-cell', accessor: (row) => row.published ? 'Yes' : 'No' },
                                { header: 'Date', className: 'hidden md:table-cell', accessor: 'eventDate' as const },
                                {
                                    header: 'Actions',
                                    className: 'w-0 px-2 sm:px-3 text-right',
                                    accessor: (row) => {
                                        const actionItems = [
                                            {
                                                label: 'Edit',
                                                icon: <PencilSquareIcon className="h-4 w-4" />,
                                                onClick: () => setEditId(row.id),
                                            },
                                            {
                                                label: 'Delete',
                                                icon: <TrashIcon className="h-4 w-4" />,
                                                onClick: () => {
                                                    if (window.confirm('Are you certain you want to delete this content item? This action cannot be undone.')) {
                                                        deleteMutation.mutate(row.id);
                                                    }
                                                },
                                                variant: 'danger' as const,
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

            {createOpen && <ContentFormModal onClose={() => setCreateOpen(false)} onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['contents'] }); setCreateOpen(false); toast.success('Content created.'); }} />}
            {editId != null && <ContentFormModal id={editId} onClose={() => setEditId(null)} onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['contents'] }); setEditId(null); toast.success('Content updated.'); }} />}
        </div>
    );
}

function ContentFormModal({ id, onClose, onSuccess }: { id?: number; onClose: () => void; onSuccess: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentType, setContentType] = useState<ContentResponse['contentType']>('NOTICE');
    const [visibility, setVisibility] = useState<ContentResponse['visibility']>('PUBLIC');
    const [eventDate, setEventDate] = useState('');
    const [published, setPublished] = useState(false);

    const { data: existing } = useQuery({
        queryKey: ['content', id],
        queryFn: () => contentApi.getById(id!),
        enabled: id != null,
    });

    useEffect(() => {
        if (existing) {
            setTitle(existing.title ?? '');
            setDescription(existing.description ?? '');
            setContentType(existing.contentType);
            setVisibility(existing.visibility);
            setEventDate(existing.eventDate ?? '');
            setPublished(!!existing.published);
        } else if (id == null) {
            setTitle('');
            setDescription('');
            setContentType('NOTICE');
            setVisibility('PUBLIC');
            setEventDate('');
            setPublished(false);
        }
    }, [existing, id]);

    const createMutation = useMutation({
        mutationFn: () => contentApi.create({ title, description, contentType, visibility, eventDate: eventDate || undefined, published }),
        onSuccess: onSuccess,
    });
    const updateMutation = useMutation({
        mutationFn: () => contentApi.update(id!, { title, description, contentType, visibility, eventDate: eventDate || undefined, published }),
        onSuccess: onSuccess,
    });

    const isEdit = id != null;
    const submit = () => {
        if (!title.trim()) return;
        if (isEdit) updateMutation.mutate(); else createMutation.mutate();
    };

    return (
        <Modal isOpen onClose={onClose} title={isEdit ? 'Edit content' : 'Add content'}>
            <div className="space-y-4">
                <input type="text" className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea rows={3} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                    <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={contentType} onChange={(e) => setContentType(e.target.value as ContentResponse['contentType'])}>
                        <option value="NOTICE">Notice</option>
                        <option value="EVENT">Event</option>
                        <option value="NEWS">News</option>
                        <option value="PUBLICATION">Publication</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Visibility</label>
                    <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={visibility} onChange={(e) => setVisibility(e.target.value as ContentResponse['visibility'])}>
                        <option value="PUBLIC">Public</option>
                        <option value="MEMBERS_ONLY">Members only</option>
                    </select>
                </div>
                <input type="date" className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                    <span className="text-sm text-secondary-700">Published</span>
                </label>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={submit} isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
                </div>
            </div>
        </Modal>
    );
}
