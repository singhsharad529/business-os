import React from 'react';
import { useToast, Toast as ToastType } from '../../hooks/useToast';
import { cn } from '../../lib/utils';
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';

const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    danger: <AlertCircle className="w-5 h-5 text-danger" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-primary" />,
};

const bgColors = {
    success: 'bg-success/10 border-success/20',
    danger: 'bg-danger/10 border-danger/20',
    warning: 'bg-warning/10 border-warning/20',
    info: 'bg-primary/10 border-primary/20',
};

export const Toaster: React.FC = () => {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
            ))}
        </div>
    );
};

interface ToastItemProps {
    toast: ToastType;
    onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    return (
        <div
            className={cn(
                "pointer-events-auto flex items-center gap-3 p-4 rounded-xl border glass-morphism animate-blur-zoom-in",
                bgColors[toast.type]
            )}
        >
            <div className="flex-shrink-0">
                {icons[toast.type]}
            </div>
            <div className="flex-1 text-sm font-medium text-text-main">
                {toast.message}
            </div>
            <button
                onClick={onDismiss}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-text-muted hover:text-text-main"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
