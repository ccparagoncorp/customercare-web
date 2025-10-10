'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TypewriterEffectProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function TypewriterEffect({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 2 
}: TypewriterEffectProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration, delay }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: duration, delay, ease: "easeInOut" }}
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
