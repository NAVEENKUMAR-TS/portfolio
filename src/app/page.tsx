import { 
  Hero, 
  About,
  TechStack, 
  Projects, 
  Experience, 
  ContactPlaceholder 
} from "@/components/sections";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Experience />
      <ContactPlaceholder />
    </div>
  );
}
