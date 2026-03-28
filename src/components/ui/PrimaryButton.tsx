"use client";

import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  className,
  type = "button",
}: PrimaryButtonProps) {
  const inactive = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={inactive}
      className={cn(
        "btn-primary text-sm",
        inactive
          ? "opacity-40 cursor-not-allowed pointer-events-none"
          : "active:scale-95",
        className
      )}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          {children}
          <LoadingDots />
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      <span
        className="w-[3px] h-[3px] rounded-full bg-white/60"
        style={{ animation: "dot-pulse 1.4s ease-in-out infinite", animationDelay: "0ms" }}
      />
      <span
        className="w-[3px] h-[3px] rounded-full bg-white/60"
        style={{ animation: "dot-pulse 1.4s ease-in-out infinite", animationDelay: "200ms" }}
      />
      <span
        className="w-[3px] h-[3px] rounded-full bg-white/60"
        style={{ animation: "dot-pulse 1.4s ease-in-out infinite", animationDelay: "400ms" }}
      />
    </span>
  );
}
