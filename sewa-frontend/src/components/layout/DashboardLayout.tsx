import { Fragment, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    UserIcon,
    UsersIcon,
    BuildingLibraryIcon,
    DocumentTextIcon,
    CalendarIcon,
    ChatBubbleLeftRightIcon,
    CurrencyRupeeIcon,
    Cog6ToothIcon,
    EnvelopeIcon,
    ArrowRightOnRectangleIcon,
    BellAlertIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/AuthProvider';
import { Logo } from '../Logo';
import { announcementsApi } from '../../api/announcements.api';
import { communicationsApi } from '../../api/communications.api';
import { membersApi } from '../../api/members.api';

const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Membership', href: '/dashboard/membership', icon: UsersIcon },
    { name: 'Students', href: '/dashboard/students', icon: UsersIcon },
    { name: 'Chapters', href: '/dashboard/chapters', icon: BuildingLibraryIcon },
    { name: 'Contents', href: '/dashboard/contents', icon: DocumentTextIcon },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Payments', href: '/dashboard/payments', icon: CurrencyRupeeIcon },
    { name: 'Communications', href: '/dashboard/communications', icon: EnvelopeIcon },
    { name: 'Admin', href: '/dashboard/admin', icon: Cog6ToothIcon },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const { data: announcementsUnread = 0 } = useQuery({
        queryKey: ['announcements-unread-count'],
        queryFn: announcementsApi.getUnreadCount,
        enabled: !!user,
        retry: false,
    });
    const { data: communicationsReceivedUnread = 0 } = useQuery({
        queryKey: ['communications-received-unread-count'],
        queryFn: communicationsApi.getReceivedUnreadCount,
        enabled: !!user,
        retry: false,
    });
    const canSeePending = !!user && (user.roles?.includes('ROLE_SUPER_ADMIN') || user.roles?.includes('ROLE_ADMIN') || user.permissions?.includes('MEMBER_APPROVE'));
    const { data: pendingMembersPage } = useQuery({
        queryKey: ['pending-members-bell'],
        queryFn: () => membersApi.getPendingMembers(0, 5),
        enabled: canSeePending,
        retry: false,
    });
    const pendingCount = pendingMembersPage?.totalElements ?? 0;
    const totalUnreadCount = announcementsUnread + communicationsReceivedUnread + pendingCount;

    const navigation = baseNavigation;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>

                                    {/* Mobile Sidebar Component */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                        <div className="flex h-16 shrink-0 items-center gap-2">
                                            <Logo variant="full" linkTo="/dashboard" className="h-9 w-9" />
                                            <span className="text-lg font-bold text-primary-600">Portal</span>
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <Link
                                                                    to={item.href}
                                                                    onClick={() => setSidebarOpen(false)}
                                                                    className={clsx(
                                                                        location.pathname === item.href
                                                                            ? 'bg-gray-50 text-primary-600'
                                                                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                                                                    <item.icon
                                                                        className={clsx(
                                                                            location.pathname === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                                                                            'h-6 w-6 shrink-0'
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center gap-2">
                            <Logo variant="full" linkTo="/dashboard" className="h-9 w-9" />
                            <span className="text-lg font-bold text-primary-600 tracking-tight">Portal</span>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={clsx(
                                                        location.pathname === item.href
                                                            ? 'bg-gray-50 text-primary-600'
                                                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={clsx(
                                                            location.pathname === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                                                            'h-6 w-6 shrink-0 transition-colors'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-x-3 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                                        <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                                            <UserIcon className="h-5 w-5" />
                                        </div>
                                        <span className="truncate">{user?.username ?? 'User'}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-x-3 rounded-md px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 min-h-[44px]"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
                            <div className="hidden sm:block text-sm font-semibold leading-6 text-gray-900 truncate">
                                SEWA Dashboard
                            </div>
                            <Link
                                to="/dashboard/notifications"
                                className="relative rounded-md p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                                title="Notifications"
                            >
                                <span className="sr-only">Notifications</span>
                                <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
                                {totalUnreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                                        {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                                    </span>
                                )}
                            </Link>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[120px] md:max-w-[180px]">{user?.username}</span>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex items-center justify-center rounded-md p-2.5 sm:px-3 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium hover:text-primary-600 min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0"
                                    title="Logout"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                                    <span className="hidden sm:inline ml-0 sm:ml-1">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
