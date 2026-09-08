import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CopyEmail } from "@/components/ui/CopyEmail";

export function Contact() {
  const socials = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "X", href: profile.x },
    { label: "Email", href: `mailto:${profile.email}` },
  ].filter((social) => social.href);
  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <SectionLabel index="06">Contact / Have something in mind?</SectionLabel>
      <a
        className="contact-headline-link"
        href={`mailto:${profile.email}`}
        data-cursor="SAY HI"
      >
        <h2 id="contact-title" data-reveal>
          LET’S MAKE
          <br />
          <span>
            IT <em>REAL.</em>
            <ArrowUpRight strokeWidth={0.8} />
          </span>
        </h2>
      </a>
      <div className="contact-bottom">
        <div>
          <p>Good things start with a conversation.</p>
          <MagneticButton
            href={`mailto:${profile.email}`}
            className="contact-email"
            data-cursor="SAY HI"
          >
            {profile.email}
            <ArrowUpRight size={22} />
          </MagneticButton>
          <CopyEmail />
        </div>
        <div className="social-links">
          {socials.map((social) => (
            <MagneticButton
              key={social.label}
              href={social.href}
              data-cursor={
                social.label === "GitHub"
                  ? "GITHUB ↗"
                  : social.label === "Email"
                    ? "SAY HI"
                    : "OPEN ↗"
              }
              target={social.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                social.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
            >
              {social.label}
              <ArrowUpRight size={15} />
            </MagneticButton>
          ))}
        </div>
      </div>
    </section>
  );
}
