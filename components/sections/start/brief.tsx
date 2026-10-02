"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Copy, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { getDict, type Dict, type Lang, type Option } from "@/lib/i18n";

type Answers = {
  type: string;
  pages: string;
  features: string[];
  vibes: string[];
  assets: string[];
  reference: string;
  timeline: string;
  budget: string;
  name: string;
  business: string;
  contact: string;
  notes: string;
};

const EMPTY: Answers = {
  type: "",
  pages: "",
  features: [],
  vibes: [],
  assets: [],
  reference: "",
  timeline: "",
  budget: "",
  name: "",
  business: "",
  contact: "",
  notes: "",
};

const label = (list: Option[], id: string) => list.find((o) => o.id === id)?.label ?? "";
const labels = (list: Option[], ids: string[]) => ids.map((id) => label(list, id)).filter(Boolean);
const round500 = (n: number) => Math.round(n / 500) * 500;

function estimate(t: Dict, a: Answers) {
  const base = t.Q_TYPE.find((o) => o.id === a.type)?.cost ?? 0;
  if (!base) return null;
  const pages = t.Q_PAGES.find((o) => o.id === a.pages)?.cost ?? 0;
  const feats = a.features.reduce((s, id) => s + (t.Q_FEATURES.find((o) => o.id === id)?.cost ?? 0), 0);
  const total = base + pages + feats;
  return [round500(total * 0.9), round500(total * 1.25)] as const;
}

function toMessage(t: Dict, a: Answers, est: readonly [number, number] | null, money: (n: number) => string) {
  const m = t.brief.msg;
  const sep = t.lang === "ar" ? "، " : ", ";
  const lines = [
    m.hello,
    `${m.name}: ${a.name}${a.business ? ` (${a.business})` : ""}`,
    `${m.contact}: ${a.contact}`,
    `${m.project}: ${label(t.Q_TYPE, a.type)}`,
    a.pages && `${m.pages}: ${label(t.Q_PAGES, a.pages)}`,
    a.features.length > 0 && `${m.features}: ${labels(t.Q_FEATURES, a.features).join(sep)}`,
    a.vibes.length > 0 && `${m.style}: ${a.vibes.map((v) => t.WORK.find((w) => w.id === v)?.title).join(sep)}`,
    a.reference && `${m.reference}: ${a.reference}`,
    a.assets.length > 0 && `${m.have}: ${labels(t.Q_ASSETS, a.assets).join(sep)}`,
    a.timeline && `${m.timeline}: ${label(t.Q_TIMELINE, a.timeline)}`,
    a.budget && `${m.budget}: ${label(t.Q_BUDGET, a.budget)}`,
    est && `${m.estimate}: ${money(est[0])} ${t.brief.to} ${money(est[1])}`,
    a.notes && `${m.notes}: ${a.notes}`,
  ];
  // one blank line after the greeting
  return lines
    .filter((l): l is string => typeof l === "string" && l !== "")
    .join("\n")
    .replace("\n", "\n\n");
}

function Choice({
  selected,
  onClick,
  children,
  hint,
  multi,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "group flex min-h-14 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-start transition-colors duration-200",
        selected ? "border-lime bg-lime/[0.07] text-phosphor" : "border-circuit/70 text-moss-bright hover:border-moss"
      )}
    >
      <span>
        <span className="block font-medium">{children}</span>
        {hint && <span className="block text-xs text-sage">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border transition-colors",
          multi ? "rounded" : "rounded-full",
          selected ? "border-lime bg-lime text-black" : "border-circuit"
        )}
      >
        {selected && <Check className="size-3.5" weight="bold" />}
      </span>
    </button>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-8 first:mt-0">
      <legend className="flex w-full items-baseline justify-between gap-3">
        <span className="font-display text-xl text-phosphor">{title}</span>
        {note && <span className="text-xs text-sage-dim">{note}</span>}
      </legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-void px-4 py-3 text-phosphor placeholder:text-sage-dim outline-none transition-[border-color,box-shadow] duration-200 ease-out hover:border-moss/40 focus:border-lime focus:shadow-[0_0_0_3px_rgba(25,195,125,0.15)]";

