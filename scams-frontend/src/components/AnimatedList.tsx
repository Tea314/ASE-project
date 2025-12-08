import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
}

export function AnimatedList({ children, className = '' }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ 
  children, 
  onClick 
}: { 
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? { 
        x: 4,
        transition: { duration: 0.2 }
      } : undefined}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      {children}
    </motion.div>
  );
}
