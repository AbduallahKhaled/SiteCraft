"use client";
// From the 21st.dev IntegrationCard. Changes: SiteCraft mark in the center,
// lime path glow, tool labels for screen readers, Card from shadcn.
import { createContext, useContext, useId, useState } from "react";
import { motion } from "motion/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LogoMark } from "@/components/brand/logo";

interface VisualContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface CardCopy {
  title: string;
  body: string;
}

interface IntegrationCardProps {
  visual: React.ReactNode;
  title: string;
  description: string;
  url: string;
  cta?: string;
  /** Copy shown in place of title/description while a tool icon is hovered, keyed by integration id. */
  tools?: Record<string, CardCopy>;
}

// Which tool icon is hovered, shared between the visual and the card text.
const ActiveToolContext = createContext<{ active: string | null; setActive: (id: string | null) => void }>({
  active: null,
  setActive: () => {},
});

interface IntegrationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
  path: string;
  delay: number;
}

const FigmaLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 28" fill="none" className={className}>
    <path
      d="M9.19782 13.7949C9.19782 7.6656 18.3948 7.6656 18.3948 13.7949C18.3948 19.9242 9.19782 19.9242 9.19782 13.7949ZM0.000862536 22.9918C0.000522523 22.3879 0.119222 21.7899 0.350175 21.2318C0.581128 20.6738 0.919805 20.1668 1.34684 19.7398C1.77388 19.3127 2.2809 18.9741 2.83891 18.7431C3.39692 18.5122 3.99499 18.3935 4.59891 18.3938H9.19695V22.9918C9.19695 29.1211 0 29.1211 0 22.9918H0.000862536ZM9.19782 -0.000113647V9.19684H13.7959C19.9252 9.19684 19.9252 -0.000113647 13.7959 -0.000113647H9.19782ZM0.000862536 4.59793C0.000522523 5.20185 0.119222 5.79992 0.350175 6.35793C0.581128 6.91594 0.919805 7.42296 1.34684 7.85C1.77388 8.27704 2.2809 8.61571 2.83891 8.84667C3.39692 9.07762 3.99499 9.19632 4.59891 9.19598H9.19695V-0.000975834H4.59891C3.99499 -0.00131585 3.39692 0.117384 2.83891 0.348337C2.2809 0.57929 1.77388 0.917967 1.34684 1.345C0.919805 1.77204 0.581128 2.27906 0.350175 2.83707C0.119222 3.39509 0.000522523 3.99315 0.000862536 4.59707V4.59793ZM0.000862536 13.7949C0.000522523 14.3988 0.119222 14.9969 0.350175 15.5549C0.581128 16.1129 0.919805 16.6199 1.34684 17.047C1.77388 17.474 2.2809 17.8127 2.83891 18.0436C3.39692 18.2746 3.99499 18.3941 4.59891 18.3938H9.19695V9.19598H4.59891C3.99499 9.19564 3.39692 9.31434 2.83891 9.54529C2.2809 9.77624 1.77388 10.1149 1.34684 10.542C0.919805 10.969 0.581128 11.476 0.350175 12.034C0.119222 12.592 0.000522523 13.1901 0.000862536 13.794V13.7949Z"
      fill="currentColor"
    />
  </svg>
);

const NextLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className={className}>
    <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9v10M10 9l9.5 12.2M18 9v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ShadcnLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="none" className={className}>
    <path
      d="M22.5551 13.4553L13.4551 22.5553M20.7351 3.44531L3.44507 20.7353"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const ReactLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className={className}>
    <ellipse cx="14" cy="14" rx="11" ry="4.3" stroke="currentColor" strokeWidth="1.3" />
    <ellipse cx="14" cy="14" rx="11" ry="4.3" stroke="currentColor" strokeWidth="1.3" transform="rotate(60 14 14)" />
    <ellipse cx="14" cy="14" rx="11" ry="4.3" stroke="currentColor" strokeWidth="1.3" transform="rotate(-60 14 14)" />
    <circle cx="14" cy="14" r="2.1" fill="currentColor" />
  </svg>
);

const MotionLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className={className}>
    <path
      d="M10.5829 8.74902L5.04503 19.2503H0L4.32469 11.0509C4.99494 9.77912 6.66706 8.74902 8.0605 8.74902H10.5829ZM22.955 11.3747C22.955 9.92415 24.0842 8.74924 25.4774 8.74924C26.8706 8.74924 28 9.92393 28 11.3747C28 12.8248 26.8708 13.9997 25.4774 13.9997C24.0842 13.9997 22.955 12.8252 22.955 11.3747ZM11.5288 8.74902H16.5738L11.0359 19.2503H5.99091L11.5288 8.74902ZM17.4871 8.74902H22.5321L18.209 16.9484C17.5385 18.2202 15.8651 19.2503 14.4718 19.2503H11.9492L17.4871 8.74902Z"
      fill="currentColor"
    />
  </svg>
);

const TailwindLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className={className}>
    <path
      d="M7 11.1927C7.93308 7.44991 10.2669 5.57812 14 5.57812C19.6 5.57812 20.3 9.78906 23.1 10.4909C24.9669 10.959 26.6 10.2572 28 8.3854C27.0669 12.1282 24.7331 14 21 14C15.4 14 14.7 9.78906 11.9 9.08726C10.0331 8.61913 8.4 9.32094 7 11.1927ZM0 19.6146C0.933078 15.8718 3.26692 14 7 14C12.6 14 13.3 18.2109 16.1 18.9127C17.9669 19.3809 19.6 18.6791 21 16.8073C20.0669 20.5501 17.7331 22.4219 14 22.4219C8.4 22.4219 7.7 18.2109 4.9 17.5091C3.03308 17.041 1.4 17.7428 0 19.6146Z"
      fill="currentColor"
    />
  </svg>
);

