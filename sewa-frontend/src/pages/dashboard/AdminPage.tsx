import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { auditApi } from '../../api/audit.api';
import { settingsApi } from '../../api/settings.api';
import { representativesApi, type CreateRepresentativeRequest } from '../../api/representatives.api';
import { membersApi } from '../../api/members.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Table } from '../../components/tables/Table';
import { useToast } from '../../components/ui/Toast';
import { UserGroupIcon, Cog6ToothIcon, DocumentMagnifyingGlassIcon, UserCircleIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { SystemSetting } from '../../types/api.types';

export default function AdminPage() {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [editSetting, setEditSetting] = useState<SystemSetting | null>(null);
    const [settingValue, setSettingValue] = useState('');
    const [showAddRep, setShowAddRep] = useState(false);
    const [repMemberId, setRepMemberId] = useState('');
    const [repRoleName, setRepRoleName] = useState('');
    const [repTermStart, setRepTermStart] = useState('');
    const [repTermEnd, setRepTermEnd] = useState('');

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin', 'dashboard', 'stats'],
        queryFn: adminApi.getDashboardStats,
    });
    const { data: auditPage, isLoading: auditLoading } = useQuery({
        queryKey: ['audit-logs', 0],
        queryFn: () => auditApi.getAll(0, 10),
    });
    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: settingsApi.getAll,
    });
    const { data: representatives, isLoading: repsLoading } = useQuery({
        queryKey: ['representatives'],
        queryFn: representativesApi.getActive,
    });
    const { data: membersPage } = useQuery({
        queryKey: ['members', 0, 50],
        queryFn: () => membersApi.getAllMembers(0, 50),
    });

    const updateSettingMutation = useMutation({
        mutationFn: ({ key, value }: { key: string; value: string }) => settingsApi.update(key, { value }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            setEditSetting(null);
            toast.success('Setting updated.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to update setting.';
            toast.error(msg);
        },
    });

    const addRepMutation = useMutation({
        mutationFn: (data: CreateRepresentativeRequest) => representativesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['representatives'] });
            setShowAddRep(false);
            setRepMemberId('');
            setRepRoleName('');
            setRepTermStart('');
            setRepTermEnd('');
            toast.success('Representative added.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to add representative.';
            toast.error(msg);
        },
    });

    const handleSaveSetting = () => {
        if (!editSetting) return;
        if (!settingValue.trim()) {
            toast.error('Value is required.');
            return;
        }
        updateSettingMutation.mutate({ key: editSetting.key, value: settingValue.trim() });
    };

    const handleAddRep = () => {
        const memberId = Number(repMemberId);
        if (!memberId || !repRoleName.trim() || !repTermStart || !repTermEnd) {
            toast.error('Please fill member ID, role name, term start and term end.');
            return;
        }
        addRepMutation.mutate({
            member: { id: memberId },
            roleName: repRoleName.trim(),
            termStart: repTermStart,
            termEnd: repTermEnd,
            active: true,
        });
    };

    const openEditSetting = (s: SystemSetting) => {
        setEditSetting(s);
        setSettingValue(s.value);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Admin</h1>
                <p className="mt-1 text-sm text-secondary-600">Dashboard stats, audit logs, settings and representatives</p>
            </div>

            {statsLoading ? (
                <Spinner size="lg" />
            ) : stats && (
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-primary-500 p-3">
                                <UserGroupIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-500">Total Users</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.totalUsers}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-primary-600 p-3">
                                <UserCircleIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-500">Total Members</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.totalMembers}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-teal-500 p-3">
                                <UserCircleIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-500">Total Students</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.totalStudents}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardContent className="p-0">
                    <div className="border-b border-secondary-200 px-4 py-3 flex items-center gap-2">
                        <DocumentMagnifyingGlassIcon className="h-5 w-5 text-secondary-500" />
                        <h2 className="font-semibold text-secondary-900">Audit logs</h2>
                    </div>
                    {auditLoading ? <div className="p-6 flex justify-center"><Spinner /></div> : auditPage?.content?.length ? (
                        <Table
                            data={auditPage.content}
                            keyExtractor={(row) => row.id}
                            columns={[
                                {
                                    header: 'User',
                                    className: 'w-full min-w-[120px] px-4',
                                    accessor: (row) => row.user?.username ?? '—'
                                },
                                {
                                    header: 'Action',
                                    className: 'w-0 px-2 sm:px-3 whitespace-nowrap',
                                    accessor: 'action' as const
                                },
                                { header: 'Entity', className: 'hidden lg:table-cell', accessor: 'entity' as const },
                                { header: 'Entity ID', className: 'hidden lg:table-cell', accessor: 'entityId' as const },
                                { header: 'Date', className: 'hidden md:table-cell', accessor: 'createdAt' as const },
                            ]}
                        />
                    ) : (
                        <div className="p-6 text-center text-secondary-500">No audit logs or access denied.</div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="border-b border-secondary-200 px-4 py-3 flex items-center gap-2">
                        <Cog6ToothIcon className="h-5 w-5 text-secondary-500" />
                        <h2 className="font-semibold text-secondary-900">System settings</h2>
                    </div>
                    {settingsLoading ? <div className="p-6 flex justify-center"><Spinner /></div> : settings?.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-200">
                                <thead className="bg-secondary-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Key</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Value</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Updated</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-200 bg-white">
                                    {settings.map((s) => (
                                        <tr key={s.key}>
                                            <td className="px-4 py-3 text-sm font-medium text-secondary-900 w-full min-w-[120px]">{s.key}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-600 truncate max-w-[80px] sm:max-w-none">{s.value}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-500 hidden md:table-cell">{s.updatedAt}</td>
                                            <td className="px-4 py-3 text-right w-0">
                                                <Button variant="ghost" size="sm" onClick={() => openEditSetting(s)} leftIcon={<PencilSquareIcon className="h-4 w-4" />}>
                                                    <span className="hidden sm:inline">Edit</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-secondary-500">No settings or access denied.</div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="border-b border-secondary-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserCircleIcon className="h-5 w-5 text-secondary-500" />
                            <h2 className="font-semibold text-secondary-900">Active representatives</h2>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowAddRep(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
                            Add representative
                        </Button>
                    </div>
                    {repsLoading ? <div className="p-6 flex justify-center"><Spinner /></div> : representatives?.length ? (
                        <ul className="divide-y divide-secondary-200">
                            {representatives.map((r) => (
                                <li key={r.id} className="px-4 py-3 flex justify-between items-center">
                                    <span className="font-medium text-secondary-900">{typeof r.member === 'object' ? (r.member as { fullName?: string })?.fullName : 'Member'}</span>
                                    <span className="text-sm text-secondary-600">{r.roleName} · {r.termStart} – {r.termEnd}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-secondary-500">No representatives or access denied.</div>
                    )}
                </CardContent>
            </Card>

            <Modal isOpen={!!editSetting} onClose={() => setEditSetting(null)} title="Edit setting">
                {editSetting && (
                    <div className="space-y-4">
                        <Input label="Key" value={editSetting.key} readOnly disabled />
                        <Input label="Value" value={settingValue} onChange={(e) => setSettingValue(e.target.value)} placeholder="Enter value" />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditSetting(null)}>Cancel</Button>
                            <Button onClick={handleSaveSetting} isLoading={updateSettingMutation.isPending}>Save</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showAddRep} onClose={() => setShowAddRep(false)} title="Add representative">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Member</label>
                        <select
                            className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm"
                            value={repMemberId}
                            onChange={(e) => setRepMemberId(e.target.value)}
                        >
                            <option value="">Select member</option>
                            {membersPage?.content?.map((m) => (
                                <option key={m.id} value={m.id}>{m.fullName} ({m.membershipCode})</option>
                            ))}
                        </select>
                    </div>
                    <Input label="Role name" value={repRoleName} onChange={(e) => setRepRoleName(e.target.value)} placeholder="e.g. President" />
                    <Input label="Term start" type="date" value={repTermStart} onChange={(e) => setRepTermStart(e.target.value)} />
                    <Input label="Term end" type="date" value={repTermEnd} onChange={(e) => setRepTermEnd(e.target.value)} />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddRep(false)}>Cancel</Button>
                        <Button onClick={handleAddRep} isLoading={addRepMutation.isPending}>Add</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
