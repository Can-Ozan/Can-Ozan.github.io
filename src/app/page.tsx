import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Github } from "@/components/sections/Github";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { MotionController } from "@/components/layout/MotionController";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SelectedWork />
        <TechStack />
        <About />
        <Github />
        <Contact />
      </main>
      <Footer />
      <MotionController />
    </>
  );
}
