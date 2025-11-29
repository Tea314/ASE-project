import { motion } from 'motion/react';
import { CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Bell, Star, Users } from 'lucide-react';
import type { Booking, Room, Notification } from '@/types';
import { format } from 'date-fns';
import { AnimatedCard } from './AnimatedCard';
import { AnimatedButton } from './AnimatedButton';
import { StaggerContainer, StaggerItem } from './PageTransition';
import { TiltCard } from './TiltCard';
import { QuickBookingCalendar } from './QuickBookingCalendar';
import { QuickActions } from './QuickActions';
import { RoomCheckInOut } from './RoomCheckInOut';
import { RoomUtilization } from './RoomUtilization';

interface OverviewProps {
  bookings: Booking[];
  rooms: Room[];
  notifications: Notification[];
  onViewRoom: (roomId: string) => void;
  onCreateBooking: () => void;
  onBrowseRooms?: () => void;
  onViewBookings?: () => void;
}

export function Overview({
  bookings,
  rooms,
  notifications,
  onViewRoom,
  onCreateBooking,
  onBrowseRooms,
  onViewBookings
}: OverviewProps) {
  const upcomingBookings = bookings
    .filter((b) => b.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const availableRooms = rooms.slice(0, 4);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats */}
      <StaggerContainer>
        <div className="grid gap-4 md:grid-cols-3">
          <StaggerItem>
            <TiltCard tiltAmount={10}>
              <AnimatedCard delay={0} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Upcoming Bookings</CardTitle>
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
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {upcomingBookings.length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">Active reservations</p>
                </CardContent>
              </AnimatedCard>
            </TiltCard>
          </StaggerItem>

          <StaggerItem>
            <TiltCard tiltAmount={10}>
              <AnimatedCard delay={0.1} className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Available Rooms</CardTitle>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center"
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {rooms.length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">Ready to book</p>
                </CardContent>
              </AnimatedCard>
            </TiltCard>
          </StaggerItem>

          <StaggerItem>
            <TiltCard tiltAmount={10}>
              <AnimatedCard delay={0.2} className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Notifications</CardTitle>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: unreadNotifications > 0 ? Infinity : 0, repeatDelay: 3 }}
                    className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center relative"
                  >
                    <Bell className="h-5 w-5 text-white" />
                    {unreadNotifications > 0 && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {unreadNotifications}
                      </motion.div>
                    )}
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {unreadNotifications}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">Unread messages</p>
                </CardContent>
              </AnimatedCard>
            </TiltCard>
          </StaggerItem>
        </div>
      </StaggerContainer>

      {/* Room Check-in/Check-out */}
      <RoomCheckInOut bookings={bookings} />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <QuickActions
          onCreateBooking={onCreateBooking}
          onBrowseRooms={onBrowseRooms || (() => { })}
          onViewBookings={onViewBookings || (() => { })}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Booking Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <QuickBookingCalendar
            bookings={bookings}
            rooms={rooms}
            onSelectDate={(date) => console.log('Selected date:', date)}
            onCreateBooking={onCreateBooking}
            onQuickBook={(booking) => {
              console.log('Quick book:', booking);
              // This will be handled by parent component
              onCreateBooking();
            }}
          />
        </motion.div>

        {/* Room Utilization */}
        <RoomUtilization rooms={rooms} bookings={bookings} />
      </div>

      {/* My Upcoming Bookings */}
      <AnimatedCard delay={0.3}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled meetings and reservations</CardDescription>
          </div>
          <AnimatedButton onClick={onCreateBooking} glow>
            New Booking
          </AnimatedButton>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <motion.div
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              </motion.div>
              <p>No upcoming bookings</p>
              <AnimatedButton onClick={onCreateBooking} variant="link" className="mt-2">
                Create your first booking
              </AnimatedButton>
            </motion.div>
          ) : (
            <StaggerContainer>
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <StaggerItem key={booking.id}>
                    <motion.div
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      whileHover={{ scale: 1.02, x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4>{booking.roomName}</h4>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Badge variant="secondary">{booking.purpose}</Badge>
                          </motion.div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(booking.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}
        </CardContent>
      </AnimatedCard>

      {/* Quick Access - Available Rooms */}
      <AnimatedCard delay={0.4}>
        <CardHeader>
          <CardTitle>Available Rooms</CardTitle>
          <CardDescription>Quick access to popular meeting spaces</CardDescription>
        </CardHeader>
        <CardContent>
          <StaggerContainer>
            <div className="grid gap-4 sm:grid-cols-2">
              {availableRooms.map((room) => (
                <StaggerItem key={room.id}>
                  <motion.div
                    className="group cursor-pointer rounded-lg border bg-card overflow-hidden hover:border-primary transition-colors"
                    onClick={() => onViewRoom(room.id)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <motion.img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      {room.isFavorite && (
                        <motion.div
                          className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </motion.div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h4>{room.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {room.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {room.capacity}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}
