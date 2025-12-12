import { Boxes } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-1.5 flex items-center justify-center shadow-glow">
        <Boxes className={`${sizes[size]} text-white`} />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-text-main`}>
          BusinessOS
        </span>
      )}
    </div>
  );
}
