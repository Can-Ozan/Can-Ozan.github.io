import { ArrowDownRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <SectionLabel index="03">
        About / The person behind the pixels
      </SectionLabel>
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
              I’m Can, a web developer from Türkiye. I like building tools,
              interactive interfaces and experiments that help me understand how
              things work.
            </p>
            <p>
              Most of my projects begin the same way: find a problem, build
              something, break it, improve it, ship it. Then find the next thing
              I don’t understand yet.
            </p>
          </div>
          <p className="about-verbs">
            <span>Build.</span>
            <span>Break.</span>
            <span>Learn.</span>
            <em>Ship.</em>
          </p>
          <div className="about-signature">
            <span>Yusuf Can Ozan</span>
            <span>ALWAYS CURIOUS. ALWAYS BUILDING.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
