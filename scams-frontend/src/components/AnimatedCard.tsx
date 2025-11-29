import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Card } from './ui/card';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '', 
  hover = true,
  onClick 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { 
        y: -4, 
        transition: { duration: 0.2 } 
      } : undefined}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
}
