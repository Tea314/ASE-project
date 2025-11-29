import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ReactNode, ComponentProps } from 'react';

interface AnimatedButtonProps extends ComponentProps<typeof Button> {
  children: ReactNode;
  magnetic?: boolean;
  glow?: boolean;
}

export function AnimatedButton({ 
  children, 
  magnetic = false,
  glow = false,
  className = '',
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Button 
        className={`relative overflow-hidden ${glow ? 'shadow-lg' : ''} ${className}`}
        {...props}
      >
        <motion.span
          className="relative z-10"
          initial={{ opacity: 1 }}
          whileHover={{ opacity: 0.9 }}
        >
          {children}
        </motion.span>
        {glow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>
    </motion.div>
  );
}
