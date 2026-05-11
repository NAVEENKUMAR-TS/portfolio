import { 
  Hero, 
  About,
  TechStack, 
  Projects, 
  Experience, 
  ContactPlaceholder 
} from "@/components/sections";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Experience />
      <ContactPlaceholder />
      <Footer />
    </div>
  );
}
