"use client";

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function InteractiveBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement with a spring
  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Center the 800px orb on the cursor using page coordinates
      // This ensures it stays absolute to the document, not overflowing the section
      mouseX.set(e.pageX - 400); 
      mouseY.set(e.pageY - 400);
      if (!isHovering) setIsHovering(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isHovering]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mouse Follower Glow Orb */}
      <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none will-change-transform z-0"
        style={{
          x: springX,
          y: springY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.8)_0%,rgba(0,122,255,0.6)_30%,rgba(138,43,226,0.3)_60%,rgba(0,122,255,0)_80%)] blur-[80px] mix-blend-multiply" />
      </motion.div>
      
      {/* Decorative static blobs floating */}
      <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-[#007AFF]/20 rounded-full blur-[120px] animate-pulse pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[2%] left-[5%] w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none mix-blend-multiply"></div>
      
      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
    </div>
  );
}