export function Brief({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const b = t.brief;
  const STEPS = b.steps;
  const money = (n: number) =>
    lang === "ar" ? `${n.toLocaleString("en-US")} ${t.currency}` : `${t.currency} ${n.toLocaleString("en-US")}`;
  // /start?type=store pre-selects the project type (links from Services and Pricing)
  const params = useSearchParams();
  const [a, setA] = useState<Answers>(() => {
    const type = params.get("type") ?? "";
    return { ...EMPTY, type: t.Q_TYPE.some((o) => o.id === type) ? type : "" };
  });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);


  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }));
  const toggle = (k: "features" | "vibes" | "assets", id: string, max = 99) =>
    setA((p) => {
      const list = p[k];
      if (list.includes(id)) return { ...p, [k]: list.filter((x) => x !== id) };
      if (list.length >= max) return p;
      return { ...p, [k]: [...list, id] };
    });

  const est = estimate(t, a);
  const message = toMessage(t, a, est, money);

  const validate = () => {
    if (step === 0 && !a.type) return b.errType;
    if (step === 1 && !a.pages) return b.errPages;
    if (step === 3 && !a.timeline) return b.errTimeline;
    if (step === 4) {
      if (!a.name.trim()) return b.errName;
      const c = a.contact.trim();
      if (!c) return b.errContact;
      if (c.includes("@") ? !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) : c.replace(/\D/g, "").length < 8)
        return b.errContactBad;
    }
    return "";
  };

  const go = (dir: 1 | -1) => {
    if (dir === 1) {
      const msg = validate();
      if (msg) return setError(msg);
    }
    setError("");
    if (dir === 1 && step === STEPS.length - 1) setDone(true);
    else setStep((s) => Math.max(0, Math.min(STEPS.length - 1, s + dir)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent(`${b.mailSubject}: ${a.business || a.name}`)}&body=${encodeURIComponent(message)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  // Terminal lines mirroring the answers so far.
  const log: [string, string][] = [
    ["type", label(t.Q_TYPE, a.type)],
    ["pages", label(t.Q_PAGES, a.pages)],
    ["features", labels(t.Q_FEATURES, a.features).join(", ")],
    ["style", a.vibes.map((v) => t.WORK.find((w) => w.id === v)?.title ?? "").join(", ")],
    ["timeline", label(t.Q_TIMELINE, a.timeline)],
    ["budget", label(t.Q_BUDGET, a.budget)],
  ];

  return (
    <section id="brief" className="pt-24 pb-24 sm:pt-32">
      <div ref={topRef} className="wrap scroll-mt-24">
        <div className="max-w-2xl" data-reveal suppressHydrationWarning>
          <p className="eyebrow pt-8">{b.eyebrow}</p>
          <h1 className="mt-4 text-5xl tracking-[-0.02em] sm:text-6xl">{b.title}</h1>
          <p className="lead mt-6">{b.lead}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Form */}
          <div className="rounded-2xl border border-circuit bg-void p-6 sm:p-10">
            {!done ? (
              <>
                <ol className="flex gap-2" aria-label={b.progress}>
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex-1">
                      <span className={cn("block h-1 rounded-full", i <= step ? "bg-lime" : "bg-pine")} />
                      <span
                        className={cn(
                          "mt-2 hidden text-xs font-medium uppercase tracking-[0.05em] sm:block",
                          i === step ? "text-phosphor" : "text-sage-dim"
                        )}
                        aria-current={i === step ? "step" : undefined}
                      >
                        {s}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 font-mono text-xs text-sage-dim sm:hidden">
                  {b.stepOf(step + 1, STEPS.length, STEPS[step])}
                </p>

                <div className="mt-8 min-h-[340px]">
                  {step === 0 && (
                    <Group title={b.qType}>
                      <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
                        {t.Q_TYPE.map((o) => (
                          <Choice key={o.id} selected={a.type === o.id} hint={o.hint} onClick={() => set("type", o.id)}>
                            {o.label}
                          </Choice>
                        ))}
                      </div>
                    </Group>
                  )}

                  {step === 1 && (
                    <>
                      <Group title={b.qPages}>
                        <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {t.Q_PAGES.map((o) => (
                            <Choice key={o.id} selected={a.pages === o.id} onClick={() => set("pages", o.id)}>
                              {o.label}
                            </Choice>
                          ))}
                        </div>
                      </Group>
                      <Group title={b.qFeatures} note={b.pickAny}>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {t.Q_FEATURES.map((o) => (
                            <Choice
                              key={o.id}
                              multi
                              selected={a.features.includes(o.id)}
                              onClick={() => toggle("features", o.id)}
                            >
                              {o.label}
                            </Choice>
                          ))}
                        </div>
                      </Group>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Group title={b.qClosest} note={b.closestNote(a.vibes.length)}>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {t.WORK.map((w) => {
                            const order = a.vibes.indexOf(w.id);
                            const on = order !== -1;
                            const full = !on && a.vibes.length >= 3;
                            return (
                              <button
                                key={w.id}
                                type="button"
                                role="checkbox"
                                aria-checked={on}
                                aria-label={`${w.title}, ${w.kind}`}
                                onClick={() => toggle("vibes", w.id, 3)}
                                className={cn(
                                  "group relative overflow-hidden rounded-xl border bg-ground text-start transition-[border-color,box-shadow,opacity] duration-300 ease-out",
                                  on
                                    ? "border-lime shadow-[0_0_0_1px_#19c37d,0_16px_40px_-24px_rgba(25,195,125,0.7)]"
                                    : "border-circuit/70 hover:border-moss",
                                  full && "opacity-45 hover:opacity-70"
                                )}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`/work/${w.id}.webp`}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  width={1000}
                                  height={1083}
                                  className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent"
                                />
                                <span className="absolute inset-x-0 bottom-0 p-3">
                                  <span className="block text-sm font-semibold tracking-[-0.01em] text-phosphor">{w.title}</span>
                                  <span className="block text-xs text-moss">{w.kind}</span>
                                </span>
                                <span
                                  aria-hidden
                                  className={cn(
                                    "absolute end-2.5 top-2.5 flex size-6 items-center justify-center rounded-full border font-mono text-xs font-semibold backdrop-blur transition-colors duration-200",
                                    on ? "border-lime bg-lime text-void" : "border-white/40 bg-void/40 text-transparent"
                                  )}
                                >
                                  {on ? order + 1 : ""}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </Group>
                      <Group title={b.qHave} note={b.pickAny}>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {t.Q_ASSETS.map((o) => (
                            <Choice
                              key={o.id}
                              multi
                              selected={a.assets.includes(o.id)}
                              onClick={() => toggle("assets", o.id)}
                            >
                              {o.label}
                            </Choice>
                          ))}
                        </div>
                      </Group>
                      <Group title={b.qLike} note={b.optional}>
                        <label className="sr-only" htmlFor="ref">
                          {b.likeLabel}
                        </label>
                        <input
                          id="ref"
                          className={inputCls}
                          placeholder={b.likePlaceholder}
                          dir="auto"
                          value={a.reference}
                          onChange={(e) => set("reference", e.target.value)}
                        />
                      </Group>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <Group title={b.qWhen}>
                        <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
                          {t.Q_TIMELINE.map((o) => (
                            <Choice key={o.id} selected={a.timeline === o.id} onClick={() => set("timeline", o.id)}>
                              {o.label}
                            </Choice>
                          ))}
                        </div>
                      </Group>
                      <Group title={b.qBudget} note={b.optional}>
                        <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {t.Q_BUDGET.map((o) => (
                            <Choice key={o.id} selected={a.budget === o.id} onClick={() => set("budget", o.id)}>
                              {o.label}
                            </Choice>
                          ))}
                        </div>
                      </Group>
                    </>
                  )}

                  {step === 4 && (
                    <Group title={b.qWhere}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="mb-2 block text-sm text-moss">
                            {b.name}
                          </label>
                          <input
                            id="name"
                            autoComplete="name"
                            className={inputCls}
                            value={a.name}
                            onChange={(e) => set("name", e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="business" className="mb-2 block text-sm text-moss">
                            {b.business}
                          </label>
                          <input
                            id="business"
                            autoComplete="organization"
                            className={inputCls}
                            value={a.business}
                            onChange={(e) => set("business", e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="contact" className="mb-2 block text-sm text-moss">
                            {b.contact}
                          </label>
                          <input
                            id="contact"
                            className={inputCls}
                            placeholder={b.contactPlaceholder}
                            dir="auto"
                            value={a.contact}
                            onChange={(e) => set("contact", e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="notes" className="mb-2 block text-sm text-moss">
                            {b.notes}
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            className={cn(inputCls, "resize-y")}
                            value={a.notes}
                            onChange={(e) => set("notes", e.target.value)}
                          />
                        </div>
                      </div>
                    </Group>
                  )}
                </div>

                <p role="alert" className="mt-4 min-h-5 text-sm text-destructive">
                  {error}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-6">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-fern transition-colors hover:text-phosphor disabled:invisible"
                  >
                    <ArrowLeft className="size-4 rtl:-scale-x-100" /> {b.back}
                  </button>
                  <button type="button" onClick={() => go(1)} className="btn-lime">
                    {step === STEPS.length - 1 ? b.review : b.next} <ArrowRight className="size-4 rtl:-scale-x-100" />
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="chip font-mono">
                  <span className="size-1.5 rounded-full bg-lime" aria-hidden /> {b.ready}
                </p>
                <h3 className="mt-4 text-3xl tracking-[-0.012em]">{b.thanks(a.name.split(" ")[0])}</h3>
                <p className="mt-3">{b.sendBody}</p>
                <pre dir="auto" className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-hairline bg-ground p-4 font-mono text-xs leading-relaxed text-moss-bright">
                  {message}
                </pre>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-lime">
                    <WhatsappLogo className="size-4" /> {b.wa}
                  </a>
                  <a href={mail} className="btn-ghost">
                    <EnvelopeSimple className="size-4" /> {b.email}
                  </a>
                  <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? b.copied : b.copy}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setStep(0);
                  }}
                  className="mt-6 text-sm text-fern underline-offset-4 hover:text-phosphor hover:underline"
                >
                  {b.edit}
                </button>
              </div>
            )}
          </div>

          {/* Live terminal summary */}
          <aside className="code-window h-fit lg:sticky lg:top-24" aria-label={b.summary}>
            <div className="code-bar">
              <i />
              <i />
              <i />
              <span className="ms-auto text-xs font-medium text-moss">brief.config</span>
            </div>
            <div className="space-y-2 p-6 font-mono text-xs leading-relaxed">
              <p className="text-phosphor">
                <span className="text-fern">$</span> sitecraft quote --live
              </p>
              {log.map(([k, v]) => (
                <p key={k} className="grid grid-cols-[5.5rem_1fr] gap-2">
                  <span className="text-sage-dim">{k}</span>
                  <span className={v ? "text-moss-bright" : "text-pine"}>{v || "..."}</span>
                </p>
              ))}
              <div className="mt-4 border-t border-hairline pt-4">
                <p className="text-sage-dim" dir="auto">
                  {"// "}
                  {b.estRange}
                </p>
                <p className="mt-1 font-display text-3xl tracking-[-0.02em] text-phosphor" aria-live="polite">
                  {est ? `${money(est[0])} ${b.to} ${money(est[1])}` : b.pickProject}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-sage-dim">
                  {b.estNote}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
