export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <h2 id={id} className="text-4xl font-medium tracking-[-0.035em] text-ink md:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>}
    </div>
  );
}
