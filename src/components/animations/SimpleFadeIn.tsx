'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SimpleFadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function SimpleFadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className = ''
}: SimpleFadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
}
