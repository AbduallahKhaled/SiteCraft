"use client";
// Horizontal work rail.
// Desktop: the section pins and page scroll slides the builds sideways (1px of scroll = 1px of travel).
//   Drag, trackpad swipe, arrow keys and the progress segments all drive the same page scroll.
// Phones and reduced motion: a native swipe row with scroll snap, no pin. This is also the server render,
// so the builds are plain, crawlable links before any JavaScript runs.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export interface RailItem {
  id: string;
  src: string;
  title: string;
  kind: string;
  desc: string;
}

interface WorkRailProps {
  id: string;
  items: RailItem[];
  /** Section heading block (eyebrow, title, actions). */
  header: React.ReactNode;
  /** Where a card links to. Omit for non-link cards. */
  href?: (item: RailItem) => string;
  labels: { hint: string; hintTouch: string; of: string; nav: string; jump: string; open: string };
}

const PIN_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function WorkRail({ id, items, header, href, labels }: WorkRailProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [pin, setPin] = useState(false);
  const [active, setActive] = useState(0);
  const n = items.length;

  // Pick the mode from the viewport and motion preference.
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => setPin(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Pinned mode: scroll drives the track.
  useEffect(() => {
    if (!pin) return;
    const section = sectionRef.current!;
    const view = viewRef.current!;
    const track = trackRef.current!;
    const cards = Array.from(track.children) as HTMLElement[];
    const rtl = getComputedStyle(section).direction === "rtl";
    const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);

    // --f: 0 on the card in focus, 1 on cards a step or more away (dims and shrinks them in CSS)
    const paint = (p: number) => {
      const at = p * (n - 1);
      cards.forEach((c, i) => c.style.setProperty("--f", Math.min(1, Math.abs(at - i)).toFixed(3)));
      setActive(Math.round(at));
    };

    const tween = gsap.to(track, {
      x: () => (rtl ? 1 : -1) * dist(),
      ease: "none",
      onUpdate() {
        paint(this.progress());
      },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    stRef.current = tween.scrollTrigger ?? null;
    paint(0);

    // Drag (mouse, pen, sideways touch) scrolls the page, which moves the track.
    let down = false;
    let moved = 0;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = true;
      moved = 0;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      if (moved > 4) view.dataset.dragging = "";
      window.scrollBy(0, rtl ? dx : -dx);
    };
    const onUp = () => {
      down = false;
      delete view.dataset.dragging;
    };
    // a drag is not a click on the card under the pointer
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
      moved = 0;
    };
    // Sideways trackpad swipes also move it.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.scrollBy(0, rtl ? -e.deltaX : e.deltaX);
    };
    const onDragStart = (e: DragEvent) => e.preventDefault();

    view.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    view.addEventListener("click", onClick, true);
    view.addEventListener("wheel", onWheel, { passive: false });
    view.addEventListener("dragstart", onDragStart);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
      cards.forEach((c) => c.style.removeProperty("--f"));
      stRef.current = null;
      view.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      view.removeEventListener("click", onClick, true);
      view.removeEventListener("wheel", onWheel);
      view.removeEventListener("dragstart", onDragStart);
    };
  }, [pin, n]);

  // Native mode: follow the swipe position.
  useEffect(() => {
    if (pin) return;
    const view = viewRef.current!;
    const onScroll = () => {
      const max = view.scrollWidth - view.clientWidth;
      setActive(max > 0 ? Math.round((Math.abs(view.scrollLeft) / max) * (n - 1)) : 0);
    };
    onScroll();
    view.addEventListener("scroll", onScroll, { passive: true });
    return () => view.removeEventListener("scroll", onScroll);
  }, [pin, n]);

  const goTo = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const k = Math.max(0, Math.min(n - 1, i));
      const st = stRef.current;
      if (pin && st) {
        window.scrollTo({ top: st.start + (k / Math.max(1, n - 1)) * (st.end - st.start), behavior });
      } else {
        const card = trackRef.current?.children[k] as HTMLElement | undefined;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        card?.scrollIntoView({ behavior: reduce ? "auto" : behavior, inline: "center", block: "nearest" });
      }
    },
    [pin, n]
  );

  // Arrow keys move between cards; keyboard focus brings its card into view.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const step = (e.key === "ArrowRight") !== rtl ? 1 : -1;
    const cards = Array.from(trackRef.current!.querySelectorAll<HTMLElement>("[data-card]"));
    const i = cards.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(n - 1, i + step));
    cards[next].focus({ preventScroll: true });
    goTo(next, "auto");
  };
  const onCardFocus = (i: number) => (e: React.FocusEvent<HTMLElement>) => {
    if (e.currentTarget.matches(":focus-visible")) goTo(i, "auto");
  };

  const pad = (v: number) => String(v).padStart(2, "0");
  const item = items[active];

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby={`${id}-title`}
      className={`relative flex w-full flex-col overflow-hidden bg-void ${pin ? "h-svh" : "py-20"}`}
    >
      <div className={`wrap relative z-10 ${pin ? "pt-24" : ""}`}>{header}</div>

      <div
        ref={viewRef}
        onKeyDown={onKeyDown}
        className={
          pin
            ? "rail-view relative flex min-h-0 flex-1 cursor-grab items-center overflow-hidden data-[dragging]:cursor-grabbing"
            : "rail-view no-scrollbar mt-10 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        }
        style={pin ? { touchAction: "pan-y" } : undefined}
      >
        <ul
          ref={trackRef}
          aria-label={labels.nav}
          className="rail-track flex w-max gap-5 sm:gap-8"
          style={{ willChange: pin ? "transform" : undefined }}
        >
          {items.map((it, i) => {
            const body = (
              <>
                {/* the caption below names the card, so the preview image is decorative */}
                <span className="relative block aspect-[5/4] overflow-hidden rounded-xl border border-circuit bg-ground">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.src}
                    alt=""
                    width={1000}
                    height={1083}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full select-none object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  {href ? (
                    <span aria-hidden className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-void/80 px-3 py-1.5 text-xs font-semibold text-phosphor opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {labels.open} <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
                    </span>
                  ) : null}
                </span>
                <span className="mt-4 flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.14em] text-sage-dim">
                  <span className="text-moss" aria-hidden>
                    {pad(i + 1)}
                  </span>
                  {it.kind}
                </span>
                <span className="mt-1.5 block text-lg font-semibold tracking-[-0.01em] text-phosphor">{it.title}</span>
                <span className="mt-1 block text-sm text-sage">{it.desc}</span>
              </>
            );
            const cls =
              "group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-4 focus-visible:ring-offset-void";
            return (
              <li
                key={it.id}
                className={`rail-card shrink-0 ${
                  pin ? "w-[min(40vw,calc((100svh-360px)*1.25),600px)]" : "w-[78vw] max-w-[420px] snap-center"
                }`}
              >
                {href ? (
                  <Link href={href(it)} data-card onFocus={onCardFocus(i)} className={cls} draggable={false}>
                    {body}
                  </Link>
                ) : (
                  <div data-card tabIndex={0} onFocus={onCardFocus(i)} className={cls}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* progress: counter, one segment per build (each jumps to it), and how to move */}
      <div className={`wrap flex items-center gap-4 sm:gap-6 ${pin ? "pb-8 pt-6" : "mt-8"}`}>
        <p className="shrink-0 font-mono text-xs text-sage-dim" aria-hidden>
          <span dir="ltr">
            <span className="text-phosphor">{pad(active + 1)}</span> / {pad(n)}
          </span>
          <span className="ms-3 hidden text-moss sm:inline">{item?.title}</span>
        </p>
        <div className="flex flex-1 items-center gap-1.5" role="group" aria-label={labels.jump}>
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${it.title}, ${i + 1} ${labels.of} ${n}`}
              aria-current={i === active ? "true" : undefined}
              className="group/seg flex h-6 flex-1 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <span
                className={`h-[3px] w-full rounded-full transition-colors duration-300 group-hover/seg:bg-moss ${
                  i === active ? "bg-lime" : i < active ? "bg-sage-dim" : "bg-pine"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="hidden shrink-0 font-mono text-xs text-sage-dim md:block">{pin ? labels.hint : labels.hintTouch}</p>
      </div>
    </section>
  );
}
