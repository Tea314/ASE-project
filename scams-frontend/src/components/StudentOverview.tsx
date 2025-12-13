import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, Clock, User } from 'lucide-react';
import { scheduleService } from '../services/scheduleService';
import type { Booking } from '@/types';
import { StaggerContainer, StaggerItem } from './PageTransition';
import { format } from 'date-fns';

export function StudentOverview() {
  const [bookedRooms, setBookedRooms] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookedRooms = async () => {
      try {
        const allBookings = await scheduleService.getAllSchedules();
        const upcomingBookings = allBookings
          .filter(booking => new Date(booking.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setBookedRooms(upcomingBookings);
      } catch (error) {
        console.error("Failed to fetch booked rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Upcoming Booked Rooms</h2>
        <p className="text-muted-foreground">
          Here are the rooms that have been booked by lecturers.
        </p>
      </motion.div>

      {bookedRooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Upcoming Bookings</h3>
          <p className="text-muted-foreground">It looks like there are no rooms booked for the upcoming days.</p>
        </motion.div>
      ) : (
        <StaggerContainer>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookedRooms.map((booking) => (
              <StaggerItem key={booking.id}>
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/40">
                    <CardTitle className="flex items-center gap-2">
                      {booking.roomName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.userName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(booking.date), 'EEEE, MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
}
