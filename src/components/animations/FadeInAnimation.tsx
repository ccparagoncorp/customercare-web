'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export default function FadeInAnimation({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  once = true
}: FadeInAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
