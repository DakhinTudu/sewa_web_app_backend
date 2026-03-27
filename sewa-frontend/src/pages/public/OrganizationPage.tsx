import { MapPinIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { chaptersApi } from '../../api/chapters.api';
import { representativesApi } from '../../api/representatives.api';
import type { ChapterResponse } from '../../types/api.types';
import { PLACEHOLDER_AVATAR } from '../../constants/placeholders';

export default function OrganizationPage() {
    const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
        queryKey: ['chapters'],
        queryFn: () => chaptersApi.getAllChapters(),
    });

    const { data: representatives, isLoading: repsLoading } = useQuery({
        queryKey: ['representatives', 'active'],
        queryFn: () => representativesApi.getActive(),
    });

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

            {/* Executive Committee */}
            <div className="bg-secondary-50/50 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 font-sans">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Executive Committee</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Leadership team guiding SEWA forward
                        </p>
                    </div>

                    {repsLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {(representatives || []).map((rep) => {
                                const member = typeof rep.member === 'object' && rep.member ? rep.member as { fullName?: string; address?: string } : null;
                                const fullName = member?.fullName ?? 'Member';
                                return (
                                    <div key={rep.id} className="relative flex flex-col items-center bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all text-center group">
                                        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-50 mb-4 shadow-inner ring-4 ring-white group-hover:ring-primary-100 transition-all duration-300">
                                            <img
                                                src={PLACEHOLDER_AVATAR}
                                                alt=""
                                                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{fullName}</h3>
                                        <p className="text-[11px] text-primary-600 font-extrabold mt-1.5 uppercase tracking-tighter">{rep.roleName}</p>
                                        <div className="mt-4 pt-3 border-t border-gray-50 w-full text-[10px] text-gray-400 font-bold">
                                            {new Date(rep.termStart).getFullYear()} – {new Date(rep.termEnd).getFullYear()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* State Chapters */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 font-sans">
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Chapters</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Connect with your local chapter for regional activities
                    </p>
                </div>

                {chaptersLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {chapters.map((chapter: ChapterResponse) => (
                            <div key={chapter.id} className="group relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all border-l-4 border-primary-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                        <MapPinIcon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{chapter.chapterName}</h3>
                                        <p className="text-xs text-secondary-600 font-medium">{chapter.location}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="inline-flex items-center rounded-full bg-secondary-50 px-2 py-0.5 text-[10px] font-bold text-secondary-700 uppercase tracking-tight">
                                        {chapter.chapterType}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
