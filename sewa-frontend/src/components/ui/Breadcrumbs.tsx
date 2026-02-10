import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbsProps {
    items?: BreadcrumbItem[]; // Optional, will try to generate from route if not provided
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const location = useLocation();

    // Auto-generate breadcrumbs if not provided
    const breadcrumbs = items || React.useMemo(() => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        return pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            // Simple capitalization for auto-generated labels
            const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
            return { label, href: to };
        });
    }, [location.pathname]);

    return (
        <nav className={cn("flex", className)} aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link to="/" className="text-gray-400 hover:text-gray-500">
                            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {breadcrumbs.map((page, index) => (
                    <li key={page.label}>
                        <div className="flex items-center">
                            <ChevronRightIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                            />
                            {page.href && index < breadcrumbs.length - 1 ? (
                                <Link
                                    to={page.href}
                                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    aria-current={undefined}
                                >
                                    {page.label}
                                </Link>
                            ) : (
                                <span
                                    className="ml-2 text-sm font-medium text-gray-700"
                                    aria-current="page"
                                >
                                    {page.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
