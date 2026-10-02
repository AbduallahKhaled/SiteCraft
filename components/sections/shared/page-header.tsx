// Top of inner pages.
export function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <header className="pt-32 pb-12 sm:pt-40">
      <div className="wrap" data-reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-[18ch] text-5xl tracking-[-0.02em] sm:text-6xl">{title}</h1>
        {body && <p className="lead mt-6 max-w-[640px]">{body}</p>}
      </div>
    </header>
  );
}
