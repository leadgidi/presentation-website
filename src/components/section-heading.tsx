type SectionHeadingProps = { id: string; title: string; lede?: string };

export function SectionHeading({ id, title, lede }: SectionHeadingProps) {
  return (
    <h2 id={id} className="section-title">
      {title}
      {lede && <span className="section-title-muted"> {lede}</span>}
    </h2>
  );
}
