"use client";

import { AppProvider } from "@/lib/AppContext";
import BottomNav from "@/components/layout/BottomNav";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <main className="flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
      {/* Spacer keeps main height correct; BottomNav is fixed and sits over it */}
      <div className="h-16 flex-shrink-0" aria-hidden="true" />
      <BottomNav />
    </AppProvider>
  );
}
