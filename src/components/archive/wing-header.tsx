interface WingHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function WingHeader({ eyebrow, title, description }: WingHeaderProps) {
  return (
    <header className="archive-wing-header mx-auto max-w-6xl px-6 pb-10 pt-12 text-center md:pt-16">
      <p className="label-volume text-gold/55">{eyebrow}</p>
      <h1 className="title-legend embossed-gold mt-4">{title}</h1>
      <p className="mx-auto mt-5 max-w-2xl font-serif text-lg italic leading-relaxed text-text-muted">
        {description}
      </p>
    </header>
  );
}
