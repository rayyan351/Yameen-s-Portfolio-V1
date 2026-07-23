import HeroAboutExperience from "@/components/sections/HeroAboutExperience";
import SelectedWork from "@/components/sections/SelectedWork";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Testimonials from "@/components/sections/Testimonials";
import Writing from "@/components/sections/Writing";
import Press from "@/components/sections/Press";
import Academic from "@/components/sections/Academic";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <HeroAboutExperience />
      <SelectedWork />
      <Experience />
      <Skills />
      <Testimonials />
      <Writing />
      <Press />
      <Academic />
      <Contact />
    </>
  );
}
