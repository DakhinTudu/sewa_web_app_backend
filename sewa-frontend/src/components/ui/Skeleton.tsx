import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export function Skeleton({ className, width, height, circle, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gray-200",
                circle ? "rounded-full" : "rounded-md",
                className
            )}
            style={{
                width: width,
                height: height,
            }}
            {...props}
        />
    );
}
