import { ArrowUpRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/CommandPalette";

export function Navbar() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Can–Ozan home">
        CO<span className="wordmark-star">✳</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#work">
          Work <span>02</span>
        </a>
        <a href="#tools">
          Stack <span>03</span>
        </a>
        <a href="#about">
          About <span>04</span>
        </a>
        <a href="#github">
          GitHub <span>05</span>
        </a>
        <a href="#contact">
          Contact <ArrowUpRight size={15} />
        </a>
      </nav>
      <CommandPalette />
    </header>
  );
}
