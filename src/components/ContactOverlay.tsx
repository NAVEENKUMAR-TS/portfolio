'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ContactOverlayProps {
  onClose: () => void;
}

export default function ContactOverlay({ onClose }: ContactOverlayProps) {
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-[var(--bg)] flex flex-col items-center justify-center p-10"
    >
      <button
        onClick={onClose}
        className="absolute top-10 right-10 p-4 hover:rotate-90 transition-transform"
      >
        <X size={40} />
      </button>

      <div className="text-center">
        <h2 className="text-6xl md:text-8xl font-black mb-8 italic uppercase tracking-tighter">
          Get in Touch
        </h2>
        <p className="text-xl opacity-50 max-w-md mx-auto">
          Module 5 Content Placeholder: Contact details and form will go here.
        </p>
      </div>
    </motion.div>
  );
}
