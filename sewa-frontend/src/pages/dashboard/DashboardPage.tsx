import { useQuery } from '@tanstack/react-query';
import {
    UsersIcon,
    AcademicCapIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

export default function DashboardPage() {
    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['admin', 'dashboard', 'stats'],
        queryFn: adminApi.getDashboardStats,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
                Failed to load dashboard stats. You may not have permission.
            </div>
        );
    }

    const statCards = [
        { name: 'Total Users', stat: String(stats?.totalUsers ?? 0), icon: UserGroupIcon, bg: 'bg-primary-500' },
        { name: 'Total Members', stat: String(stats?.totalMembers ?? 0), icon: UsersIcon, bg: 'bg-primary-600' },
        { name: 'Total Students', stat: String(stats?.totalStudents ?? 0), icon: AcademicCapIcon, bg: 'bg-teal-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-secondary-600">Overview of association statistics</p>

            <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((item) => (
                    <Card key={item.name} className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className={`rounded-xl p-3 ${item.bg}`}>
                                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-secondary-500">{item.name}</p>
                                    <p className="text-2xl font-bold text-secondary-900">{item.stat}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </dl>

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
                <Card className="mt-4">
                    <CardContent className="p-6">
                        <p className="text-secondary-500">No recent activity.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
