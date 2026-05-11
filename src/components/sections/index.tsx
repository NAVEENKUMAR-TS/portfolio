'use client';
import React, { ReactNode, useRef, useState, useEffect, FormEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiMongodb, SiGit, SiGithub, SiDocker, SiFigma, SiJavascript, SiSupabase } from 'react-icons/si';
import { FaJava, FaPython, FaCode, FaShieldAlt, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { AntigravityIcon } from '../AntigravityIcon';

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
            stiffness: 50, 
            damping: 25,
            mass: 1.2
          }}
          className={`w-full ${bgColor} ${textColor} shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] min-h-[140vh] flex flex-col relative overflow-hidden group cursor-none`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Normal Content */}
          <div className="relative z-10 flex flex-col h-full pointer-events-auto">
          <div className={`px-6 md:px-10 py-10 md:py-16 flex justify-between items-center border-b ${bgColor === 'bg-white' ? 'border-black/10' : 'border-white/10'} mt-10`}>
            <h2 className="text-5xl md:text-8xl font-black leading-none font-sans uppercase">{title}</h2>
            <span className="text-2xl md:text-4xl font-bold font-sans opacity-30">{number}</span>
          </div>
          <div className="flex-1 px-6 md:px-10 pt-6 md:pt-10 pb-10 md:pb-20">
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
          className={`absolute inset-0 z-30 pointer-events-none ${bgColor} flex flex-col h-full`}
          style={{
            maskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          }}
        >
          <div className={`px-6 md:px-10 py-10 md:py-16 flex justify-between items-center border-b ${bgColor === 'bg-white' ? 'border-black/10' : 'border-white/10'} mt-10`}>
            <h2 className="text-5xl md:text-8xl font-black leading-none font-sans uppercase">{title}</h2>
            <span className="text-2xl md:text-4xl font-bold font-sans opacity-30">{number}</span>
          </div>
          <div className="flex-1 px-6 md:px-10 pt-6 md:pt-10 pb-10 md:pb-20">
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

