/**
 * Dummy logo component. Replace with actual logo asset when available.
 * Usage: <Logo className="h-10 w-10" /> or <Logo variant="full" />
 */
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'icon' | 'full';
  linkTo?: string;
}

export function Logo({ className = 'h-10 w-10', variant = 'icon', linkTo = '/' }: LogoProps) {
  const iconClass = variant === 'full' ? 'h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0' : className;
  const icon = (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" fill="#164a35" />
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">
        S
      </text>
    </svg>
  );

  const content = variant === 'full' ? (
    <span className="inline-flex items-center gap-2">
      {icon}
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold text-primary-900 tracking-tight">SEWA</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase hidden sm:block">
          Santal Engineers Welfare Association
        </span>
      </span>
    </span>
  ) : icon;

  return linkTo ? (
    <Link to={linkTo} className="flex items-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">
      {content}
    </Link>
  ) : (
    <span className="flex items-center flex-shrink-0">{content}</span>
  );
}
