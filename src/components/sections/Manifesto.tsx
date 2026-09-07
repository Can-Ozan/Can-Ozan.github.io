export function Manifesto() {
  return (
    <section
      className="manifesto"
      aria-label="I don’t just follow tutorials. I build things."
    >
      <div aria-hidden="true">
        <span className="manifesto-line">
          <span>I DON’T JUST</span>
        </span>
        <span className="manifesto-line">
          <span>FOLLOW TUTORIALS.</span>
        </span>
      </div>
      <div aria-hidden="true">
        <span className="manifesto-line">
          <span>I BUILD</span>
        </span>
        <span className="manifesto-line manifesto-emphasis">
          <span>THINGS. ↗</span>
        </span>
      </div>
    </section>
  );
}
