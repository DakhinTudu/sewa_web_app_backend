import clsx from 'clsx';

export type StatusType = 'ACTIVE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE' | 'PAID' | 'FAILED' | 'OVERDUE' | string;

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
    showLabel?: boolean;
}

export function StatusBadge({ status, className, showLabel = true }: StatusBadgeProps) {
    const dotStyles: Record<string, string> = {
        ACTIVE: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]',
        PAID: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]',
        APPROVED: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]',
        PENDING: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]',
        REJECTED: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
        FAILED: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
        OVERDUE: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
        INACTIVE: 'bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.3)]',
    };

    const s = status.toUpperCase();

    return (
        <div className={clsx('flex items-center lg:gap-2', className)} title={status}>
            <span className={clsx('h-2.5 w-2.5 rounded-full flex-shrink-0 transition-transform hover:scale-125', dotStyles[s] || 'bg-gray-400')} />
            {showLabel && (
                <span className="hidden lg:inline text-[10px] font-bold text-secondary-500 uppercase tracking-tight">
                    {status}
                </span>
            )}
        </div>
    );
}
