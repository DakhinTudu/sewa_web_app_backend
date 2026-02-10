import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../../api/calendar.api';
import { chaptersApi } from '../../api/chapters.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function CalendarPage() {
    const [chapterFilter, setChapterFilter] = useState<number | null>(null);

    const { data: chapters } = useQuery({
        queryKey: ['chapters'],
        queryFn: chaptersApi.getAllChapters,
    });

    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['calendar', 'events', chapterFilter],
        queryFn: () => chapterFilter != null ? calendarApi.getChapterEvents(chapterFilter) : calendarApi.getEvents(),
    });

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load events.</div>;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Calendar</h1>
                    <p className="mt-1 text-sm text-secondary-600">Association events and schedules</p>
                </div>
                {chapters && chapters.length > 0 && (
                    <select
                        className="mt-2 sm:mt-0 rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                        value={chapterFilter ?? ''}
                        onChange={(e) => setChapterFilter(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">All events</option>
                        {chapters.map((ch) => (
                            <option key={ch.id} value={ch.id}>{ch.chapterName}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(events?.length ?? 0) === 0 ? (
                    <Card className="sm:col-span-2 lg:col-span-3">
                        <CardContent className="py-12 text-center text-secondary-500">
                            <CalendarIcon className="mx-auto h-12 w-12 text-secondary-400" />
                            <p className="mt-2">No events scheduled.</p>
                        </CardContent>
                    </Card>
                ) : (
                    events?.map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <CalendarIcon className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-secondary-900 truncate">{event.title}</h3>
                                        <p className="mt-1 text-sm text-secondary-500">{event.eventDate}</p>
                                        {event.description && <p className="mt-2 text-sm text-secondary-600 line-clamp-2">{event.description}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
