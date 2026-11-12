'use client';

import { createContext, useContext, ReactNode, useCallback, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PageId, Toast } from "@/types";
import { generateId } from "@/constants";

// ─── Context shape ─────────────────────────────────────────────────────────
// AppContext is now a lean UI-state provider.
// All data (income, expenses, savings, debts, etc.) is fetched via
// TanStack Query hooks (src/hooks/) backed by the REST API.
// AppContext only manages: current page and toast notifications.
interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useLocalStorage<PageId>("budgetwise_page", "dashboard");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Toasts ─────────────────────────────────────────────────────────────
  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 4000 };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}