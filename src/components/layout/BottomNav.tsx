"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";

const TABS = [
  { label: "Spark",      href: "/spark",      icon: "✦" },
  { label: "References", href: "/references", icon: "◈" },
  { label: "Keeps",      href: "/prompts",    icon: "♡" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-row
                 bg-paper border-t border-ink/[0.08] h-16"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="App navigation"
    >
      {TABS.map(({ label, href, icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-0.5 relative",
              "transition-colors duration-150",
              isActive ? "text-ink" : "text-ink/35"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className={clsx("leading-none", isActive ? "text-base" : "text-sm opacity-50")}>{icon}</span>
            <span className={clsx(
              "font-body text-[9px] tracking-wide uppercase",
              isActive ? "font-medium" : "font-normal"
            )}>
              {label}
            </span>
            {isActive && (
              <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-ink mt-0.5" />
            )}
          </Link>
        );
      })}

      {/* Theme toggle — right of tabs, fixed width */}
      <div className="w-12 flex items-center justify-center border-l border-ink/[0.06]">
        <ThemeToggle />
      </div>
    </nav>
  );
}
