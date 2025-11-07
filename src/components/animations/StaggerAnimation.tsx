'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerAnimationProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
}

export default function StaggerAnimation({
  children,
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  distance = 30,
  once = true
}: StaggerAnimationProps) {
  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 }
  };

  const initialPosition = directions[direction];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { 
      opacity: 0, 
      ...initialPosition 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once, 
        margin: '0px 0px -10% 0px',
        amount: 0.3
      }}
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div key={index} variants={item}>
            {child}
          </motion.div>
        )) : 
        <motion.div variants={item}>{children}</motion.div>
      }
    </motion.div>
  );
}
