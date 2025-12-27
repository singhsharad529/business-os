import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-[500] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Position */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal Panel */}
                <div
                    className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-border-subtle animate-in fade-in zoom-in duration-200`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-text-main leading-6">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-bg-alt rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>

                    <div className="mt-2">{children}</div>
                </div>
            </div>
        </div>
    );
}
