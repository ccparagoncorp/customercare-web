'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  color?: string;
}

export default function GlowEffect({ 
  children, 
  className = '', 
  intensity = 0.5,
  color = 'blue'
}: GlowEffectProps) {
  return (
    <motion.div
      className={className}
      whileHover={{
        boxShadow: `0 0 ${20 * intensity}px ${color === 'blue' ? '#03438f' : color}`,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
