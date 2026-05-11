'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

interface ContactOverlayProps {
  onClose: () => void;
}

const socialLinks = [
  {
    name: 'LINKEDIN',
    href: 'https://www.linkedin.com/in/naveenkumar-t-s-143ab5329',
    icon: <FaLinkedin />,
  },
  {
    name: 'GITHUB',
    href: 'https://github.com/NAVEENKUMAR-TS',
    icon: <FaGithub />,
  },
  {
    name: 'EMAIL',
    href: 'mailto:tsnaveenkumar07@gmail.com',
    icon: <FaEnvelope />,
  },
];

export default function ContactOverlay({ onClose }: ContactOverlayProps) {
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
          access_key: "b5e2e7c1-48b8-4deb-a1bd-149e5a45a619", // Go to web3forms.com to get your key
          name: name,
          email: email,
          message: message,
          from_name: "Portfolio Contact Form",
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
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-[#0d0d0d] flex flex-col overflow-y-auto"
      data-lenis-prevent
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 md:top-10 md:right-10 p-4 hover:rotate-90 transition-transform z-10 text-[var(--text)]"
      >
        <X size={32} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row px-8 md:px-16 pt-8 md:pt-12 pb-10 gap-16 md:gap-0">

        {/* Left Panel — 60% */}
        <div className="w-full md:w-[60%] md:pr-16 flex flex-col justify-center">
          <h2 className="text-4xl md:text-[5vw] font-black uppercase leading-[0.95] tracking-tight text-[var(--text)] font-serif mb-6">
            LET&apos;S CREATE<br />SOMETHING<br />REMARKABLE.
          </h2>

          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--text)] opacity-40 font-sans font-bold mb-14">
            WHETHER YOU HAVE A CLEAR VISION OR JUST A ROUGH IDEA, I&apos;M READY TO HELP YOU BUILD IT.
          </p>

          {/* Form / Success */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-lg">
              <input
                type="text"
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-[var(--text)]/40 text-[var(--text)] text-base md:text-lg py-4 outline-none placeholder:text-[var(--text)]/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-sm focus:border-[var(--text)] transition-colors font-sans"
              />
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[var(--text)]/40 text-[var(--text)] text-base md:text-lg py-4 outline-none placeholder:text-[var(--text)]/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-sm focus:border-[var(--text)] transition-colors font-sans"
              />
              <textarea
                placeholder="YOUR IDEA OR MESSAGE..."
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-b border-[var(--text)]/40 text-[var(--text)] text-base md:text-lg pt-4 pb-2 outline-none placeholder:text-[var(--text)]/60 placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-sm focus:border-[var(--text)] transition-colors resize-none font-sans"
              />
              <button
                type="submit"
                disabled={isSending}
                className="self-start group relative text-[var(--text)] text-sm md:text-base font-bold uppercase tracking-[0.2em] py-3 mt-2 disabled:opacity-50"
              >
                <span>{isSending ? "SENDING..." : "SEND IT →"}</span>
                <span className="absolute bottom-1 left-0 h-[1px] bg-[var(--text)] w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </button>
            </form>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-[var(--text)] opacity-80"
            >
              Message sent. I&apos;ll be in touch.
            </motion.p>
          )}
        </div>

        {/* Right Panel — 40% */}
        <div className="w-full md:w-[40%] flex flex-col justify-center md:pl-16 md:border-l border-[var(--text)]/10">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--text)] opacity-40 font-sans font-bold mb-10">
            FIND ME ON
          </p>

          <div className="flex flex-col gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-[var(--text)] transition-all duration-300 hover:translate-x-3"
              >
                <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                <span className="relative text-2xl md:text-[2vw] font-black uppercase tracking-tight font-serif leading-none">
                  {link.name}
                  <span className="absolute bottom-0 left-0 h-[2px] bg-[var(--text)] w-0 group-hover:w-full transition-all duration-500 ease-out" />
                </span>
                <span className="text-sm opacity-50 font-sans">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 md:px-16 py-8 border-t border-[var(--text)]/10">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--text)] opacity-30 font-sans text-center">
          ALL RIGHTS RESERVED. NAVEENKUMAR T S © 2026
        </p>
      </div>
    </motion.div>
  );
}
