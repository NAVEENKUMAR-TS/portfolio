'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Use GSAP Context for better cleanup
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set([dot, ring], { 
        xPercent: -50, 
        yPercent: -50,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });

      const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
      const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
      
      const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
      const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

      const handleMouseMove = (e: MouseEvent) => {
        xToDot(e.clientX);
        yToDot(e.clientY);
        xToRing(e.clientX);
        yToRing(e.clientY);
      };

      const handleMouseEnter = () => {
        gsap.to(ring, {
          scale: 1.5,
          backgroundColor: "white",
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.3
        });
      };

      const handleMouseLeave = () => {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.3
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Re-query interactive elements to ensure we catch them all after hydration
      const refreshListeners = () => {
        const interactiveElements = document.querySelectorAll('a, button, .interactive');
        interactiveElements.forEach((el) => {
          el.addEventListener('mouseenter', handleMouseEnter);
          el.addEventListener('mouseleave', handleMouseLeave);
        });
      };

      refreshListeners();
      
      // Use a small timeout to catch any late-rendering elements
      const timeout = setTimeout(refreshListeners, 1000);

      return () => {
        window.removeExternalEventListener?.('mousemove', handleMouseMove); // Typo protection
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeout);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
      />
    </>
  );
}
