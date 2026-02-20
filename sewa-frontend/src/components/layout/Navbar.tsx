import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { useAuth } from '../../auth/AuthProvider';
import { Logo } from '../Logo';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Organization', href: '/organization' },
    { name: 'Notices', href: '/notices' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Disclosure as="nav" className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            {({ open, close }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-14 min-h-[3.5rem] sm:h-16 justify-between items-center">
                            <div className="flex items-center min-w-0">
                                <Logo variant="full" />
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
                                {!isLoading && isAuthenticated && user ? (
                                    <div className="flex items-center gap-3">
                                        <Link to="/dashboard">
                                            <span className="text-sm text-secondary-700 hover:text-primary-600">{user.username}</span>
                                        </Link>
                                        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
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
                                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-3 min-h-[44px] min-w-[44px] text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 touch-manipulation">
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
                                    {!isLoading && isAuthenticated && user ? (
                                        <>
                                            <DisclosureButton as={Link} to="/dashboard" className="px-2 py-2 text-sm text-secondary-700 font-medium block">Dashboard</DisclosureButton>
                                            <div className="px-2 py-1 text-sm text-gray-500">{user.username}</div>
                                            <Button variant="outline" className="w-full justify-center min-h-[44px]" onClick={() => { handleLogout(); close(); }}>Logout</Button>
                                        </>
                                    ) : (
                                        <>
                                            <DisclosureButton as={Link} to="/login" className="w-full">
                                                <Button variant="outline" className="w-full justify-center min-h-[44px]">Log in</Button>
                                            </DisclosureButton>
                                            <DisclosureButton as={Link} to="/register" className="w-full">
                                                <Button className="w-full justify-center min-h-[44px]">Register</Button>
                                            </DisclosureButton>
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
