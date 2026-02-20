import { useQuery } from '@tanstack/react-query';
import {
    UsersIcon,
    AcademicCapIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../api/admin.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

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
            <div className="rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-100 p-6 text-red-700">
                <p className="font-semibold">Failed to load statistics</p>
                <p className="text-sm mt-1">You may not have administrative permissions to view this data.</p>
            </div>
        );
    }

    const statCards = [
        { name: 'Total Users', stat: stats?.totalUsers ?? 0, icon: UserGroupIcon, color: 'text-sky-600', bg: 'bg-sky-50' },
        { name: 'Total Members', stat: stats?.totalMembers ?? 0, icon: UsersIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Total Students', stat: stats?.totalStudents ?? 0, icon: AcademicCapIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
        { name: 'Total Chapters', stat: stats?.totalChapters ?? 0, icon: BuildingOfficeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const chapterData = Object.entries(stats?.membersByChapter ?? {}).map(([name, count]) => ({
        name,
        Members: count,
        Students: stats?.studentsByChapter[name] ?? 0,
    }));

    const degreeData = Object.entries(stats?.membersByEducationalLevel ?? {}).map(([name, value]) => ({
        name,
        value,
    }));

    const sectorData = Object.entries(stats?.membersByWorkingSector ?? {}).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Dashboard Overview</h1>
                <p className="mt-2 text-secondary-600">Detailed analytics and association health metrics</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                    <Card key={item.name} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className={`rounded-xl p-3 ${item.bg}`}>
                                    <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">{item.name}</p>
                                    <p className="text-3xl font-bold text-secondary-900">{item.stat}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Chapter-wise Distribution */}
                <Card className="p-6 border-none shadow-sm">
                    <h3 className="text-lg font-bold text-secondary-900 mb-6">Chapter-wise Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chapterData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="Members" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Students" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Educational Level Distribution */}
                <Card className="p-6 border-none shadow-sm">
                    <h3 className="text-lg font-bold text-secondary-900 mb-6">Educational Level (Members)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={degreeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {degreeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Sector-wise Distribution */}
                <Card className="p-6 border-none shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-secondary-900 mb-6">Professional Sector Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectorData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" name="Member Count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
