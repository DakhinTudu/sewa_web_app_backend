import { Link, useNavigate } from 'react-router-dom';
import { BellAlertIcon, CheckIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/AuthProvider';
import { announcementsApi } from '../../api/announcements.api';
import { communicationsApi } from '../../api/communications.api';
import { membersApi } from '../../api/members.api';
import clsx from 'clsx';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: announcements = [] } = useQuery({
        queryKey: ['announcements-list'],
        queryFn: announcementsApi.list,
        enabled: !!user,
        retry: false,
    });
    const { data: communicationsReceived = [] } = useQuery({
        queryKey: ['communications-received'],
        queryFn: communicationsApi.getReceivedByMe,
        enabled: !!user,
        retry: false,
    });
    const canSeePending = !!user && (
        user.roles?.includes('ROLE_SUPER_ADMIN') ||
        user.roles?.includes('ROLE_ADMIN') ||
        user.permissions?.includes('MEMBER_APPROVE')
    );
    const { data: pendingMembersPage } = useQuery({
        queryKey: ['pending-members-bell'],
        queryFn: () => membersApi.getPendingMembers(0, 20),
        enabled: canSeePending,
        retry: false,
    });
    const pendingMembers = pendingMembersPage?.content ?? [];

    const markAnnouncementReadMutation = useMutation({
        mutationFn: announcementsApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements-list'] });
            queryClient.invalidateQueries({ queryKey: ['announcements-unread-count'] });
        },
    });
    const markCommunicationReadMutation = useMutation({
        mutationFn: communicationsApi.markReceivedAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communications-received'] });
            queryClient.invalidateQueries({ queryKey: ['communications-received-unread-count'] });
        },
    });
    const approveMemberMutation = useMutation({
        mutationFn: membersApi.approveMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-members-bell'] });
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });
    const rejectMemberMutation = useMutation({
        mutationFn: membersApi.rejectMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-members-bell'] });
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });

    const hasAny =
        announcements.length > 0 ||
        communicationsReceived.length > 0 ||
        (canSeePending && pendingMembers.length > 0);

    return (
        <div className="mx-auto max-w-3xl">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md py-1.5 -ml-1"
                title="Go back"
            >
                <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                Back
            </button>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Announcements, messages and pending approvals
                </p>
            </div>

            {!hasAny ? (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <BellAlertIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <p className="mt-5 text-base font-medium text-gray-900">You're all caught up!</p>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm">
                            When you get notifications, they'll show up here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {announcements.length > 0 && (
                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    Announcements
                                </h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {announcements.map((a) => (
                                    <li
                                        key={a.id}
                                        className={clsx(
                                            !a.read && 'bg-primary-50/50 border-l-4 border-l-primary-500',
                                            'px-4 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors border-l-4 border-l-transparent'
                                        )}
                                        onClick={() => {
                                            if (!a.read) markAnnouncementReadMutation.mutate(a.id);
                                        }}
                                    >
                                        <p className="text-sm font-medium text-gray-900">{a.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {a.createdByUsername} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{a.content}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {communicationsReceived.length > 0 && (
                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    Messages
                                </h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {communicationsReceived.map((c) => (
                                    <li
                                        key={c.id}
                                        className={clsx(
                                            !c.read && 'bg-primary-50/50 border-l-4 border-l-primary-500',
                                            'px-4 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors border-l-4 border-l-transparent'
                                        )}
                                        onClick={() => {
                                            if (!c.read) markCommunicationReadMutation.mutate(c.id);
                                        }}
                                    >
                                        <p className="text-sm font-medium text-gray-900">{c.subject}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {c.sentAt ? new Date(c.sentAt).toLocaleDateString() : ''} · SEWA
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {canSeePending && pendingMembers.length > 0 && (
                        <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    Pending approvals
                                </h2>
                                <Link
                                    to="/dashboard/membership"
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                    View all members →
                                </Link>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {pendingMembers.map((m) => (
                                    <li
                                        key={m.id}
                                        className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-gray-50/80 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                                            {m.fullName ?? m.username ?? `Member #${m.id}`}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                                title="Approve"
                                                onClick={() => approveMemberMutation.mutate(m.id)}
                                                disabled={approveMemberMutation.isPending || rejectMemberMutation.isPending}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                title="Reject"
                                                onClick={() => rejectMemberMutation.mutate(m.id)}
                                                disabled={approveMemberMutation.isPending || rejectMemberMutation.isPending}
                                            >
                                                <XCircleIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
