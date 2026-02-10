import { Card, CardContent } from '../../components/ui/Card';
import { MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { chaptersApi } from '../../api/chapters.api';
import { representativesApi } from '../../api/representatives.api';

export default function OrganizationPage() {
    const { data: chaptersPage, isLoading: chaptersLoading } = useQuery({
        queryKey: ['chapters'],
        queryFn: () => chaptersApi.getAllChapters(0, 50)
    });

    const { data: representatives, isLoading: repsLoading } = useQuery({
        queryKey: ['representatives', 'active'],
        queryFn: () => representativesApi.getActive()
    });

    const chapters = chaptersPage?.content || [];

    return (
        <div className="bg-white">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-primary-50 to-white">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Our Organization
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            SEWA operates through chapters across India, bringing together Santal engineers nationwide
                        </p>
                    </div>
                </div>
            </div>

            {/* State Chapters */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Chapters</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Connect with your local chapter for regional activities and networking
                    </p>
                </div>

                {chaptersLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {chapters.map((chapter) => (
                            <Card key={chapter.id} className="hover:shadow-md transition-all hover:-translate-y-1">
                                <CardContent className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                                                <MapPinIcon className="h-6 w-6 text-primary-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{chapter.chapterName}</h3>
                                            <div className="mt-3 space-y-2 text-sm text-gray-600">
                                                <p className="flex items-center gap-1.5">
                                                    <span className="font-medium">Type:</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-700 text-xs font-semibold">
                                                        {chapter.chapterType}
                                                    </span>
                                                </p>
                                                <p><span className="font-medium">Location:</span> {chapter.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Executive Committee */}
            <div className="bg-gray-50 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Executive Committee</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Meet the leadership team guiding SEWA forward
                        </p>
                    </div>

                    {repsLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {(representatives || []).map((rep) => (
                                <Card key={rep.id} className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                                    <CardContent className="p-6">
                                        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-md">
                                            <UserIcon className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{rep.member.fullName}</h3>
                                        <p className="text-sm text-primary-600 font-bold mt-1 uppercase tracking-wider">{rep.roleName}</p>
                                        <p className="text-xs text-gray-500 mt-2">{rep.member.address || 'Member'}</p>
                                        <div className="mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-400 font-medium">
                                            TERM: {new Date(rep.termStart).getFullYear()} - {new Date(rep.termEnd).getFullYear()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
