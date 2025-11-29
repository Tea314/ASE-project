import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ZapOff } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

export function PerformanceToggle() {
  const [isHighPerf, setIsHighPerf] = useState(() => {
    const saved = safeStorage.getItem('highPerformance', 'true');
    return saved === 'true';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    safeStorage.setItem('highPerformance', String(isHighPerf));
    
    // Toggle custom cursor
    if (typeof document !== 'undefined') {
      if (isHighPerf) {
        document.body.classList.add('custom-cursor');
      } else {
        document.body.classList.remove('custom-cursor');
      }
    }
    
    // Dispatch event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }, [isHighPerf]);

  return (
    <div className="fixed bottom-24 left-24 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center relative overflow-hidden group"
      >
        <motion.div
          className={`absolute inset-0 ${
            isHighPerf 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' 
              : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20'
          }`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {isHighPerf ? (
          <Zap className="w-5 h-5 relative z-10 text-green-600" />
        ) : (
          <ZapOff className="w-5 h-5 relative z-10 text-muted-foreground" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-card border border-border rounded-lg shadow-xl p-3 min-w-[200px]"
          >
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsHighPerf(true);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isHighPerf
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Zap className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">High Performance</div>
                  <div className="text-xs opacity-70">All effects enabled</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setIsHighPerf(false);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  !isHighPerf
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <ZapOff className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Performance Mode</div>
                  <div className="text-xs opacity-70">Reduced effects</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook to check if high performance mode is enabled
export function useHighPerformance() {
  const [isHighPerf, setIsHighPerf] = useState(() => {
    const saved = safeStorage.getItem('highPerformance', 'true');
    return saved === 'true';
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = safeStorage.getItem('highPerformance', 'true');
      setIsHighPerf(saved === 'true');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      
      // Initial check
      handleStorage();
      
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  return isHighPerf;
}
