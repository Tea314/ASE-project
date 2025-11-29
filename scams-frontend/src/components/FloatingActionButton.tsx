import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, Search, Zap, X, Sparkles } from 'lucide-react';

interface QuickAction {
  icon: any;
  label: string;
  action: () => void;
  color: string;
}

interface FloatingActionButtonProps {
  actions: QuickAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Quick actions */}
            <motion.div className="absolute bottom-20 right-0 flex flex-col gap-3">
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0, x: 20, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: 0, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0, 
                    x: 20, 
                    y: 20,
                    transition: { delay: (actions.length - index) * 0.03 }
                  }}
                  whileHover={{ scale: 1.1, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="pr-2 font-medium whitespace-nowrap">{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl flex items-center justify-center relative overflow-hidden group"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity },
          }}
        />

        {/* Sparkle effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="absolute top-2 right-2 w-3 h-3 text-white" />
          <Sparkles className="absolute bottom-3 left-3 w-2 h-2 text-white" />
        </motion.div>

        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Zap className="w-6 h-6 text-white" />
          )}
        </motion.div>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </motion.button>
    </div>
  );
}
