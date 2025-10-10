'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HeroScrollAnimationProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export default function HeroScrollAnimation({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}: HeroScrollAnimationProps) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 }
  };

  const initialPosition = directions[direction];

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...initialPosition 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ 
        once: true,
        margin: '0px 0px -20% 0px',
        amount: 0.1
      }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
}
