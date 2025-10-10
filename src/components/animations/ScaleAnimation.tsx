'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
  once?: boolean;
}

export default function ScaleAnimation({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  scale = 0.8,
  once = true
}: ScaleAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        scale: scale 
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1 
      }}
      viewport={{ 
        once, 
        margin: '0px 0px -10% 0px',
        amount: 0.3
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
