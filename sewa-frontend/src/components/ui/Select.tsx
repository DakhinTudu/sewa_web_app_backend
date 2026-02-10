import { Fragment } from 'react';
import { Listbox, Transition, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/cn';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps {
    label?: string;
    options: SelectOption[];
    value?: SelectOption | null;
    onChange: (value: SelectOption) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export function Select({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    error,
    disabled,
    className
}: SelectProps) {
    return (
        <div className={cn("w-full space-y-1", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <Listbox value={value || undefined} onChange={onChange} disabled={disabled}>
                <div className="relative mt-1">
                    <ListboxButton className={cn(
                        "relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm shadow-sm",
                        error ? "border-red-500 focus:ring-red-500" : "",
                        disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "cursor-pointer"
                    )}>
                        <span className={cn("block truncate", !value ? "text-gray-400" : "text-gray-900")}>
                            {value ? value.label : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </ListboxButton>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {options.map((option, personIdx) => (
                                <ListboxOption
                                    key={personIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                                        }`
                                    }
                                    value={option}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {option.label}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Transition>
                </div>
            </Listbox>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
