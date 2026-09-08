import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Github } from "@/components/sections/Github";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { MotionController } from "@/components/layout/MotionController";
import { getGithubPortfolio } from "@/lib/github/client";
import { ProjectExperience } from "@/components/ui/ProjectExperience";
import { Manifesto } from "@/components/sections/Manifesto";
import { ProjectHoverPreview } from "@/components/ui/ProjectHoverPreview";

export default async function Home() {
  const data = await getGithubPortfolio();
  return (
    <ProjectExperience>
      <Navbar />
      <main>
        <Hero
          repositories={data.featured}
          available={data.repositoriesAvailable}
        />
        <SelectedWork data={data} />
        <TechStack
          languages={data.languages}
          languagesAvailable={data.languagesAvailable}
        />
        <About />
        <Manifesto />
        <Github data={data} />
        <Contact />
      </main>
      <Footer />
      <MotionController />
      <ProjectHoverPreview repositories={data.repositories} />
    </ProjectExperience>
  );
}
