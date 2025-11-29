import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import type { Room, Booking } from '@/types';

interface RoomUtilizationProps {
  rooms: Room[];
  bookings: Booking[];
}

export function RoomUtilization({ rooms, bookings }: RoomUtilizationProps) {
  // Calculate utilization for each room
  const calculateUtilization = (room: Room) => {
    const todayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.date);
      const today = new Date();
      return (
        b.roomId === room.id &&
        b.status === 'upcoming' &&
        bookingDate.toDateString() === today.toDateString()
      );
    });

    // Calculate total hours booked (assuming 8 hour work day)
    const totalMinutesBooked = todayBookings.reduce((total, booking) => {
      const [startHour, startMin] = booking.startTime.split(':').map(Number);
      const [endHour, endMin] = booking.endTime.split(':').map(Number);
      const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      return total + minutes;
    }, 0);

    const workDayMinutes = 8 * 60; // 8 hours
    const utilization = Math.min((totalMinutesBooked / workDayMinutes) * 100, 100);

    return {
      percentage: Math.round(utilization),
      bookingCount: todayBookings.length,
      hoursBooked: (totalMinutesBooked / 60).toFixed(1),
    };
  };

  const roomStats = rooms.map(room => ({
    room,
    stats: calculateUtilization(room),
  })).sort((a, b) => b.stats.percentage - a.stats.percentage);

  const averageUtilization = Math.round(
    roomStats.reduce((sum, r) => sum + r.stats.percentage, 0) / roomStats.length
  );

  const getTrendIcon = (percentage: number) => {
    if (percentage >= 75) return TrendingUp;
    if (percentage >= 40) return Minus;
    return TrendingDown;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600 dark:text-red-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Activity className="h-5 w-5 text-primary" />
                </motion.div>
                Room Utilization Today
              </CardTitle>
              <CardDescription>
                Real-time usage statistics across all rooms
              </CardDescription>
            </div>
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {averageUtilization}%
              </motion.div>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {roomStats.slice(0, 5).map((item, index) => {
            const { room, stats } = item;
            const TrendIcon = getTrendIcon(stats.percentage);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${stats.percentage >= 80
                          ? 'from-red-500 to-red-600'
                          : stats.percentage >= 60
                            ? 'from-yellow-500 to-yellow-600'
                            : 'from-green-500 to-green-600'
                        }`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MapPin className="h-5 w-5 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate">{room.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {room.capacity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stats.hoursBooked}h booked
                        </span>
                        <span>•</span>
                        <span>{stats.bookingCount} bookings</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className={`text-lg font-bold ${getUtilizationColor(stats.percentage)}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {stats.percentage}%
                    </motion.div>
                    <TrendIcon className={`h-4 w-4 ${getUtilizationColor(stats.percentage)}`} />
                  </div>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className="origin-left"
                >
                  <div className="relative">
                    <Progress
                      value={stats.percentage}
                      className="h-2"
                    />
                    <motion.div
                      className={`absolute inset-0 h-2 rounded-full ${getProgressColor(stats.percentage)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          {roomStats.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center pt-2"
            >
              <p className="text-sm text-muted-foreground">
                +{roomStats.length - 5} more rooms
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
