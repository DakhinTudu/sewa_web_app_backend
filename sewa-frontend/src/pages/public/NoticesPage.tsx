import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../../api/content.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { BellIcon } from '@heroicons/react/24/outline';

export default function NoticesPage() {
    const { data: pageData, isLoading, isError } = useQuery({
        queryKey: ['notices'],
        queryFn: () => contentApi.getAll(0, 50),
    });

    const notices = (pageData?.content ?? []).filter(
        (item) => item.contentType === 'NOTICE' && item.visibility === 'PUBLIC'
    );

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load notices.</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Notices</h1>
                <p className="mt-1 text-sm text-secondary-600">Latest announcements and notices</p>
            </div>

            {notices.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BellIcon className="h-12 w-12 mx-auto text-secondary-300 mb-4" />
                        <p className="text-secondary-600">No notices published</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {notices.map((notice) => (
                        <Card key={notice.id}>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <BellIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-secondary-900">{notice.title}</h3>
                                        <p className="mt-2 text-sm text-secondary-600">{notice.description}</p>
                                        <div className="mt-4 flex items-center justify-between text-xs text-secondary-500">
                                            <span>By {notice.authorName}</span>
                                            <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
