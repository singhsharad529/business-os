import { useState, useEffect } from "react";

export type ToastType = "success" | "danger" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastCount = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

const notify = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  success: (message: string, duration = 3000) => {
    const id = (toastCount++).toString();
    toasts.push({ id, type: "success", message, duration });
    notify();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  danger: (message: string, duration = 4000) => {
    const id = (toastCount++).toString();
    toasts.push({ id, type: "danger", message, duration });
    notify();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  warning: (message: string, duration = 3500) => {
    const id = (toastCount++).toString();
    toasts.push({ id, type: "warning", message, duration });
    notify();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  info: (message: string, duration = 3000) => {
    const id = (toastCount++).toString();
    toasts.push({ id, type: "info", message, duration });
    notify();
    setTimeout(() => toast.dismiss(id), duration);
    return id;
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    toasts: currentToasts,
    ...toast,
  };
}
