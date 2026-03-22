"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function InteractiveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#f8fafc]">
      
      {/* Aurora Borealis Triad Glows - High Contrast & Vibrancy */}
      {/* Orb 1: Intense Cyan */}
      <motion.div
        className="absolute w-[1200px] h-[1200px] -top-[600px] -left-[300px] rounded-full pointer-events-none will-change-transform z-0"
        animate={{
          x: ["0vw", "30vw", "-10vw", "40vw", "0vw"],
          y: ["0vh", "20vh", "60vh", "30vh", "0vh"],
          scale: [1, 1.2, 0.9, 1.1, 1]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,198,255,0.85)_0%,rgba(0,122,255,0.4)_40%,transparent_70%)] blur-[100px]" />
      </motion.div>

      {/* Orb 2: Neon Emerald */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] top-[10%] right-[10%] rounded-[100%] pointer-events-none will-change-transform z-0"
        animate={{
          x: ["0vw", "-40vw", "10vw", "-20vw", "0vw"],
          y: ["0vh", "40vh", "20vh", "60vh", "0vh"],
          scale: [1, 1.3, 0.8, 1.2, 1]
        }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,150,0.75)_0%,rgba(46,204,113,0.3)_40%,transparent_70%)] blur-[90px]" />
      </motion.div>

      {/* Orb 3: Deep Neon Purple/Pink */}
      <motion.div
        className="absolute w-[1400px] h-[1400px] -bottom-[400px] -left-[200px] rounded-full pointer-events-none will-change-transform z-0"
        animate={{
          x: ["0vw", "50vw", "20vw", "60vw", "0vw"],
          y: ["0vh", "-30vh", "-60vh", "-10vh", "0vh"],
          scale: [1, 0.8, 1.2, 0.9, 1]
        }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(180,0,255,0.7)_0%,rgba(138,43,226,0.3)_50%,transparent_70%)] blur-[120px]" />
      </motion.div>
      
      {/* Grid Pattern overlay for depth and modern look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
    </div>
  );
}