const TechStackContent = () => (
  <div className="flex flex-col gap-20 text-black">
    {/* Section Title */}
    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-serif leading-none">
      What I Work With
    </h3>

    {/* Three Column Grid with Vertical Dividers */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {/* Frontend */}
      <div className="py-8 md:py-0 md:pr-10 border-b md:border-b-0 md:border-r border-black/10">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold mb-6">
          Frontend
        </p>
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiReact /> React</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiJavascript /> JavaScript</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiTypescript /> TypeScript</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiTailwindcss /> TailwindCSS</p>
        </div>
      </div>

      {/* Backend */}
      <div className="py-8 md:py-0 md:px-10 border-b md:border-b-0 md:border-r border-black/10">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold mb-6">
          Backend
        </p>
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><FaJava /> Java</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><FaPython /> Python</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiNodedotjs /> Node.js</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiSupabase /> Supabase</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiMongodb /> MongoDB</p>
        </div>
      </div>

      {/* Tools */}
      <div className="py-8 md:py-0 md:pl-10">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold mb-6">
          Tools
        </p>
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiGit /> Git &amp; <SiGithub /> GitHub</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiDocker /> Docker</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><SiFigma /> Figma</p>
          <p className="text-xl md:text-2xl font-light flex items-center gap-3"><AntigravityIcon /> Antigravity</p>
        </div>
      </div>
    </div>
  </div>
);

export const TechStack = () => (
  <PaperSection id="tech-stack" title="Tech Stack" number="02" bgColor="bg-white" textColor="text-black">
    <TechStackContent />
  </PaperSection>
);

const ProjectsContent = () => {
  const projects = [
    {
      number: "01",
      title: "URL DETECTOR",
      description: "A smart web-based tool designed to analyze and detect malicious or suspicious URLs in real time, helping users improve security and identify potential threats efficiently.",
      tech: ["React", "Node.js", "Python", "MongoDB"],
      link: "https://github.com/NAVEENKUMAR-TS/url-detector",
      liveLink: "https://url-detector-backend-5vah.onrender.com/"
    },
    {
      number: "02",
      title: "SMART CONTROLLER",
      description: "A cyber-secure smart controller developed for managing grid-connected microgrids, enabling secure real-time monitoring, control, and protection of energy systems against cyber threats and unauthorized access.",
      tech: ["React", "JavaScript", "Python", "Supabase"],
      link: "https://github.com/NAVEENKUMAR-TS/smart_controller"
    }
  ];

  const getTechIcon = (tech: string) => {
    switch (tech) {
      case "React": return <SiReact className="text-sm" />;
      case "Node.js": return <SiNodedotjs className="text-sm" />;
      case "Python": return <FaPython className="text-sm" />;
      case "MongoDB": return <SiMongodb className="text-sm" />;
      case "JavaScript": return <SiJavascript className="text-sm" />;
      case "Supabase": return <SiSupabase className="text-sm" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col text-black">
      {projects.map((project, index) => (
        <div key={index} className="flex flex-col md:flex-row items-start md:items-center py-10 md:py-16 border-b border-black/10 group">
          {/* Left: Oversized Number */}
          <div className="w-full md:w-[15%] mb-4 md:mb-0">
            <span className="text-6xl md:text-[8vw] font-black leading-none text-black opacity-10 transition-opacity group-hover:opacity-30">{project.number}</span>
          </div>

          {/* Center: Title & Description */}
          <div className="w-full md:w-[50%] md:pr-10 mb-6 md:mb-0">
            <h3 className="text-3xl md:text-[3vw] font-serif font-black uppercase mb-4 leading-none">{project.title}</h3>
            <p className="text-base md:text-lg opacity-70 leading-relaxed font-light">{project.description}</p>
          </div>

          {/* Right: Tech & Link */}
          <div className="w-full md:w-[35%] flex flex-col md:items-end gap-6">
            <div className="flex flex-wrap md:justify-end gap-3">
              {project.tech.map((tech, i) => (
                <span key={i} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-black/20 rounded-full font-bold opacity-80">
                  {getTechIcon(tech)}
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap md:justify-end gap-6 mt-4 md:mt-0">
              {project.liveLink && (
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
                >
                  Live Site ↗
                </a>
              )}
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
              >
                <SiGithub className="text-lg" /> View GitHub ↗
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Projects = () => (
  <PaperSection id="projects" title="Projects" number="03" bgColor="bg-white" textColor="text-black">
    <ProjectsContent />
  </PaperSection>
);

const ExperienceContent = () => {
  const experiences = [
    {
      role: "FULL STACK DEVELOPER",
      icon: <FaCode />,
      organization: "INTERN PE",
      duration: "1 MONTH",
      description:
        "Worked on modern web application development using frontend and backend technologies, focusing on responsive UI design, API integration, and scalable application architecture. Contributed to real-world projects while enhancing problem-solving and development skills.",
    },
    {
      role: "CYBER SECURITY INTERN",
      icon: <FaShieldAlt />,
      organization: "ALFIDO TECH",
      duration: "1 MONTH",
      description:
        "Worked on cybersecurity concepts and security-focused solutions, gaining hands-on experience in threat analysis, vulnerability assessment, and secure system practices. Focused on improving knowledge in network security, cyber threats, and protection mechanisms.",
    },
  ];

  return (
    <div className="flex flex-col text-black">
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="border-b border-black/10 py-10 md:py-14 group"
        >
          {/* Row: Role | Org | Duration */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
            {/* Left: Role Title */}
            <h3 className="text-2xl md:text-[2vw] font-serif font-black uppercase leading-none tracking-tight flex items-center gap-3">
              {exp.icon}
              {exp.role}
            </h3>

            {/* Center: Organization */}
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-sans font-semibold opacity-80">
              {exp.organization}
            </span>

            {/* Right: Duration */}
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-sans font-bold opacity-60 md:text-right">
              {exp.duration}
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 text-base md:text-lg opacity-60 leading-relaxed font-light max-w-[600px] md:ml-1">
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export const Experience = () => (
  <PaperSection id="experience" title="Experience" number="04" bgColor="bg-white" textColor="text-black">
    <ExperienceContent />
  </PaperSection>
);

interface ContactContentProps {
  submitted: boolean;
  isSending: boolean;
  name: string;
  email: string;
  message: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setMessage: (v: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

const ContactSectionContent = ({ 
  submitted, isSending, name, email, message, 
  setName, setEmail, setMessage, handleSubmit 
}: ContactContentProps) => {
  const socialLinks = [
    { name: 'LINKEDIN', href: 'https://www.linkedin.com/in/naveenkumar-t-s-143ab5329', icon: <FaLinkedin /> },
    { name: 'GITHUB', href: 'https://github.com/NAVEENKUMAR-TS', icon: <FaGithub /> },
    { name: 'EMAIL', href: 'mailto:tsnaveenkumar07@gmail.com', icon: <FaEnvelope /> },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full gap-16 md:gap-0 -mt-6">
      {/* Left Panel — 60% */}
      <div className="w-full md:w-[60%] md:pr-16 flex flex-col justify-center">
        <h2 className="text-4xl md:text-[4vw] font-black uppercase leading-[0.95] tracking-tight text-black font-serif mb-6">
          LET&apos;S CREATE<br />SOMETHING<br />REMARKABLE.
        </h2>

        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-black opacity-40 font-sans font-bold mb-14">
          WHETHER YOU HAVE A CLEAR VISION OR JUST A ROUGH IDEA, I&apos;M READY TO HELP YOU BUILD IT.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-lg">
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-black/40 text-black text-base md:text-lg py-4 outline-none placeholder:text-black/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-sm focus:border-black transition-colors font-sans"
            />
            <input
              type="email"
              placeholder="YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-black/40 text-black text-base md:text-lg py-4 outline-none placeholder:text-black/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-sm focus:border-black transition-colors font-sans"
            />
            <textarea
              placeholder="YOUR IDEA OR MESSAGE..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border-b border-black/40 text-black text-base md:text-lg pt-4 pb-2 outline-none placeholder:text-black/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-sm focus:border-black transition-colors resize-none font-sans"
            />
            <button
              type="submit"
              disabled={isSending}
              className="self-start group relative text-black text-sm md:text-base font-bold uppercase tracking-[0.2em] py-3 mt-2 disabled:opacity-50"
            >
              <span>{isSending ? "SENDING..." : "SEND IT →"}</span>
              <span className="absolute bottom-1 left-0 h-[1px] bg-black w-0 group-hover:w-full transition-all duration-500 ease-out" />
            </button>
          </form>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-black opacity-80"
          >
            MESSAGE SENT. I&apos;LL BE IN TOUCH.
          </motion.p>
        )}
      </div>

      {/* Right Panel — 40% */}
      <div className="w-full md:w-[40%] flex flex-col justify-center md:pl-16 md:border-l border-black/10">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-black opacity-40 font-sans font-bold mb-10">
          FIND ME ON
        </p>

        <div className="flex flex-col gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-black transition-all duration-300 hover:translate-x-3"
            >
              <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
              <span className="relative text-2xl md:text-[2vw] font-black uppercase tracking-tight font-serif leading-none">
                {link.name}
                <span className="absolute bottom-0 left-0 h-[2px] bg-black w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </span>
              <span className="text-sm opacity-50 font-sans">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ContactPlaceholder = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    
    setIsSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "b5e2e7c1-48b8-4deb-a1bd-149e5a45a619",
          name: name,
          email: email,
          message: message,
          from_name: "Portfolio Contact Section",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        console.error("Error sending message:", result);
        alert("Something went wrong. Please try again or use the email link on the right.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending message. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PaperSection id="contact" title="CONTACT" number="05" bgColor="bg-white" textColor="text-black">
      <ContactSectionContent 
        submitted={submitted}
        isSending={isSending}
        name={name}
        email={email}
        message={message}
        setName={setName}
        setEmail={setEmail}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
      />
    </PaperSection>
  );
};
