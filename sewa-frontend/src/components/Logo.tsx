import { Link } from 'react-router-dom';

const LOGO_URL = "https://raw.githubusercontent.com/DakhinTudu/sewa-assets/main/sewa-logo.png";

interface LogoProps {
  className?: string;
  variant?: 'icon' | 'full';
  linkTo?: string;
}

export function Logo({ className = 'h-10 w-auto', variant = 'icon', linkTo = '/' }: LogoProps) {
  const iconClass = variant === 'full' ? 'h-10 w-auto object-contain' : `${className} object-contain`;
  
  const icon = (
    <img 
      src={LOGO_URL} 
      alt="SEWA Logo" 
      className={iconClass} 
    />
  );

  const content = variant === 'full' ? (
    <span className="inline-flex items-center gap-3">
      {icon}
      <span className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-primary-900 tracking-tight">SEWA</span>
        <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase hidden sm:block">
          Santal Engineers Welfare Association
        </span>
      </span>
    </span>
  ) : icon;

  return linkTo ? (
    <Link to={linkTo} className="flex items-center flex-shrink-0 focus:outline-none rounded shrink-0">
      {content}
    </Link>
  ) : (
    <span className="flex items-center flex-shrink-0">{content}</span>
  );
}
