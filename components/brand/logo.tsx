// SiteCraft mark: two interlocking open frames forming an "S" (brand guide v1).
// Redrawn from the guidelines; swap in the master SVG when it arrives, keep the props.
import { cn } from "@/lib/utils";

export const MARK_PATHS = {
  top: "M13.2 3 31.2 3 29.1 9.5 17.6 9.5 15.2 17 8.7 17Z",
  bottom: "M18.8 29 0.8 29 2.9 22.5 14.4 22.5 16.8 15 23.3 15Z",
  shadeTop: "M9.8 13.5 16.3 13.5 15.2 17 8.7 17Z",
  shadeBottom: "M22.2 18.5 15.7 18.5 16.8 15 23.3 15Z",
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-7", className)}>
      <path d={MARK_PATHS.top} fill="#19C37D" />
      <path d={MARK_PATHS.bottom} fill="#19C37D" />
      <path d={MARK_PATHS.shadeTop} fill="#12915C" />
      <path d={MARK_PATHS.shadeBottom} fill="#12915C" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-xl font-semibold tracking-[-0.03em] text-phosphor">SiteCraft</span>
    </span>
  );
}
