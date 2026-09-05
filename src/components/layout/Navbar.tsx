import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Can–Ozan home">
        CO<span className="wordmark-star">✳</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#work">
          Work <span>01</span>
        </a>
        <a href="#about">
          About <span>02</span>
        </a>
        <a href="#contact">
          Let’s talk <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}
