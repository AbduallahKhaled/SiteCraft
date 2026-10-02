// Shared layout for the short legal pages (privacy, terms).
export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <article className="wrap max-w-3xl pt-24 pb-24 sm:pt-32">
      <p className="eyebrow pt-8">{eyebrow}</p>
      <h1 className="mt-4 text-4xl tracking-[-0.02em] sm:text-5xl">{title}</h1>
      <div className="mt-8 space-y-4 text-base leading-relaxed">{children}</div>
    </article>
  );
}
