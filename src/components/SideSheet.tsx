import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function SideSheet({ isOpen, onClose, title, children, size = 'md' }: SideSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const widthClasses = {
    sm: 'w-96',
    md: 'w-[600px]',
    lg: 'w-[800px]',
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 inset-0 bg-black/20 z-50 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 bottom-0 ${widthClasses[size]} bg-surface z-50 shadow-2xl transform transition-transform duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-bg">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}
