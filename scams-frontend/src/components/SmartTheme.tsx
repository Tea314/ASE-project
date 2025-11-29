import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Sunrise, Sunset, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';
type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export function SmartTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'auto';
    try {
      const saved = localStorage.getItem('theme');
      return (saved as Theme) || 'auto';
    } catch {
      return 'auto';
    }
  });
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [isOpen, setIsOpen] = useState(false);

  // Save theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Failed to save theme:', error);
      }
    }
  }, [theme]);

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) setTimeOfDay('morning');
      else if (hour >= 8 && hour < 17) setTimeOfDay('day');
      else if (hour >= 17 && hour < 20) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // Auto theme based on time of day
      if (timeOfDay === 'night' || timeOfDay === 'evening') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, timeOfDay]);

  const themes: { value: Theme; icon: any; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'auto', icon: Monitor, label: 'Auto' },
  ];

  const TimeIcon = 
    timeOfDay === 'morning' ? Sunrise :
    timeOfDay === 'day' ? Sun :
    timeOfDay === 'evening' ? Sunset :
    Moon;

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-card border border-border shadow-lg flex items-center justify-center relative overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <TimeIcon className="w-5 h-5 relative z-10" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-card border border-border rounded-lg shadow-xl p-2 min-w-[160px]"
          >
            <div className="space-y-1">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.value;
                
                return (
                  <motion.button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTheme"
                        className="ml-auto w-2 h-2 rounded-full bg-current"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {theme === 'auto' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t border-border"
              >
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <TimeIcon className="w-3 h-3" />
                    <span className="font-medium capitalize">{timeOfDay}</span>
                  </div>
                  <p>Theme adapts to time of day</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
