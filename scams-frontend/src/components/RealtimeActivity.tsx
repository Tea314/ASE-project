import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface ActivityItem {
  id: string;
  type: 'booking' | 'cancellation' | 'update' | 'user';
  user: string;
  action: string;
  timestamp: Date;
  icon: any;
  color: string;
}

export function RealtimeActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate real-time activity
    const interval = setInterval(() => {
      const newActivity: ActivityItem = generateRandomActivity();
      setActivities((prev) => [newActivity, ...prev].slice(0, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomActivity = (): ActivityItem => {
    const types = ['booking', 'cancellation', 'update', 'user'] as const;
    const users = ['Sarah Chen', 'Mike Johnson', 'Emma Davis', 'Alex Thompson'];
    const rooms = ['Conference A', 'Meeting Room B', 'Board Room', 'Innovation Lab'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const room = rooms[Math.floor(Math.random() * rooms.length)];

    const actions = {
      booking: `booked ${room}`,
      cancellation: `cancelled booking for ${room}`,
      update: `updated booking for ${room}`,
      user: `joined the platform`,
    };

    const icons = {
      booking: Calendar,
      cancellation: XCircle,
      update: Clock,
      user: User,
    };

    const colors = {
      booking: 'bg-green-500',
      cancellation: 'bg-red-500',
      update: 'bg-blue-500',
      user: 'bg-purple-500',
    };

    return {
      id: Date.now().toString(),
      type,
      user,
      action: actions[type],
      timestamp: new Date(),
      icon: icons[type],
      color: colors[type],
    };
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-20 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg flex items-center justify-center z-40"
      >
        <Activity className="w-5 h-5 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.button>

      {/* Activity Feed */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-32 right-8 w-80 bg-card border border-border rounded-xl shadow-2xl z-40 overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <h3 className="font-semibold">Live Activity</h3>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-auto flex items-center gap-1 text-xs"
                >
                  <div className="w-2 h-2 bg-green-300 rounded-full" />
                  <span>Live</span>
                </motion.div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {activities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center text-muted-foreground"
                  >
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No recent activity</p>
                  </motion.div>
                ) : (
                  activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, height: 0, x: 50 }}
                      animate={{ opacity: 1, height: 'auto', x: 0 }}
                      exit={{ opacity: 0, height: 0, x: -50 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <activity.icon className="w-5 h-5 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{activity.user}</p>
                              <p className="text-xs text-muted-foreground">{activity.action}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              Just now
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
