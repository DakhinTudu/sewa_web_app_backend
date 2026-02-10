import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { auditApi } from '../../api/audit.api';
import { settingsApi } from '../../api/settings.api';
import { representativesApi } from '../../api/representatives.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Table } from '../../components/tables/Table';
import { UserGroupIcon, Cog6ToothIcon, DocumentMagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function AdminPage() {
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
                                { header: 'User', accessor: (row) => row.user?.username ?? '—' },
                                { header: 'Action', accessor: 'action' as const },
                                { header: 'Entity', accessor: 'entity' as const },
                                { header: 'Entity ID', accessor: 'entityId' as const },
                                { header: 'Date', accessor: 'createdAt' as const },
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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-200 bg-white">
                                    {settings.map((s) => (
                                        <tr key={s.key}>
                                            <td className="px-4 py-3 text-sm font-medium text-secondary-900">{s.key}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-600">{s.value}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-500">{s.updatedAt}</td>
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
                    <div className="border-b border-secondary-200 px-4 py-3 flex items-center gap-2">
                        <UserCircleIcon className="h-5 w-5 text-secondary-500" />
                        <h2 className="font-semibold text-secondary-900">Active representatives</h2>
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
        </div>
    );
}
