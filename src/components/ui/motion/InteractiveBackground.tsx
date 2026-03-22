"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function InteractiveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Autonomous Floating Glow Orb */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] -top-[500px] -left-[200px] rounded-full pointer-events-none will-change-transform z-0"
        animate={{
          x: ["0vw", "40vw", "10vw", "60vw", "0vw"],
          y: ["0vh", "20vh", "50vh", "10vh", "0vh"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          repeatType: "mirror"
        }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.8)_0%,rgba(0,122,255,0.6)_30%,rgba(138,43,226,0.3)_60%,rgba(0,122,255,0)_80%)] blur-[80px] mix-blend-multiply opacity-50" />
      </motion.div>
      
      {/* Decorative static blobs floating */}
      <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-[#007AFF]/20 rounded-full blur-[120px] animate-pulse pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[2%] left-[5%] w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none mix-blend-multiply"></div>
      
      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
    </div>
  );
}
