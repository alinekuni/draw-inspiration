import clsx from "clsx";

interface PaperCardProps {
  tilt?: "left" | "right" | "none";
  className?: string;
  children: React.ReactNode;
  withPaperclip?: boolean;
}

export default function PaperCard({
  tilt = "none",
  className,
  children,
  withPaperclip = false,
}: PaperCardProps) {
  return (
    <div
      className={clsx(
        "relative bg-paper rounded-xl p-6",
        "shadow-[0_4px_24px_rgba(26,24,20,0.08)]",
        tilt === "left" && "rotate-[-0.5deg]",
        tilt === "right" && "rotate-[0.5deg]",
        className
      )}
    >
      {withPaperclip && (
        <span className="absolute -top-5 right-5" aria-hidden="true">
          <Paperclip />
        </span>
      )}
      {children}
    </div>
  );
}

function Paperclip() {
  return (
    <svg
      width="14"
      height="38"
      viewBox="0 0 14 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer oval loop */}
      <path
        d="M7 2C4.24 2 2 4.24 2 7V29C2 33.42 5.58 37 10 37C14.42 37 18 33.42 18 29V5"
        stroke="#9E9790"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner return — creates the double-wire look */}
      <path
        d="M11 5V29C11 31.21 9.21 33 7 33C4.79 33 3 31.21 3 29V7C3 4.79 4.79 3 7 3C9.21 3 11 4.79 11 7V29"
        stroke="#9E9790"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
