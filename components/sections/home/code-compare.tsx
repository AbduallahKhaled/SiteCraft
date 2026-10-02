"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Code, Storefront, SealCheck } from "@phosphor-icons/react";
import { Compare } from "@/components/ui/compare";
import { tokenize } from "@/lib/highlight";
import { getDict, localePath, type Lang } from "@/lib/i18n";

// The source of this very page, shown on the other side of the slider.
const SOURCE = `// app/page.tsx · sitecraft.dev
import { Nav, Hero, Work, Services, Steps, Faq } from "@/components"

export default function Home() {
  return (
    <main className="bg-obsidian text-offwhite">
      <Nav logo="SiteCraft" links={["Work", "Services", "Process", "Pricing"]} />
      <Hero
        chip="Taking new projects this month"
        title="Your website, crafted from scratch."
        cta={{ label: "Get my free quote", href: "/start" }}
      />
      <Work builds={8} kinds={["Restaurant", "Clinic", "Store"]} />
      <Services from="EGP" />
      <Steps count={3} price="fixed" />
      <Faq />
    </main>
  )
}`;

const ICONS = [Code, Storefront, SealCheck];

function highlight(line: string) {
  return tokenize(line).map((tk, i) => (
    <span key={i} style={{ color: tk.c }}>
      {tk.t}
    </span>
  ));
}

function CodeSide() {
  const lines = SOURCE.split("\n");
  return (
    <div className="absolute inset-0 flex flex-col bg-ground">
      <div className="code-bar">
        <i />
        <i />
        <i />
        <span className="ml-auto font-mono text-xs text-moss">{"</> source"}</span>
      </div>
      <pre className="flex-1 overflow-hidden py-4 pr-4 pl-[13%] font-mono text-[11px] leading-[1.65] text-sage sm:py-8 sm:pr-8 sm:text-sm">
        {lines.map((l, i) => (
          <div key={i} className="flex">
            <span className="w-7 shrink-0 select-none text-right text-pine sm:w-10">{i + 1}</span>
            <span className="whitespace-pre pl-3 sm:pl-4">{highlight(l)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function SiteSide({ live, alt, lang }: { live: string; alt: string; lang: Lang }) {
  return (
    <div className="absolute inset-0 bg-void">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/hero/site-${lang}.webp`}
        alt={alt}
        className="h-full w-full object-cover object-top"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="absolute bottom-4 left-4 rounded-full bg-void/70 px-3 py-1 font-mono text-xs text-phosphor backdrop-blur">
        ● {live}
      </span>
    </div>
  );
}

export function CodeCompare({ lang }: { lang: Lang }) {
  const t = getDict(lang).compare;
  const [pct, setPct] = useState(10);
  const bars = 20;
  const filled = Math.round((pct / 100) * bars);

  return (
    <section className="relative overflow-hidden border-t border-hairline py-24">
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-4 text-4xl tracking-[-0.015em] sm:text-5xl">
            {t.title} <span className="text-moss-bright">{t.title2}</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-[1100px]" data-reveal>
          {/* the slider maths are left to right, so keep it LTR on Arabic pages too */}
          <div className="rounded-3xl border border-circuit bg-ground p-2 sm:p-3" dir="ltr">
            <Compare
              firstContent={<SiteSide live={t.live} alt={t.shotAlt} lang={lang} />}
              secondContent={<CodeSide />}
              initialSliderPercentage={10}
              slideMode="drag"
              label={t.label}
              onChange={setPct}
              className="h-[380px] w-full rounded-2xl sm:h-[560px]"
            />
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs text-sage" dir="ltr">
            <span className="text-fern">{t.compiling}</span>
            <span aria-hidden className="tracking-[-0.1em]">
              <span className="text-lime">{"▮".repeat(filled)}</span>
              <span className="text-pine">{"▮".repeat(bars - filled)}</span>
            </span>
            <span className="w-10 text-phosphor">{Math.round(pct)}%</span>
            <span className="hidden text-sage-dim sm:inline" dir="auto">
              {t.keys}
            </span>
          </p>
        </div>

        {/* what the slider means, in three lines */}
        <ul className="mx-auto mt-16 grid max-w-[1100px] gap-4 md:grid-cols-3">
          {t.points.map(([title, body], i) => {
            const Icon = ICONS[i];
            return (
              <li key={title} data-reveal="scale" className="spot rounded-lg border border-hairline bg-ground p-6">
                <Icon className="size-5 text-lime" aria-hidden />
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 leading-relaxed">{body}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-6 text-center" data-reveal>
          <p className="lead max-w-xl">{t.lead}</p>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link href={localePath(lang, "/start")} className="btn-lime">
              {t.cta} <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
            <Link href={localePath(lang, "/work")} className="btn-ghost">
              {t.cta2}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
