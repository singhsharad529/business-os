import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: AlertDialogProps) {
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

    if (!isOpen) return null;

    const variantClasses = {
        danger: {
            iconBg: 'bg-danger-soft text-danger',
            confirmBtn: 'btn-danger bg-danger text-white hover:bg-danger/90',
        },
        warning: {
            iconBg: 'bg-warning-soft text-warning',
            confirmBtn: 'btn-warning bg-warning text-white hover:bg-warning/90',
        },
        info: {
            iconBg: 'bg-primary-soft text-primary',
            confirmBtn: 'btn-primary bg-primary text-white hover:bg-primary/90',
        },
    };

    const currentVariant = variantClasses[variant];

    return (
        <div className="fixed inset-0 z-[400] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Dialog Position */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Dialog Panel */}
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-border-subtle animate-in fade-in zoom-in duration-200">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${currentVariant.iconBg}`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-text-main leading-6">
                                    {title}
                                </h3>
                                {!isLoading && (
                                    <button
                                        onClick={onClose}
                                        className="p-1 hover:bg-bg-muted rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-text-muted" />
                                    </button>
                                )}
                            </div>

                            <div className="mt-2">
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                        <button
                            type="button"
                            className="btn btn-secondary px-6 py-2 rounded-xl font-medium"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${currentVariant.confirmBtn}`}
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
