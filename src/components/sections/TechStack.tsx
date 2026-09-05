"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const technologies = [
  {
    name: "React",
    use: "Interfaces that feel alive.",
    label: "INTERFACE",
    color: "#b4cce4",
    mark: "✳",
  },
  {
    name: "Next.js",
    use: "From the first render to the full product.",
    label: "FRAMEWORK",
    color: "#ebe8df",
    mark: "N",
  },
  {
    name: "TypeScript",
    use: "A little certainty in a world of possibilities.",
    label: "LANGUAGE",
    color: "#acc7e5",
    mark: "Ts",
  },
  {
    name: "Node.js",
    use: "The engine behind the experience.",
    label: "RUNTIME",
    color: "#c3d79a",
    mark: "⌘",
  },
  {
    name: "Tailwind CSS",
    use: "Small details. A consistent whole.",
    label: "STYLING",
    color: "#a6d5d0",
    mark: "≈",
  },
  {
    name: "PostgreSQL",
    use: "A solid home for the important things.",
    label: "DATABASE",
    color: "#c1b8da",
    mark: "P",
  },
  {
    name: "Git",
    use: "Every change has a story.",
    label: "VERSION CONTROL",
    color: "#f09d7e",
    mark: "+",
  },
  {
    name: "Docker",
    use: "Built to work wherever it goes.",
    label: "TOOLING",
    color: "#b3cbe5",
    mark: "▥",
  },
];

export function TechStack() {
  const [active, setActive] = useState(0);
  const shape = useRef<HTMLDivElement>(null);
  const selected = technologies[active];
  return (
    <section className="tools-section" id="tools" aria-labelledby="tools-title">
      <SectionLabel index="02">The toolkit</SectionLabel>
      <h2 id="tools-title" className="tools-heading" data-reveal>
        Different tools.
        <br />
        <em>Same intention.</em>
      </h2>
      <div className="tools-layout">
        <div
          className="tool-sculpture"
          onPointerMove={(event) => {
            if (
              event.pointerType !== "mouse" ||
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            )
              return;
            const box = event.currentTarget.getBoundingClientRect();
            shape.current?.style.setProperty(
              "--shape-x",
              `${(event.clientX - box.left - box.width / 2) * 0.035}px`,
            );
            shape.current?.style.setProperty(
              "--shape-y",
              `${(event.clientY - box.top - box.height / 2) * 0.035}px`,
            );
          }}
          onPointerLeave={() => {
            shape.current?.style.setProperty("--shape-x", "0px");
            shape.current?.style.setProperty("--shape-y", "0px");
          }}
        >
          <div
            className="tool-shape"
            ref={shape}
            style={{ color: selected.color }}
            aria-hidden="true"
          >
            <span className="shape-ring ring-one" />
            <span className="shape-ring ring-two" />
            <span className="shape-ring ring-three" />
            <span className="shape-ring ring-four" />
            <span className="shape-symbol">{selected.mark}</span>
          </div>
          <div className="tool-caption" aria-live="polite">
            <span>{selected.label}</span>
            <p>{selected.use}</p>
          </div>
        </div>
        <ul className="tool-list">
          {technologies.map((technology, index) => (
            <li key={technology.name}>
              <button
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                className={active === index ? "active" : ""}
              >
                <span className="tool-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="tool-name">{technology.name}</span>
                <ArrowUpRight size={25} strokeWidth={1.3} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
