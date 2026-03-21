"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // How fast it scrolls relative to normal speed (1 = normal, 0.5 = half speed, etc)
}

export function ParallaxBackground({
  children,
  className,
  speed = 0.5,
}: ParallaxBackgroundProps) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate the movement based on speed
  // Use a fixed value (e.g., 800px) instead of window.innerHeight during initial render
  // to prevent React Hydration Mismatches between server and client
  const baseDistance = 800;
  const yDistance = baseDistance * speed;
  
  const y = useTransform(scrollYProgress, [0, 1], [-yDistance, yDistance]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ''}`}>
      <motion.div style={{ y }} className="w-full h-full absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}
