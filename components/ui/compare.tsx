"use client";
// From the Aceternity/21st.dev Compare component. Changes: accepts React content
// (firstContent / secondContent) as well as images, keyboard support, lime palette.
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DotsSixVertical } from "@phosphor-icons/react";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  firstContent?: React.ReactNode;
  secondContent?: React.ReactNode;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  label?: string;
  onChange?: (percent: number) => void;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  firstContent,
  secondContent,
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  label = "Comparison slider",
  onChange,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onChange?.(sliderXPercent);
  }, [sliderXPercent, onChange]);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;
      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };
    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    if (slideMode === "hover") setSliderXPercent(initialSliderPercentage);
    if (slideMode === "drag") setIsDragging(false);
    startAutoplay();
  }

  const handleMove = useCallback(
    (clientX: number, force = false) => {
      if (!sliderRef.current) return;
      if (force || slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = ((clientX - rect.left) / rect.width) * 100;
        requestAnimationFrame(() => setSliderXPercent(Math.max(0, Math.min(100, percent))));
      }
    },
    [slideMode, isDragging]
  );

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
        handleMove(clientX, true);
      }
    },
    [slideMode, handleMove]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") setIsDragging(false);
  }, [slideMode]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowRight") setSliderXPercent((p) => Math.min(100, p + step));
    else if (e.key === "ArrowLeft") setSliderXPercent((p) => Math.max(0, p - step));
    else if (e.key === "Home") setSliderXPercent(0);
    else if (e.key === "End") setSliderXPercent(100);
    else return;
    e.preventDefault();
    stopAutoplay();
  };

  return (
    <div
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderXPercent)}
      onKeyDown={onKeyDown}
      className={cn("h-[400px] w-[400px] overflow-hidden", className)}
      style={{
        position: "relative",
        cursor: slideMode === "drag" ? (isDragging ? "grabbing" : "grab") : "col-resize",
        touchAction: "pan-y",
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => !autoplay && handleStart(e.touches[0].clientX)}
      onTouchEnd={() => !autoplay && handleEnd()}
      onTouchMove={(e) => !autoplay && handleMove(e.touches[0].clientX)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="absolute top-0 z-30 m-auto h-full w-px bg-gradient-to-b from-transparent from-[5%] via-lime to-transparent to-[95%]"
          style={{ left: `${sliderXPercent}%`, top: "0", zIndex: 40 }}
          transition={{ duration: 0 }}
        >
          <div className="absolute top-1/2 left-0 z-20 h-full w-36 -translate-y-1/2 bg-gradient-to-r from-lime via-transparent to-transparent opacity-40 [mask-image:radial-gradient(100px_at_left,white,transparent)]" />
          <div className="absolute top-1/2 left-0 z-10 h-1/2 w-10 -translate-y-1/2 bg-gradient-to-r from-[#18b759] via-transparent to-transparent opacity-100 [mask-image:radial-gradient(50px_at_left,white,transparent)]" />
          <div className="absolute top-1/2 -right-10 h-3/4 w-10 -translate-y-1/2 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
            <MemoizedSparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="h-full w-full"
              particleColor="#ddffdc"
            />
          </div>
          {showHandlebar && (
            <div className="absolute top-1/2 -right-3.5 z-30 flex h-9 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-lime shadow-[0_0_24px_rgba(127,238,100,0.55)]">
              <DotsSixVertical weight="bold" className="h-4 w-4 text-black" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none relative z-20 h-full w-full overflow-hidden">
        {firstImage || firstContent ? (
          <div
            className={cn("absolute inset-0 z-20 h-full w-full shrink-0 select-none overflow-hidden", firstImageClassName)}
            style={{ clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)` }}
          >
            {firstContent ?? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="first image"
                src={firstImage}
                className={cn("absolute inset-0 z-20 h-full w-full shrink-0 select-none", firstImageClassName)}
                draggable={false}
              />
            )}
          </div>
        ) : null}
      </div>

      {secondContent ? (
        <div className={cn("pointer-events-none absolute top-0 left-0 z-[19] h-full w-full select-none", secondImageClassname)}>
          {secondContent}
        </div>
      ) : secondImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cn("absolute top-0 left-0 z-[19] h-full w-full select-none", secondImageClassname)}
          alt="second image"
          src={secondImage}
          draggable={false}
        />
      ) : null}
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
