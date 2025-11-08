import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AuroraBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  containerClassName?: string;
};

export function AuroraBackground({
  className,
  children,
  containerClassName,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full overflow-hidden bg-neutral-950 px-6 py-24",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,255,0.16),transparent_60%)]" />
        <div
          className="animate-aurora absolute left-[8%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.45),rgba(59,130,246,0)_65%)] blur-3xl mix-blend-screen will-change-transform"
          style={{ animationDuration: "26s" }}
        />
        <div
          className="animate-aurora absolute right-[6%] top-[-12%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.45),rgba(236,72,153,0)_65%)] blur-3xl mix-blend-screen will-change-transform"
          style={{ animationDelay: "-10s", animationDuration: "32s" }}
        />
        <div
          className="animate-aurora absolute left-1/2 top-[60%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.35),rgba(56,189,248,0)_65%)] blur-3xl mix-blend-screen will-change-transform"
          style={{ animationDelay: "-18s", animationDuration: "38s" }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.35),rgba(15,23,42,0)_70%)]" />
      <div
        className={cn(
          "relative z-10 w-full max-w-4xl text-balance",
          containerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

