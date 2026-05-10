'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactOverlay from './ContactOverlay';

export default function Navbar() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setOpacity(0.05);
      } else {
        setOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'ABOUT', href: '#hero' },
    { name: 'TECH STACK', href: '#tech-stack' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'EXPERIENCE', href: '#experience' },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 w-full z-[100] px-10 py-8 flex justify-between items-center transition-opacity duration-500 pointer-events-none"
        style={{ opacity }}
      >
        <div className="pointer-events-auto">
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ fontVariant: 'small-caps' }}>
            NAVEENKUMAR T S
          </h1>
        </div>
        
        <div className="flex gap-8 items-center pointer-events-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-medium tracking-[0.1em] hover:opacity-50 transition-opacity"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => setIsOverlayOpen(true)}
            className="text-[10px] font-bold tracking-[0.1em] border border-[var(--text)] px-4 py-1 hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all"
          >
            CONTACT
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOverlayOpen && (
          <ContactOverlay onClose={() => setIsOverlayOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
