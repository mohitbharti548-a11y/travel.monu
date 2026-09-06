import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.7
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 40, x: 0, opacity: 0, rotateX: 10 };
      case 'down':
        return { y: -40, x: 0, opacity: 0, rotateX: -10 };
      case 'left':
        return { x: 40, y: 0, opacity: 0, rotateY: 10 };
      case 'right':
        return { x: -40, y: 0, opacity: 0, rotateY: -10 };
      default:
        return { opacity: 0, scale: 0.95 };
    }
  };

  return (
    <motion.div
      initial={getInitialOffset()}
      whileInView={{ 
        y: 0, 
        x: 0, 
        opacity: 1, 
        scale: 1, 
        rotateX: 0, 
        rotateY: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      }}
      viewport={{ once: false, amount: 0.15, margin: "-50px" }}
      className={`perspective-container ${className}`}
    >
      {children}
    </motion.div>
  );
};
