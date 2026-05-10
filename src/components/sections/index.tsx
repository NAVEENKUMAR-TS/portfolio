'use client';
import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isOverPaper, setIsOverPaper] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const paper = target.closest('[data-paper]');
      setIsOverPaper(!!paper);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = '';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none"
      style={{ zIndex: 99999 }}
      animate={{
        x: mousePos.x - 8,
        y: mousePos.y - 8,
        backgroundColor: isOverPaper ? '#000' : '#fff',
      }}
      transition={{ 
        x: { type: "spring", stiffness: 500, damping: 28, mass: 0.5 },
        y: { type: "spring", stiffness: 500, damping: 28, mass: 0.5 },
        backgroundColor: { duration: 0.3 },
      }}
    />,
    document.body
  );
};

const PaperSection = ({ id, number, title, children, bgColor = "bg-white", textColor = "text-black" }: { id: string, number: string, title: string, children: ReactNode, bgColor?: string, textColor?: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [globalMousePos, setGlobalMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updateLocalMousePos = (globalX: number, globalY: number) => {
    if (!container.current) return;
    const rect = container.current.getBoundingClientRect();
    setMousePos({
      x: globalX - rect.left,
      y: globalY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setGlobalMousePos({ x: e.clientX, y: e.clientY });
    updateLocalMousePos(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isHovered) {
        updateLocalMousePos(globalMousePos.x, globalMousePos.y);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHovered, globalMousePos]);
  
  return (
    <section id={id} className="relative min-h-screen py-40 flex flex-col items-center perspective-1000 overflow-visible">
      {/* Outer Floating Container */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 1, 0],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-full max-w-4xl flex justify-center"
      >
        {/* Inner 3D Tilt Container */}
        <motion.div 
          ref={container}
          data-paper="true"
          onMouseEnter={() => {
            if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            leaveTimeout.current = setTimeout(() => setIsHovered(false), 150);
          }}
          onMouseMove={handleMouseMove}
          animate={isHovered ? {
            rotateX: -(mousePos.y - (container.current?.clientHeight || 0) / 2) / 15,
            rotateY: (mousePos.x - (container.current?.clientWidth || 0) / 2) / 15,
            scale: 1.05,
            z: 100,
          } : { 
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            z: 0,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20 
          }}
          className={`w-full ${bgColor} ${textColor} shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] min-h-[140vh] flex flex-col relative overflow-hidden group cursor-none`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Normal Content */}
          <div className="relative z-10 flex flex-col h-full pointer-events-auto">
          <div className="px-6 md:px-10 py-10 md:py-16 flex justify-between items-center border-b border-black/10 mt-10">
            <h2 className="text-5xl md:text-9xl font-black leading-none font-sans uppercase">{title}</h2>
            <span className="text-2xl md:text-4xl font-bold font-sans opacity-30">{number}</span>
          </div>
          <div className="flex-1 px-6 md:px-10 py-10 md:py-20">
            {children}
          </div>
        </div>

        {/* Flashlight Overlay (Dark Room) */}
        <motion.div 
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-20 pointer-events-none bg-[#222]"
          style={{
            maskImage: `radial-gradient(circle 450px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 450px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
          }}
        />

        {/* The Light Itself (Reveal Layer) */}
        <motion.div 
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-30 pointer-events-none bg-white flex flex-col h-full"
          style={{
            maskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          }}
        >
          <div className="px-6 md:px-10 py-10 md:py-16 flex justify-between items-center border-b border-black/10 mt-10">
            <h2 className="text-5xl md:text-9xl font-black leading-none font-sans uppercase">{title}</h2>
            <span className="text-2xl md:text-4xl font-bold font-sans opacity-30">{number}</span>
          </div>
          <div className="flex-1 px-6 md:px-10 py-10 md:py-20">
            {children}
          </div>
        </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export const Hero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(10px)"]);

  return (
    <section className="relative h-screen z-0 bg-black">
      <CustomCursor />
      <motion.div 
        style={{ opacity, filter: blur }}
        className="fixed inset-0 flex flex-col items-center justify-center p-10 pointer-events-none"
      >
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-[15%] left-[5%] w-48 h-48 bg-white/10 rotate-12" />
          <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-white/5 -rotate-6" />
          <div className="absolute bottom-[10%] left-[15%] w-40 h-40 bg-white/5 rotate-45" />
          <div className="absolute bottom-[20%] right-[15%] w-56 h-56 bg-white/10 -rotate-12" />
        </div>

        <div className="text-center z-10">
          <h1 className="text-4xl md:text-[5rem] font-black uppercase tracking-tighter whitespace-nowrap font-sans text-white leading-none">
            NAVEENKUMAR T S
          </h1>
          <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.8em] opacity-50 font-sans text-white mt-6 whitespace-nowrap">
            FULL STACK DEVELOPER · AI BUILDER · CYBERSECURITY ENTHUSIAST
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const AboutContent = () => (
  <div className="flex flex-col gap-12 max-w-3xl text-black">
    <p className="text-2xl md:text-4xl leading-[1.1] font-light font-sans tracking-tight">
      I&apos;m a <span className="font-bold">Full Stack Developer</span> passionate about building modern, responsive, and high-performance web applications.
    </p>
    <p className="text-xl md:text-2xl leading-snug font-light font-sans tracking-tight">
      I focus on creating <span className="font-bold text-black">clean, user-friendly digital experiences</span> with efficient code and minimal design.
    </p>
    <p className="text-xl md:text-2xl leading-snug font-light font-sans tracking-tight">
      I believe in <span className="font-bold text-black">clean architecture</span>, continuous learning, and building projects that create <span className="font-bold text-black">real impact</span>.
    </p>
    <p className="text-xl md:text-2xl leading-snug font-light font-sans tracking-tight">
      Beyond the frontend aesthetic, I enjoy working on <span className="font-bold text-black">scalable backend systems</span> and exploring modern development tools and technologies.
    </p>
  </div>
);

export const About = () => (
  <PaperSection id="about" title="About" number="01">
    <AboutContent />
  </PaperSection>
);

export const TechStack = () => (
  <PaperSection id="tech-stack" title="Tech" number="02">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest opacity-40">Frontend</p>
            <p className="text-lg font-bold">Next.js, React, TypeScript</p>
        </div>
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest opacity-40">Animation</p>
            <p className="text-lg font-bold">GSAP, Framer Motion, Lenis</p>
        </div>
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest opacity-40">Styling</p>
            <p className="text-lg font-bold">TailwindCSS, CSS Modules</p>
        </div>
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest opacity-40">Backend</p>
            <p className="text-lg font-bold">Node.js, PostgreSQL</p>
        </div>
    </div>
  </PaperSection>
);

export const Projects = () => (
  <PaperSection id="projects" title="Works" number="03">
    <div className="h-full flex items-center justify-center border-2 border-dashed border-black/10 rounded-xl min-h-[400px]">
        <p className="text-xl opacity-30">Projects Showcase Placeholder</p>
    </div>
  </PaperSection>
);

export const Experience = () => (
  <PaperSection id="experience" title="Exp" number="04">
    <div className="space-y-12">
        <div className="flex justify-between items-start border-b border-black/10 pb-6">
            <div>
                <h3 className="text-2xl font-bold">Creative Developer</h3>
                <p className="opacity-60">Freelance</p>
            </div>
            <p className="font-mono text-sm">2023 — Present</p>
        </div>
        <div className="flex justify-between items-start border-b border-black/10 pb-6">
            <div>
                <h3 className="text-2xl font-bold">UI/UX Designer</h3>
                <p className="opacity-60">Agency X</p>
            </div>
            <p className="font-mono text-sm">2022 — 2023</p>
        </div>
    </div>
  </PaperSection>
);

export const ContactPlaceholder = () => (
  <PaperSection id="contact" title="Talk" number="05">
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <h3 className="text-4xl md:text-6xl font-black uppercase mb-8">Let's build something<br/>extraordinary.</h3>
        <a href="mailto:hello@naveenkumar.me" className="text-xl md:text-2xl underline underline-offset-8 hover:opacity-50 transition-opacity">
            hello@naveenkumar.me
        </a>
    </div>
  </PaperSection>
);