// Center is 282, 205
const integrations: IntegrationItem[] = [
  { id: "figma", label: "Figma", icon: FigmaLogo, x: 110, y: 90, path: "M 270 205 V 105 Q 270 90 255 90 H 110", delay: 0.1 },
  { id: "next", label: "Next.js", icon: NextLogo, x: 360, y: 70, path: "M 294 205 V 85 Q 294 70 309 70 H 360", delay: 0.2 },
  { id: "shadcn", label: "shadcn/ui", icon: ShadcnLogo, x: 160, y: 205, path: "M 250 205 H 160", delay: 0.3 },
  { id: "react", label: "React", icon: ReactLogo, x: 480, y: 205, path: "M 314 205 H 480", delay: 0.4 },
  { id: "motion", label: "Motion", icon: MotionLogo, x: 282, y: 360, path: "M 282 205 V 360", delay: 0.6 },
  { id: "tailwind", label: "Tailwind CSS", icon: TailwindLogo, x: 460, y: 340, path: "M 314 215 V 325 Q 314 340 329 340 H 460", delay: 0.7 },
];

const AnimatedPath = ({ d, id, delay }: { d: string; id: string; delay: number }) => (
  <>
    <path d={d} stroke="currentColor" strokeWidth="1" fill="none" className="text-circuit" />
    <motion.path
      d={d}
      stroke={`url(#${id})`}
      strokeWidth="2"
      fill="none"
      strokeDasharray="40 160"
      initial={{ strokeDashoffset: 200 }}
      animate={{ strokeDashoffset: -200 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: delay * 2.5 }}
    />
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor="#19c37d" stopOpacity="0.9" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </>
);

export function Integration() {
  const containerId = useId().replace(/:/g, "");
  const { active, setActive } = useContext(ActiveToolContext);

  return (
    <div className="relative h-full w-full">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 564 410" fill="none" aria-hidden>
        {integrations.map((integration) => (
          <AnimatedPath
            key={integration.id}
            d={integration.path}
            id={`${containerId}-${integration.id}`}
            delay={integration.delay}
          />
        ))}
      </svg>

      <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-circuit bg-black p-0.5 sm:rounded-2xl sm:p-2">
        <div className="rounded-lg border border-hairline p-1 sm:rounded-xl sm:p-2.5">
          <LogoMark className="size-5 sm:size-9" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-lime/30 sm:rounded-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {integrations.map((integration) => {
        const Icon = integration.icon;
        const isActive = active === integration.id;
        return (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: integration.delay }}
            style={{ left: `${(integration.x / 564) * 100}%`, top: `${(integration.y / 410) * 100}%` }}
            className={cn(
              "absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center rounded-lg border bg-ground text-phosphor outline-none transition-[border-color,box-shadow] duration-200 sm:h-12 sm:w-12 sm:rounded-xl md:h-13.5 md:w-13.5",
              isActive ? "border-lime/60 shadow-[0_0_18px_-4px] shadow-lime/50" : "border-circuit"
            )}
            tabIndex={0}
            onPointerEnter={() => setActive(integration.id)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(integration.id)}
            onBlur={() => setActive(null)}
          >
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
            <span className="sr-only">{integration.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function VisualContainer({ children, className }: VisualContainerProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-564/460 w-full items-center justify-center overflow-hidden bg-[#0b0f0b] p-8 sm:aspect-564/410",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, #485346 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ground/70 from-10% via-transparent to-ground/70 to-90%" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">{children}</div>
    </div>
  );
}

export const IntegrationCard = ({ visual, title, description, url, cta = "Learn more", tools = {} }: IntegrationCardProps) => {
  const [active, setActive] = useState<string | null>(null);
  // Every variant sits in the same grid cell, so the card is as tall as the longest one and never jumps.
  const variants: [string | null, CardCopy][] = [[null, { title, body: description }], ...Object.entries(tools)];
  const shown = active && tools[active] ? active : null;

  return (
  <ActiveToolContext.Provider value={{ active, setActive }}>
  <Card className="mx-auto flex w-full flex-col gap-0 overflow-hidden rounded-2xl border border-circuit bg-ground p-0 ring-0 sm:max-w-141">
    <VisualContainer>{visual}</VisualContainer>
    <CardContent className="flex flex-col gap-6 p-6 sm:gap-8 sm:p-8">
      <div className="grid" aria-live="polite">
        {variants.map(([id, copy]) => {
          const visible = id === shown;
          return (
            <div
              key={id ?? "default"}
              aria-hidden={!visible}
              className={cn(
                "col-start-1 row-start-1 flex flex-col gap-2 transition-[opacity,translate] duration-300 ease-out",
                visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
              )}
            >
              <h3 className="text-xl tracking-[-0.013em] sm:text-2xl">{copy.title}</h3>
              <p className="text-base leading-relaxed text-sage">{copy.body}</p>
            </div>
          );
        })}
      </div>
      <ButtonPrimitive
        nativeButton={false}
        className="inline-flex h-10 w-fit items-center rounded-full border border-circuit px-5 text-sm font-medium text-fern transition-colors hover:border-moss hover:text-phosphor"
        render={<a href={url} />}
      >
        {cta}
      </ButtonPrimitive>
    </CardContent>
  </Card>
  </ActiveToolContext.Provider>
  );
};

export default IntegrationCard;
