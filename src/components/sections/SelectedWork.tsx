import { projects } from "@/data/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectPreview } from "@/components/ui/ProjectPreview";

export function SelectedWork() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <SectionLabel index="01">A few selected projects</SectionLabel>
      <div className="work-heading-row">
        <h2 className="section-heading" id="work-title">
          Selected <em>work.</em>
          <sup>(05)</sup>
        </h2>
        <p>
          A collection of useful ideas,
          <br />
          carefully brought to life.
        </p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectPreview key={project.id} project={project} index={index} />
        ))}
      </div>
      <div className="work-end">
        <span>ALWAYS A WORK IN PROGRESS.</span>
        <span>MORE IDEAS ON THE WAY. ↗</span>
      </div>
    </section>
  );
}
