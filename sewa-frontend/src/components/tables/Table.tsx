import type { ReactNode } from "react";
import clsx from "clsx";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string; // Additional classes for the cell
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string | number;
    isLoading?: boolean;
}

export function Table<T>({ data, columns, keyExtractor, isLoading }: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto ring-1 ring-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={clsx(
                                    "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-3 py-4 text-sm text-center text-gray-500">
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={keyExtractor(row)}>
                                {columns.map((col, index) => (
                                    <td
                                        key={index}
                                        className={clsx(
                                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                                            col.className
                                        )}
                                    >
                                        {typeof col.accessor === "function"
                                            ? col.accessor(row)
                                            : (row[col.accessor] as ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
