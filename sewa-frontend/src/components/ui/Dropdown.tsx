import React, { Fragment } from 'react';
import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

export interface DropdownItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger';
}

export interface DropdownProps {
    label?: React.ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
    icon?: React.ReactNode;
    minimal?: boolean; // If true, only shows icon without label text style
}

export function Dropdown({ label, items, align = 'right', icon, minimal = false }: DropdownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                {minimal ? (
                    <MenuButton className="flex items-center rounded-full bg-gray-100 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Open options</span>
                        {icon || <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />}
                    </MenuButton>
                ) : (
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {label}
                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </MenuButton>
                )}
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems
                    className={cn(
                        "absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                        align === 'right' ? "right-0" : "left-0"
                    )}
                >
                    <div className="py-1">
                        {items.map((item, index) => (
                            <MenuItem key={index}>
                                {({ focus }) => (
                                    item.href ? (
                                        <Link
                                            to={item.href}
                                            className={cn(
                                                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'group flex items-center px-4 py-2 text-sm'
                                            )}
                                        >
                                            {item.icon && <span className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500">{item.icon}</span>}
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={item.onClick}
                                            className={cn(
                                                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                item.variant === 'danger' ? 'text-red-700 hover:text-red-900' : '',
                                                'group flex w-full items-center px-4 py-2 text-sm'
                                            )}
                                        >
                                            {item.icon && <span className={cn("mr-3 h-5 w-5", item.variant === 'danger' ? "text-red-500" : "text-gray-400 group-hover:text-gray-500")}>{item.icon}</span>}
                                            {item.label}
                                        </button>
                                    )
                                )}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}
