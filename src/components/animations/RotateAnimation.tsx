'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RotateAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  rotation?: number;
  once?: boolean;
}

export default function RotateAnimation({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  rotation = 10,
  once = true
}: RotateAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        rotate: -rotation 
      }}
      whileInView={{ 
        opacity: 1, 
        rotate: 0 
      }}
      viewport={{ once, margin: '-50px' }}
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
