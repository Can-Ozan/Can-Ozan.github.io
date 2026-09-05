export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-label ${className}`}>
      <span className="section-dot" />
      <span>{children}</span>
      <span className="section-number">/{index}</span>
    </div>
  );
}
