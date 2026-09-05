import { ArrowDownRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <SectionLabel index="03">The person behind the pixels</SectionLabel>
      <div className="about-layout">
        <div className="about-note">
          <span className="about-asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            A DEVELOPER’S MIND.
            <br />A MAKER’S HEART.
          </p>
          <ArrowDownRight size={35} strokeWidth={1} />
        </div>
        <div className="about-main">
          <h2 id="about-title" data-reveal>
            I’m Can. I care about
            <br />
            how it works.
            <br />
            <span>
              And how it <em>feels.</em>
            </span>
          </h2>
          <div className="about-copy">
            <p>
              I’m a web developer focused on building modern, fast and
              interactive digital experiences. I enjoy turning ideas into
              polished products using modern web technologies.
            </p>
            <p>
              For me, the details are the experience. A considered interaction,
              a faster page, a simpler way forward. That’s where good code meets
              good design.
            </p>
          </div>
          <div className="about-signature">
            <span>Yusuf Can Ozan</span>
            <span>ALWAYS CURIOUS. ALWAYS BUILDING.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
