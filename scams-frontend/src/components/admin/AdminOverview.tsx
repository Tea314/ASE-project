import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building2, Calendar, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import type { Room, Booking, BookingConflict, MaintenanceSchedule } from '@/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import { QuickBookingCalendar } from '../QuickBookingCalendar';
import { QuickActions } from '../QuickActions';
import { RoomCheckInOut } from '../RoomCheckInOut';
import { RoomUtilization } from '../RoomUtilization';
import { AnimatedCard } from '../AnimatedCard';
import { TiltCard } from '../TiltCard';
import { StaggerContainer, StaggerItem } from '../PageTransition';

interface AdminOverviewProps {
  rooms: Room[];
  bookings: Booking[];
  conflicts: BookingConflict[];
  maintenance: MaintenanceSchedule[];
  onCreateBooking?: () => void;
  onBrowseRooms?: () => void;
  onViewBookings?: () => void;
  onViewAnalytics?: () => void;
}

export function AdminOverview({ 
  rooms, 
  bookings, 
  conflicts, 
  maintenance,
  onCreateBooking,
  onBrowseRooms,
  onViewBookings,
  onViewAnalytics
}: AdminOverviewProps) {
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const bookedRooms = rooms.filter((r) => r.status === 'booked').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
  const activeBookings = bookings.filter((b) => b.status === 'upcoming').length;

  // Weekly utilization data
  const weeklyData = [
    { day: 'Mon', bookings: 12 },
    { day: 'Tue', bookings: 19 },
    { day: 'Wed', bookings: 15 },
    { day: 'Thu', bookings: 22 },
    { day: 'Fri', bookings: 18 },
    { day: 'Sat', bookings: 5 },
    { day: 'Sun', bookings: 3 },
  ];

  const upcomingBookings = bookings
    .filter((b) => b.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Admin Overview</h2>
        <p className="text-muted-foreground">Monitor system-wide room and booking activity</p>
      </motion.div>

      {/* Quick Stats */}
      <StaggerContainer>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <TiltCard tiltAmount={10}>
            <AnimatedCard delay={0} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Available Rooms</CardTitle>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center"
            >
              <Building2 className="h-5 w-5 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {availableRooms}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              {bookedRooms} currently booked
            </p>
          </CardContent>
        </Card>
            </AnimatedCard>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard tiltAmount={10}>
            <AnimatedCard delay={0.1} className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Under Maintenance</CardTitle>
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center"
            >
              <Clock className="h-5 w-5 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {maintenanceRooms}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              {maintenance.filter(m => m.status === 'in-progress').length} in progress
            </p>
          </CardContent>
        </Card>
            </AnimatedCard>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard tiltAmount={10}>
            <AnimatedCard delay={0.2} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Bookings</CardTitle>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center"
            >
              <Calendar className="h-5 w-5 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {activeBookings}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              Upcoming reservations
            </p>
          </CardContent>
        </Card>
            </AnimatedCard>
          </TiltCard>
        </StaggerItem>

        <StaggerItem>
          <TiltCard tiltAmount={10}>
            <AnimatedCard delay={0.3} className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Conflict Alerts</CardTitle>
            <motion.div
              animate={{ rotate: conflicts.length > 0 ? [0, 15, -15, 0] : 0 }}
              transition={{ duration: 0.5, repeat: conflicts.length > 0 ? Infinity : 0, repeatDelay: 3 }}
              className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center"
            >
              <AlertTriangle className="h-5 w-5 text-white" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {conflicts.length}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
            </AnimatedCard>
          </TiltCard>
        </StaggerItem>
      </div>
      </StaggerContainer>

      {/* Room Check-in/Check-out for Admin */}
      <RoomCheckInOut bookings={bookings} />

      {/* Admin Quick Actions */}
      {onCreateBooking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <QuickActions
            onCreateBooking={onCreateBooking}
            onBrowseRooms={onBrowseRooms || (() => {})}
            onViewBookings={onViewBookings || (() => {})}
            onViewAnalytics={onViewAnalytics}
            isAdmin={true}
          />
        </motion.div>
      )}

      {/* Quick Booking Calendar and Room Utilization */}
      {onCreateBooking && (
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <QuickBookingCalendar
              bookings={bookings}
              rooms={rooms}
              onSelectDate={(date) => console.log('Selected date:', date)}
              onCreateBooking={onCreateBooking}
              onQuickBook={(booking) => {
                console.log('Quick book:', booking);
                onCreateBooking();
              }}
            />
          </motion.div>

          <RoomUtilization rooms={rooms} bookings={bookings} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Utilization Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Booking Trends
            </CardTitle>
            <CardDescription>Number of bookings per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ChartContainer config={{
                bookings: {
                  label: 'Bookings',
                  color: 'hsl(var(--chart-1))',
                },
              }} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Bookings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Next scheduled room reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{booking.roomName}</p>
                      <Badge variant="secondary" className="text-xs">
                        {booking.startTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {booking.purpose}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.userName} • {booking.userDepartment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Booking Conflicts
            </CardTitle>
            <CardDescription>
              These bookings have scheduling conflicts that need resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="p-4 rounded-lg border border-destructive/50 bg-destructive/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4>{conflict.roomName}</h4>
                    <Badge variant="destructive">{conflict.timeRange}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {conflict.bookings.length} overlapping bookings on {conflict.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Schedule */}
      {maintenance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming and ongoing room maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenance.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4>{item.roomName}</h4>
                      <Badge
                        variant={
                          item.status === 'in-progress'
                            ? 'default'
                            : item.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.startDate} to {item.endDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
