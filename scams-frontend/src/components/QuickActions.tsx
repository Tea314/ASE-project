import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Star,
  TrendingUp
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
}

interface QuickActionsProps {
  onCreateBooking: () => void;
  onBrowseRooms: () => void;
  onViewBookings: () => void;
  onViewAnalytics?: () => void;
  isAdmin?: boolean;
}

export function QuickActions({ 
  onCreateBooking, 
  onBrowseRooms, 
  onViewBookings,
  onViewAnalytics,
  isAdmin = false 
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'book',
      label: 'Book a Room',
      description: 'Create new reservation',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      action: onCreateBooking,
    },
    {
      id: 'browse',
      label: 'Browse Rooms',
      description: 'Find available spaces',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      action: onBrowseRooms,
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      description: 'View reservations',
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
      action: onViewBookings,
    },
  ];

  if (isAdmin && onViewAnalytics) {
    actions.push({
      id: 'analytics',
      label: 'Analytics',
      description: 'View usage reports',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      action: onViewAnalytics,
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <motion.button
              className="w-full text-left"
              onClick={action.action}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <div className="flex-1 pt-1">
                      <h4 className="mb-1">{action.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          </motion.div>
        );
      })}

      {/* Additional Quick Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: actions.length * 0.1, duration: 0.4 }}
      >
        <Card className="overflow-hidden border-2 h-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Clock className="h-7 w-7 text-white" />
              </motion.div>
              <div className="flex-1 pt-1">
                <h4 className="mb-1">Quick Tips</h4>
                <p className="text-sm text-muted-foreground">
                  Press ⌘K for quick access
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
