import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '../../api/notice.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { BellIcon } from '@heroicons/react/24/outline';
import { PLACEHOLDER_NEWS } from '../../constants/placeholders';

export default function NoticesPage() {
    const { data: notices = [], isLoading, isError } = useQuery({
        queryKey: ['notices'],
        queryFn: () => noticeApi.getAll(),
    });

    const activeNotices = notices.filter((n) => n.active !== false);

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load notices.</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Notices</h1>
                <p className="mt-1 text-sm text-secondary-600">Latest announcements and notices</p>
            </div>

            {activeNotices.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BellIcon className="h-12 w-12 mx-auto text-secondary-300 mb-4" />
                        <p className="text-secondary-600">No notices published</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {activeNotices.map((notice) => (
                        <Card key={notice.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                <div className="aspect-video sm:aspect-square sm:w-48 flex-shrink-0 overflow-hidden bg-gray-100">
                                    <img src={PLACEHOLDER_NEWS} alt="" className="h-full w-full object-cover" loading="lazy" />
                                </div>
                                <CardContent className="pt-6 flex-1 min-w-0">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                            <BellIcon className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-secondary-900">{notice.title}</h3>
                                            <p className="mt-2 text-sm text-secondary-600 whitespace-pre-wrap line-clamp-4 sm:line-clamp-none">{notice.content}</p>
                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-secondary-500">
                                                <span>By {notice.authorName ?? 'SEWA'}</span>
                                                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
