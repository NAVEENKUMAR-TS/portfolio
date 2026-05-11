'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Star = ({ size, top, left, opacity, duration }: { size: number, top: string, left: string, opacity: number, duration: number }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{
      width: size,
      height: size,
      top,
      left,
      opacity,
      boxShadow: `0 0 ${size * 2}px #fff`,
    }}
    animate={{
      opacity: [opacity, opacity * 0.3, opacity],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const Planet = ({ size, color, top, left, delay, rotateDuration }: { size: number, color: string, top: string, left: string, delay: number, rotateDuration: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      top,
      left,
      background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
      boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.5), 0 0 30px ${color}33`,
    }}
    animate={{
      y: [0, -50, 0],
      rotate: 360,
    }}
    transition={{
      y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: rotateDuration, repeat: Infinity, ease: "linear" },
    }}
  >
    {/* Subtle ring for one of the planets */}
    {size > 150 && (
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[10%] border border-white/10 rounded-full"
            style={{ transform: 'translate(-50%, -50%) rotateX(75deg) rotateY(15deg)' }}
        />
    )}
  </motion.div>
);

const ShootingStar = () => {
  const [position, setPosition] = useState({ top: '0%', left: '0%', delay: 0 });

  useEffect(() => {
    const randomize = () => ({
      top: `${Math.random() * 50}%`,
      left: `${Math.random() * 50}%`,
      delay: Math.random() * 10 + 5,
    });
    setPosition(randomize());
    const interval = setInterval(() => setPosition(randomize()), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute w-[2px] h-[2px] bg-white rounded-full z-0"
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: [0, 400],
        y: [0, 200],
        opacity: [0, 1, 0],
        scaleX: [1, 20, 1],
      }}
      transition={{
        duration: 1.5,
        delay: position.delay,
        repeat: Infinity,
        repeatDelay: 15,
        ease: "easeOut",
      }}
      style={{
        top: position.top,
        left: position.left,
        boxShadow: '0 0 10px #fff',
      }}
    />
  );
};

export const SpaceBackground = () => {
  const [stars, setStars] = useState<{ size: number; top: string; left: string; opacity: number; duration: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 150 }).map(() => ({
      size: Math.random() * 2 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#02040a]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0f1d_0%,#02040a_100%)]" />
      
      {/* Drifting Star Container */}
      <motion.div 
        className="absolute inset-[-10%]"
        animate={{
            x: ["-2%", "2%", "-2%"],
            y: ["-2%", "2%", "-2%"],
            rotate: [0, 1, 0],
        }}
        transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
        }}
      >
        {stars.map((star, i) => (
          <Star key={i} {...star} />
        ))}
      </motion.div>

      {/* Shooting Stars */}
      <ShootingStar />
      <ShootingStar />

      {/* Nebula effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[120px] rounded-full" />

      {/* Planets with increased floating */}
      <Planet size={200} color="#4a5d8a" top="15%" left="75%" delay={0} rotateDuration={120} />
      <Planet size={80} color="#8a4a4a" top="65%" left="10%" delay={2} rotateDuration={80} />
      <Planet size={40} color="#4a8a6d" top="40%" left="25%" delay={4} rotateDuration={60} />
      
      {/* Distant glow */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};
