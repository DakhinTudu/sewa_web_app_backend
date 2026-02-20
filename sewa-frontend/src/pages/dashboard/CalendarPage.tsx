import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../../api/calendar.api';
import { chaptersApi } from '../../api/chapters.api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../auth/AuthProvider';
import { CalendarIcon, PlusIcon, TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import clsx from 'clsx';
import type { CalendarEventResponse } from '../../types/api.types';

export default function CalendarPage() {
    const { user } = useAuth();
    const isAdmin = user?.roles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_SUPER_ADMIN');
    const queryClient = useQueryClient();
    const toast = useToast();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [chapterFilter, setChapterFilter] = useState<number | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEventResponse | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const { data: chapters } = useQuery({
        queryKey: ['chapters'],
        queryFn: chaptersApi.getAllChapters,
    });

    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['calendar', 'events', chapterFilter],
        queryFn: () => chapterFilter != null ? calendarApi.getChapterEvents(chapterFilter) : calendarApi.getEvents(),
    });

    const createMutation = useMutation({
        mutationFn: calendarApi.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setIsAddModalOpen(false);
            toast.success('Event created successfully');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create event'),
    });

    const updateMutation = useMutation({
        mutationFn: (vars: { id: number, data: Partial<CalendarEventResponse> }) => calendarApi.updateEvent(vars.id, vars.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setEditingEvent(null);
            toast.success('Event updated successfully');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update event'),
    });

    const deleteMutation = useMutation({
        mutationFn: calendarApi.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            toast.success('Event deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete event'),
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getEventsForDay = (day: number, m: number, y: number) => {
        if (!events) return [];
        return events.filter((event: CalendarEventResponse) => {
            const ed = new Date(event.eventDate);
            return ed.getDate() === day && ed.getMonth() === m && ed.getFullYear() === y;
        });
    };

    const getEventTypeColor = (type?: string) => {
        switch (type) {
            case 'MEETING': return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100';
            case 'FESTIVAL': return 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-100';
            case 'AGM': return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100';
            case 'WORKSHOP': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100';
            case 'SOCIAL_EVENT': return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-100';
        }
    };

    const selectedDayEvents = selectedDate
        ? getEventsForDay(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear())
        : [];

    if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-2xl bg-red-50 p-6 text-red-700 border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-4">Failed to load events.</div>;

    return (
        <div className="space-y-6 sm:space-y-8 pb-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/60 shadow-xl shadow-secondary-200/20">
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 flex-shrink-0">
                        <CalendarIcon className="h-9 w-9 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-secondary-900 tracking-tight leading-tight">Calendar <span className="text-primary-600">& Events</span></h1>
                        <p className="text-secondary-500 font-medium text-sm mt-0.5">Manage and track association milestones.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {chapters && chapters.length > 0 && (
                        <div className="relative">
                            <select
                                className="appearance-none bg-white rounded-2xl border-secondary-200 pl-4 pr-10 py-3 text-sm font-bold text-secondary-700 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 shadow-sm transition-all cursor-pointer min-w-[200px]"
                                value={chapterFilter ?? ''}
                                onChange={(e) => setChapterFilter(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Global Network</option>
                                {chapters.map((ch: any) => (
                                    <option key={ch.id} value={ch.id}>{ch.chapterName}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-secondary-400">
                                <ChevronRightIcon className="h-4 w-4 rotate-90" />
                            </div>
                        </div>
                    )}
                    {isAdmin && (
                        <Button
                            leftIcon={<PlusIcon className="w-5 h-5" />}
                            onClick={() => setIsAddModalOpen(true)}
                            className="rounded-2xl py-3 px-6 shadow-primary-500/25 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider font-black"
                        >
                            Schedule Event
                        </Button>
                    )}
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            {isAdmin && (
                <div className="fixed bottom-6 right-6 z-50 lg:hidden">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-16 w-16 rounded-full shadow-2xl p-0 flex items-center justify-center transition-transform active:scale-95 bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="h-9 w-9 text-white" />
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:direction-normal flex flex-col-reverse lg:grid">
                {/* Main Calendar View - comes second on mobile */}
                <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-secondary-200/30 border border-secondary-100 overflow-hidden group/calendar">
                        {/* Navigation Header */}
                        <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-950 px-6 sm:px-10 py-6 sm:py-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

                            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="animate-in slide-in-from-left duration-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="h-1 w-8 bg-primary-500 rounded-full" />
                                        <span className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">{year}</span>
                                    </div>
                                    <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">{monthNames[month]}</h2>
                                </div>

                                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl backdrop-blur-xl border border-white/10 w-full sm:w-auto shadow-2xl">
                                    <button
                                        onClick={goToPrevMonth}
                                        className="p-4 hover:bg-white/20 rounded-xl transition-all text-white active:scale-90"
                                        title="Previous Month"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6 stroke-[3]" />
                                    </button>
                                    <button
                                        onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
                                        className="flex-1 sm:flex-none px-6 py-4 text-[10px] sm:text-xs font-black bg-white text-secondary-900 rounded-xl hover:bg-primary-50 transition-all shadow-xl active:scale-95 uppercase tracking-widest whitespace-nowrap"
                                    >
                                        TODAY
                                    </button>
                                    <button
                                        onClick={goToNextMonth}
                                        className="p-4 hover:bg-white/20 rounded-xl transition-all text-white active:scale-90"
                                        title="Next Month"
                                    >
                                        <ChevronRightIcon className="w-6 h-6 stroke-[3]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="p-1 sm:p-2 bg-secondary-50/50">
                            {/* Week Header */}
                            <div className="grid grid-cols-7 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="py-3 text-center text-[10px] font-black text-primary-600 uppercase tracking-widest">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {/* Prev Month Buffer */}
                                {[...Array(firstDayOfMonth)].map((_, i) => (
                                    <div key={`prev-${i}`} className="aspect-square sm:aspect-auto sm:h-32 rounded-2xl sm:rounded-3xl border border-secondary-100/30 bg-secondary-100/10 flex items-center justify-center opacity-30 select-none">
                                        <span className="text-xs font-black text-secondary-400">{prevMonthDays - firstDayOfMonth + i + 1}</span>
                                    </div>
                                ))}

                                {/* Active Days */}
                                {[...Array(daysInMonth)].map((_, i) => {
                                    const dayNum = i + 1;
                                    const dayEvents = getEventsForDay(dayNum, month, year);
                                    const isToday = dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                                    const isSelected = selectedDate?.getDate() === dayNum && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;

                                    return (
                                        <div
                                            key={dayNum}
                                            onClick={() => setSelectedDate(new Date(year, month, dayNum))}
                                            className={clsx(
                                                "aspect-square sm:aspect-auto sm:h-32 rounded-2xl sm:rounded-3xl p-1 sm:p-3 transition-all cursor-pointer relative flex flex-col group",
                                                isSelected ? "bg-primary-50 ring-2 ring-primary-500 shadow-xl shadow-primary-100 z-10 scale-[1.02]" : "bg-white hover:bg-secondary-50/80 border border-secondary-100 hover:shadow-lg",
                                                isToday && !isSelected && "ring-1 ring-primary-200 bg-primary-50/30"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={clsx(
                                                    "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all",
                                                    isToday ? "bg-primary-600 text-white shadow-lg shadow-primary-200" :
                                                        isSelected ? "bg-primary-500 text-white" : "text-secondary-600 group-hover:text-primary-600"
                                                )}>
                                                    {dayNum}
                                                </span>
                                                {dayEvents.length > 1 && (
                                                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-600 text-[10px] font-black">
                                                        {dayEvents.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Event Indicators (Desktop) */}
                                            <div className="flex-1 mt-2 space-y-1 hidden sm:block overflow-hidden">
                                                {dayEvents.slice(0, 2).map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className={clsx(
                                                            "px-2 py-1 rounded-lg text-[10px] font-bold truncate leading-tight transition-all",
                                                            getEventTypeColor(event.eventType)
                                                        )}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-[10px] font-bold text-secondary-400 pl-2">+{dayEvents.length - 2} more</div>
                                                )}
                                            </div>

                                            {/* Mini Indicators (Mobile) */}
                                            <div className="mt-auto flex justify-center gap-1 sm:hidden pb-1">
                                                {dayEvents.slice(0, 3).map((_, idx) => (
                                                    <div key={idx} className="h-1 w-1 rounded-full bg-primary-400" />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Next Month Buffer */}
                                {[...Array((7 - (firstDayOfMonth + daysInMonth) % 7) % 7)].map((_, i) => (
                                    <div key={`next-${i}`} className="aspect-square sm:aspect-auto sm:h-32 rounded-2xl sm:rounded-3xl border border-secondary-100/30 bg-secondary-100/10 flex items-center justify-center opacity-30 select-none">
                                        <span className="text-xs font-black text-secondary-400">{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details - comes first on mobile */}
                <div className="lg:col-span-4 flex flex-col gap-8 order-1 lg:order-2">
                    {/* Focus Date Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-secondary-200/30 border border-secondary-100 overflow-hidden group/details">
                        <div className="bg-primary-600 px-8 py-8 text-white">
                            <h4 className="text-primary-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Today's Agenda</h4>
                            <div className="flex items-end gap-3">
                                <span className="text-6xl font-black leading-none text-white">{selectedDate?.getDate() || '--'}</span>
                                <div className="mb-1">
                                    <div className="text-lg font-black leading-tight text-white">{selectedDate ? monthNames[selectedDate.getMonth()] : '--'}</div>
                                    <div className="text-sm font-bold text-primary-200 opacity-80">{selectedDate?.getFullYear() || '----'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h5 className="text-secondary-400 text-[11px] font-black uppercase tracking-widest">Planned Events</h5>
                                <span className="bg-primary-50 text-primary-600 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{selectedDayEvents.length} Items</span>
                            </div>

                            <div className="space-y-4">
                                {selectedDayEvents.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center text-center">
                                        <div className="h-20 w-20 bg-secondary-50 rounded-[2rem] flex items-center justify-center mb-4 transition-transform group-hover/details:scale-110 duration-500">
                                            <CalendarIcon className="h-10 w-10 text-secondary-200" />
                                        </div>
                                        <p className="text-sm font-bold text-secondary-400 leading-tight px-8">No activities scheduled for this date.</p>
                                    </div>
                                ) : (
                                    selectedDayEvents.map(event => (
                                        <div key={event.id} className="group relative bg-white rounded-3xl p-5 border border-secondary-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/30 transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border",
                                                    getEventTypeColor(event.eventType)
                                                )}>
                                                    {event.eventType || 'GENERAL'}
                                                </span>
                                                {isAdmin && (
                                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setEditingEvent(event)}
                                                            className="p-2 bg-secondary-50 hover:bg-primary-50 text-secondary-400 hover:text-primary-600 rounded-xl transition-all"
                                                        >
                                                            <PencilIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Delete this event permanently?')) {
                                                                    deleteMutation.mutate(event.id);
                                                                }
                                                            }}
                                                            className="p-2 bg-secondary-50 hover:bg-rose-50 text-secondary-400 hover:text-rose-600 rounded-xl transition-all"
                                                        >
                                                            <TrashIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <h6 className="font-black text-secondary-900 mb-1.5 leading-tight group-hover:text-primary-600 transition-colors uppercase tracking-tight">{event.title}</h6>
                                            <p className="text-xs text-secondary-500 leading-relaxed line-clamp-2">{event.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Upcoming List */}
                    <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-secondary-900/40 relative overflow-hidden order-last lg:order-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-10 -mt-10" />

                        <div className="relative mb-6">
                            <h4 className="text-primary-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Coming Up</h4>
                            <h3 className="text-xl font-black text-white">Quick Timeline</h3>
                        </div>

                        <div className="relative space-y-6">
                            {events && events
                                .filter(e => new Date(e.eventDate).getTime() >= new Date().setHours(0, 0, 0, 0))
                                .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                                .slice(0, 4)
                                .map((event, idx) => (
                                    <div
                                        key={event.id}
                                        onClick={() => {
                                            const d = new Date(event.eventDate);
                                            setCurrentDate(d);
                                            setSelectedDate(d);
                                        }}
                                        className="flex gap-4 group cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="h-11 w-11 rounded-2xl bg-white/10 flex flex-col items-center justify-center border border-white/10 group-hover:bg-primary-500 group-hover:border-primary-400 transition-all duration-300 shadow-lg">
                                                <span className="text-[10px] font-black text-white group-hover:text-white leading-none mb-0.5 uppercase drop-shadow-sm opacity-80">
                                                    {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="text-sm font-black leading-none text-white">{new Date(event.eventDate).getDate()}</span>
                                            </div>
                                            {idx !== 3 && <div className="w-0.5 h-8 bg-white/10 my-1 group-hover:bg-primary-500/30 transition-all" />}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h6 className="text-[11px] font-black uppercase tracking-wider text-primary-400 mb-1">Upcoming Event</h6>
                                            <h5 className="font-bold text-sm text-secondary-50 truncate group-hover:text-white transition-colors tracking-tight">{event.title}</h5>
                                        </div>
                                    </div>
                                ))}

                            {(!events || events.filter(e => new Date(e.eventDate).getTime() >= new Date().setHours(0, 0, 0, 0)).length === 0) && (
                                <p className="text-xs text-secondary-500 italic text-center py-4">Timeline is clear...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EventModal
                isOpen={isAddModalOpen || !!editingEvent}
                onClose={() => { setIsAddModalOpen(false); setEditingEvent(null); }}
                onSubmit={(data: any) => {
                    if (editingEvent) {
                        updateMutation.mutate({ id: editingEvent.id, data });
                    } else {
                        createMutation.mutate(data);
                    }
                }}
                event={editingEvent}
                chapters={chapters}
            />
        </div >
    );
}

function EventModal({ isOpen, onClose, onSubmit, event, chapters }: any) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: 'MEETING',
        chapterId: '',
        eventDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                eventType: event.eventType || 'MEETING',
                chapterId: event.chapterId?.toString() || '',
                eventDate: event.eventDate || new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData({
                title: '',
                description: '',
                eventType: 'MEETING',
                chapterId: '',
                eventDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [event, isOpen]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event ? "Manage Schedule" : "New Event Entry"}>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...formData, chapterId: formData.chapterId ? Number(formData.chapterId) : null }); }} className="space-y-6 pt-4">
                <div className="space-y-5">
                    <Input
                        label="Event Name"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Annual Strategy Summit"
                        className="rounded-2xl"
                    />

                    <div>
                        <label className="block text-sm font-black text-secondary-700 uppercase tracking-widest mb-2">Description & Venue</label>
                        <textarea
                            name="description"
                            className="block w-full rounded-2xl border-secondary-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-50 sm:text-sm min-h-[100px] transition-all"
                            placeholder="Add timing, location or virtual link..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Scheduled Date"
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            required
                            className="rounded-2xl"
                        />
                        <div>
                            <label className="block text-sm font-black text-secondary-700 uppercase tracking-widest mb-2">Category</label>
                            <select
                                name="eventType"
                                className="block w-full rounded-2xl border-secondary-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-500 py-3 transition-all"
                                value={formData.eventType}
                                onChange={handleChange}
                            >
                                <option value="MEETING">Association Meeting</option>
                                <option value="SOCIAL_EVENT">Social Gathering</option>
                                <option value="WORKSHOP">Professional Workshop</option>
                                <option value="AGM">Annual General Meeting</option>
                                <option value="FESTIVAL">Cultural Festival</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-secondary-700 uppercase tracking-widest mb-2">Host Chapter</label>
                        <select
                            name="chapterId"
                            className="block w-full rounded-2xl border-secondary-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-500 py-3 transition-all"
                            value={formData.chapterId}
                            onChange={handleChange}
                        >
                            <option value="">Central Organization (Global)</option>
                            {chapters?.map((ch: any) => <option key={ch.id} value={ch.id}>{ch.chapterName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-secondary-100">
                    <Button variant="outline" onClick={onClose} className="rounded-2xl px-6 py-2.5 font-bold uppercase tracking-wider text-xs">
                        Discard
                    </Button>
                    <Button type="submit" className="rounded-2xl px-8 py-2.5 font-black uppercase tracking-wider text-xs shadow-xl shadow-primary-500/20">
                        {event ? "Save Changes" : "Confirm Schedule"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
