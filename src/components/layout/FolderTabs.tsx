"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { label: "Compose",    href: "/build"     },
  { label: "Spark",      href: "/generate"  },
  { label: "References", href: "/style"     },
  { label: "Prompts",    href: "/saved"     },
] as const;

export default function FolderTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="relative z-10 flex-shrink-0 flex flex-row items-end px-4 pt-3 gap-1 bg-sky-blue"
      aria-label="App navigation"
    >
      {TABS.map(({ label, href }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "relative w-auto px-5 min-h-[44px]",
              "flex items-center justify-center",
              "rounded-t-xl rounded-b-none",
              "text-xs font-body tracking-wide whitespace-nowrap",
              "transition-all duration-150",
              isActive
                ? [
                    "bg-paper text-ink font-semibold",
                    "-translate-y-0.5",
                    "shadow-tab",
                    "z-10",
                  ]
                : [
                    "bg-paper-dark text-ink-muted font-normal",
                    "translate-y-0",
                    "hover:bg-paper/60 hover:text-ink",
                  ]
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
