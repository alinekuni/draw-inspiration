"use client";

import { AppProvider } from "@/lib/AppContext";
import { I18nProvider } from "@/i18n";
import BottomNav from "@/components/layout/BottomNav";
import Toast from "@/components/ui/Toast";
import { useAppContext } from "@/lib/AppContext";

function ToastRenderer() {
  const { toast } = useAppContext();
  return <Toast message={toast?.message ?? null} type={toast?.type ?? "info"} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
    <AppProvider>
      <main className="flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
      <ToastRenderer />
      {/* Spacer keeps main height correct; BottomNav is fixed and sits over it */}
      <div className="flex-shrink-0" style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }} aria-hidden="true" />
      <BottomNav />
    </AppProvider>
    </I18nProvider>
  );
}
