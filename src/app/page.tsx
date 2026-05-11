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
import { getSkillCategories } from "@/app/actions/skills";
import { getServices } from "@/app/actions/services";
import { getExperiences } from "@/app/actions/experience";
import { getCertifications } from "@/app/actions/certifications";
import { getContact } from "@/app/actions/contact";

import { getSectionConfigs } from "@/app/actions/sections";

/**
 * NovaxFolio Main Entry Point (Home Page)
 */
export default async function Home() {
  // Fetch initial content from the database
  const heroData = await getHero();
  const aboutData = await getAbout();
  const projectsData = await getProjects();
  const skillsData = await getSkillCategories();
  const servicesData = await getServices();
  const experiencesData = await getExperiences();
  const certificationsData = await getCertifications();
  const contactData = await getContact();
  const sectionConfigs = await getSectionConfigs();

  const getSectionConfig = (id: string) => sectionConfigs.find(c => c.sectionId === id);


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero data={heroData} />
        <About data={aboutData} config={getSectionConfig('about')} />
        <Skills data={skillsData} config={getSectionConfig('skills')} />
        <Services data={servicesData} config={getSectionConfig('services')} />
        <Experience data={experiencesData} config={getSectionConfig('experience')} />
        <Projects data={projectsData} config={getSectionConfig('projects')} />
        <Certifications data={certificationsData} config={getSectionConfig('certifications')} />
        <Contact data={contactData} config={getSectionConfig('contact')} />
      </main>
    </div>
  );
}
