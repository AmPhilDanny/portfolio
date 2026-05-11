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

/**
 * NovaxFolio Main Entry Point (Home Page)
 * 
 * This is a React Server Component (RSC) that fetches all the 
 * dynamic section data from the database and passes it down 
 * to the individual sections for high-performance, SEO-friendly rendering.
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


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero data={heroData} />
        <About data={aboutData} />
        <Skills data={skillsData} />
        <Services data={servicesData} />
        <Experience data={experiencesData} />
        <Projects data={projectsData} />
        <Certifications data={certificationsData} />
        <Contact data={contactData} />
      </main>
    </div>
  );
}
