import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    communicationsApi,
    BASE_ALL,
    BASE_BY_CHAPTER,
    BASE_BY_PAYMENT_STATUS,
    BASE_MANUAL,
    PAYMENT_UNPAID_CURRENT_YEAR,
    type CommunicationRecipientRequest,
    type SendCommunicationRequest,
} from '../../api/communications.api';
import { chaptersApi } from '../../api/chapters.api';
import { membersApi } from '../../api/members.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { EnvelopeIcon, EyeIcon, PaperAirplaneIcon, ClockIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Spinner } from '../../components/ui/Spinner';

const BASE_OPTIONS = [
    { value: BASE_ALL, label: 'All active members (with email)' },
    { value: BASE_BY_CHAPTER, label: 'By chapter' },
    { value: BASE_BY_PAYMENT_STATUS, label: 'By payment status' },
    { value: BASE_MANUAL, label: 'Select members manually (search and pick)' },
];

const MEMBER_STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'INACTIVE', label: 'Inactive' },
];

function parseIdList(str: string): number[] {
    if (!str || !str.trim()) return [];
    return str
        .split(/[\s,]+/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n));
}

export default function CommunicationsPage() {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [baseType, setBaseType] = useState(BASE_ALL);
    const [chapterIds, setChapterIds] = useState<number[]>([]);
    const [paymentFilter, setPaymentFilter] = useState(PAYMENT_UNPAID_CURRENT_YEAR);
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [memberSearchChapterId, setMemberSearchChapterId] = useState<number | ''>('');
    const [memberSearchStatus, setMemberSearchStatus] = useState('');
    const [memberSearchPage, setMemberSearchPage] = useState(0);
    const memberPageSize = 15;
    const [includeIdsStr, setIncludeIdsStr] = useState('');
    const [excludeIdsStr, setExcludeIdsStr] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [previewCount, setPreviewCount] = useState<number | null>(null);
    const [sampleEmails, setSampleEmails] = useState<string[]>([]);
    const [sendConfirm, setSendConfirm] = useState(false);

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters-list'],
        queryFn: chaptersApi.getAllChapters,
    });

    const { data: membersPage, isLoading: membersLoading } = useQuery({
        queryKey: ['members-search', memberSearchPage, memberSearchQuery, memberSearchChapterId, memberSearchStatus],
        queryFn: () =>
            membersApi.getAllMembers(memberSearchPage, memberPageSize, {
                query: memberSearchQuery.trim() || undefined,
                chapterId: memberSearchChapterId === '' ? undefined : memberSearchChapterId,
                status: memberSearchStatus || undefined,
            }),
        enabled: baseType === BASE_MANUAL,
    });
    const members = membersPage?.content ?? [];
    const totalMembers = membersPage?.totalElements ?? 0;
    const totalPages = membersPage?.totalPages ?? 0;

    const buildSelection = (): CommunicationRecipientRequest => {
        const sel: CommunicationRecipientRequest = { baseType };
        if (baseType === BASE_BY_CHAPTER && chapterIds.length > 0) sel.chapterIds = chapterIds;
        if (baseType === BASE_BY_PAYMENT_STATUS) sel.paymentFilter = paymentFilter;
        if (baseType === BASE_MANUAL && selectedMemberIds.length > 0) sel.memberIds = selectedMemberIds;
        const include = parseIdList(includeIdsStr);
        if (include.length > 0) sel.includeMemberIds = include;
        const exclude = parseIdList(excludeIdsStr);
        if (exclude.length > 0) sel.excludeMemberIds = exclude;
        return sel;
    };

    const previewMutation = useMutation({
        mutationFn: (selection: CommunicationRecipientRequest) => communicationsApi.preview(selection),
        onSuccess: (data) => {
            setPreviewCount(data.recipientCount);
            setSampleEmails(data.sampleEmails ?? []);
            toast.success(`Preview: ${data.recipientCount} recipient(s).`);
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Preview failed.';
            toast.error(msg);
        },
    });

    const sendMutation = useMutation({
        mutationFn: (payload: SendCommunicationRequest) => communicationsApi.send(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communications-history'] });
            setSendConfirm(false);
            setSubject('');
            setBody('');
            setPreviewCount(null);
            setSampleEmails([]);
            toast.success('Emails sent successfully.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Send failed.';
            toast.error(msg);
        },
    });

    const { data: history = [] } = useQuery({
        queryKey: ['communications-history'],
        queryFn: communicationsApi.getHistory,
    });

    const toggleChapter = (id: number) => {
        setChapterIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    };

    const toggleMemberSelection = (id: number) => {
        setSelectedMemberIds((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const selectAllOnPage = () => {
        const ids = members.map((m) => m.id).filter((id) => !selectedMemberIds.includes(id));
        if (ids.length === 0) {
            setSelectedMemberIds((prev) => prev.filter((id) => !members.some((m) => m.id === id)));
        } else {
            setSelectedMemberIds((prev) => [...new Set([...prev, ...ids])]);
        }
    };

    const clearMemberSelection = () => setSelectedMemberIds([]);

    const handlePreview = () => {
        previewMutation.mutate(buildSelection());
    };

    const handleSend = () => {
        if (!subject.trim()) {
            toast.error('Subject is required.');
            return;
        }
        if (!body.trim()) {
            toast.error('Body is required.');
            return;
        }
        if (!sendConfirm) {
            setSendConfirm(true);
            return;
        }
        sendMutation.mutate({
            subject: subject.trim(),
            body: body.trim(),
            recipientSelection: buildSelection(),
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
                <p className="mt-1 text-sm text-gray-600">Send custom emails to members at their registered email address (the one they use to log in).</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipients</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Base selection</label>
                            <div className="space-y-2">
                                {BASE_OPTIONS.map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="baseType"
                                            value={opt.value}
                                            checked={baseType === opt.value}
                                            onChange={() => setBaseType(opt.value)}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {baseType === BASE_BY_CHAPTER && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chapters</label>
                                <div className="flex flex-wrap gap-2">
                                    {chapters.map((ch) => (
                                        <button
                                            key={ch.id}
                                            type="button"
                                            onClick={() => toggleChapter(ch.id)}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                                                chapterIds.includes(ch.id)
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {ch.chapterName}
                                        </button>
                                    ))}
                                    {chapters.length === 0 && <span className="text-sm text-gray-500">No chapters.</span>}
                                </div>
                            </div>
                        )}

                        {baseType === BASE_BY_PAYMENT_STATUS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment filter</label>
                                <p className="text-sm text-gray-600">Members without PAID membership fee for current financial year. Emails go to their registered address.</p>
                                <input type="hidden" value={paymentFilter} readOnly />
                            </div>
                        )}

                        {baseType === BASE_MANUAL && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Search and select members. Only members with a registered email will receive the mail.</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex-1 min-w-[180px]">
                                        <Input
                                            placeholder="Search by name, code, phone…"
                                            value={memberSearchQuery}
                                            onChange={(e) => setMemberSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && setMemberSearchPage(0)}
                                        />
                                    </div>
                                    <select
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        value={memberSearchChapterId}
                                        onChange={(e) => {
                                            setMemberSearchChapterId(e.target.value === '' ? '' : Number(e.target.value));
                                            setMemberSearchPage(0);
                                        }}
                                    >
                                        <option value="">All chapters</option>
                                        {chapters.map((ch) => (
                                            <option key={ch.id} value={ch.id}>{ch.chapterName}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        value={memberSearchStatus}
                                        onChange={(e) => {
                                            setMemberSearchStatus(e.target.value);
                                            setMemberSearchPage(0);
                                        }}
                                    >
                                        {MEMBER_STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <Button type="button" variant="secondary" size="sm" onClick={() => setMemberSearchPage(0)} className="inline-flex items-center gap-1">
                                        <MagnifyingGlassIcon className="h-4 w-4" />
                                        Search
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        {selectedMemberIds.length} member(s) selected
                                        {selectedMemberIds.length > 0 && (
                                            <button type="button" onClick={clearMemberSelection} className="ml-2 text-primary-600 hover:underline inline-flex items-center gap-1">
                                                <XMarkIcon className="h-4 w-4" /> Clear
                                            </button>
                                        )}
                                    </span>
                                    <button type="button" onClick={selectAllOnPage} className="text-sm text-primary-600 hover:underline">
                                        {members.some((m) => !selectedMemberIds.includes(m.id)) ? 'Select all on this page' : 'Deselect all on this page'}
                                    </button>
                                </div>
                                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[320px] overflow-y-auto">
                                    {membersLoading ? (
                                        <div className="p-8 flex justify-center"><Spinner /></div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="w-10 px-3 py-2 text-left">
                                                        <input
                                                            type="checkbox"
                                                            checked={members.length > 0 && members.every((m) => selectedMemberIds.includes(m.id))}
                                                            onChange={selectAllOnPage}
                                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 hidden sm:table-cell">Email</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 hidden md:table-cell">Chapter</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {members.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-6 text-sm text-center text-gray-500">
                                                            No members found. Try changing search or filters.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    members.map((m) => (
                                                        <tr key={m.id} className="hover:bg-gray-50">
                                                            <td className="w-10 px-3 py-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedMemberIds.includes(m.id)}
                                                                    onChange={() => toggleMemberSelection(m.id)}
                                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 text-sm font-medium text-gray-900">{m.fullName}</td>
                                                            <td className="px-3 py-2 text-sm text-gray-600">{m.membershipCode || '—'}</td>
                                                            <td className="px-3 py-2 text-sm text-gray-600 hidden sm:table-cell">{m.email || '—'}</td>
                                                            <td className="px-3 py-2 text-sm text-gray-600 hidden md:table-cell">{m.chapterName || '—'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Page {memberSearchPage + 1} of {totalPages} ({totalMembers} total)
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={memberSearchPage === 0}
                                                onClick={() => setMemberSearchPage((p) => Math.max(0, p - 1))}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={memberSearchPage >= totalPages - 1}
                                                onClick={() => setMemberSearchPage((p) => p + 1)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Include member IDs (optional)</label>
                                <Input
                                    value={includeIdsStr}
                                    onChange={(e) => setIncludeIdsStr(e.target.value)}
                                    placeholder="e.g. 5, 10"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exclude member IDs (optional)</label>
                                <Input
                                    value={excludeIdsStr}
                                    onChange={(e) => setExcludeIdsStr(e.target.value)}
                                    placeholder="e.g. 7, 8"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handlePreview}
                            disabled={previewMutation.isPending}
                            variant="secondary"
                            className="inline-flex items-center gap-2"
                        >
                            <EyeIcon className="h-5 w-5" />
                            {previewMutation.isPending ? 'Previewing…' : 'Preview recipients'}
                        </Button>

                        {previewCount !== null && (
                            <div className="rounded-md bg-gray-50 p-4 text-sm">
                                <p className="font-medium text-gray-900">Will send to {previewCount} recipient(s).</p>
                                {sampleEmails.length > 0 && (
                                    <p className="mt-2 text-gray-600">
                                        Sample: {sampleEmails.slice(0, 3).join(', ')}
                                        {sampleEmails.length > 3 && ' …'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                            <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject"
                                className="w-full max-w-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Email body (plain text)"
                                rows={6}
                                className="w-full max-w-xl rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                        </div>
                        {sendConfirm ? (
                            <div className="flex items-center gap-3">
                                <p className="text-sm text-amber-700 font-medium">Send to {previewCount ?? '?'} recipients? This action cannot be undone.</p>
                                <Button variant="secondary" onClick={() => setSendConfirm(false)}>Cancel</Button>
                                <Button onClick={handleSend} disabled={sendMutation.isPending} className="inline-flex items-center gap-2">
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                    {sendMutation.isPending ? 'Sending…' : 'Confirm & send'}
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={handleSend} disabled={sendMutation.isPending} className="inline-flex items-center gap-2">
                                <EnvelopeIcon className="h-5 w-5" />
                                {sendMutation.isPending ? 'Sending…' : 'Send email'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5" />
                        Recent sends
                    </h2>
                    {history.length === 0 ? (
                        <p className="text-sm text-gray-500">No communications sent yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {history.map((log) => (
                                <li key={log.id} className="py-3 first:pt-0">
                                    <p className="font-medium text-gray-900">{log.subject}</p>
                                    <p className="text-sm text-gray-600">
                                        {log.recipientCount} recipient(s) · {log.criteriaSummary ?? '—'} · {log.sentAt ? new Date(log.sentAt).toLocaleString() : ''}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
