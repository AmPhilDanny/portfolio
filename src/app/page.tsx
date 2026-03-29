import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import { getHero } from "@/app/actions/hero";
import { getAbout } from "@/app/actions/about";
import { getProjects } from "@/app/actions/projects";

export default async function Home() {
  const heroData = await getHero();
  const aboutData = await getAbout();
  const projectsData = await getProjects();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero data={heroData} />
        <About data={aboutData} />
        <Skills />
        <Services />
        <Experience />
        <Projects data={projectsData} />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}
