import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/ui/ProjectArtwork";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-meta">
        <span>INDEPENDENT DEVELOPER & CREATIVE THINKER</span>
        <span className="hero-meta-right">PORTFOLIO — VOL. 01 / 2026</span>
      </div>
      <h1 className="hero-title" id="hero-title" aria-label="Yusuf Can Ozan">
        CAN<span className="hero-dash">—</span>OZAN
        <span className="hero-title-dot">®</span>
      </h1>
      <div className="hero-stage">
        <div className="stage-caption">
          A FEW THINGS
          <br />
          I’VE BEEN MAKING <ArrowDownRight size={22} />
        </div>
        <div className="hero-posters">
          <a
            href="#readme-studio"
            className="hero-poster poster-left"
            data-cursor="VIEW"
            aria-label="View README.studio project"
          >
            <div className="poster-tilt">
              <ProjectArtwork visual="readme" compact />
            </div>
          </a>
          <a
            href="#autopilot"
            className="hero-poster poster-right"
            data-cursor="VIEW"
            aria-label="View Autopilot project"
          >
            <div className="poster-tilt">
              <ProjectArtwork visual="automation" compact />
            </div>
          </a>
          <a
            href="#fileshift"
            className="hero-poster poster-center"
            data-cursor="VIEW"
            aria-label="View FileShift project"
          >
            <div className="poster-tilt">
              <ProjectArtwork visual="converter" compact />
            </div>
          </a>
        </div>
        <div className="stage-edition">
          DESIGNED WITH INTENTION.
          <br />
          BUILT WITH CURIOSITY.
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-intro">
          <span className="eyebrow">WEB DEVELOPER / CREATIVE DEVELOPER</span>
          <p>
            I build fast, interactive &<br />
            <em>thoughtful</em> digital experiences.
          </p>
        </div>
        <a
          className="hero-work-link"
          href="#work"
          data-cursor="GO"
          aria-label="Explore selected work"
        >
          <span>
            SCROLL TO
            <br />
            EXPLORE THE WORK
          </span>
          <span className="round-arrow">
            <ArrowDown size={26} strokeWidth={1.5} />
          </span>
        </a>
      </div>
      <div className="hero-footnote">
        <span>
          <i className="status-dot" /> OPEN TO GOOD CONVERSATIONS
        </span>
        <span>
          CODE. CRAFT. A LITTLE CHARACTER. <ArrowUpRight size={13} />
        </span>
      </div>
    </section>
  );
}
