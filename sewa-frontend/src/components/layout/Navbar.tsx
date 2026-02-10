import { Link, useLocation } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { useAuth } from '../../auth/AuthProvider';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Organization', href: '/organization' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const location = useLocation();
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    return (
        <Disclosure as="nav" className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center gap-3">
                                    {/* Placeholder Logo */}
                                    <div className="h-10 w-10 bg-primary-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        S
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-primary-900 tracking-tight leading-none">SEWA</span>
                                        <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase hidden sm:block">Santal Engineers Welfare Association</span>
                                    </div>
                                </div>
                                <div className="hidden lg:ml-10 lg:flex lg:space-x-8 items-center">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={cn(
                                                location.pathname === item.href
                                                    ? 'border-primary-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 h-full'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden lg:ml-6 lg:flex lg:items-center space-x-4">
                                {!isLoading && isAuthenticated && user && location.pathname.startsWith('/dashboard') ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-secondary-700">{user.username}</span>
                                        <Button variant="ghost" size="sm" onClick={() => logout()}>Logout</Button>
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/login">
                                            <Button variant="ghost" size="sm">Log in</Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button size="sm">Register</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="-mr-2 flex items-center lg:hidden">
                                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="lg:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    className={cn(
                                        location.pathname === item.href
                                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                            <div className="border-t border-gray-200 pt-4 pb-3">
                                <div className="space-y-1 px-4 flex flex-col gap-2">
                                    {!isLoading && isAuthenticated && user && location.pathname.startsWith('/dashboard') ? (
                                        <>
                                            <div className="px-2 py-2 text-sm text-secondary-700">{user.username}</div>
                                            <Button variant="outline" className="w-full justify-center" onClick={() => logout()}>Logout</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="w-full">
                                                <Button variant="outline" className="w-full justify-center">Log in</Button>
                                            </Link>
                                            <Link to="/register" className="w-full">
                                                <Button className="w-full justify-center">Register</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
