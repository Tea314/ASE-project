import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  LogIn,
  LogOut,
  Clock,
  AlertCircle,
  Timer
} from 'lucide-react';
import type { Booking } from '@/types';
import { toast } from 'sonner';

interface RoomCheckInOutProps {
  bookings: Booking[];
  onCheckIn?: (bookingId: string) => void;
  onCheckOut?: (bookingId: string) => void;
}

export function RoomCheckInOut({ bookings, onCheckIn, onCheckOut }: RoomCheckInOutProps) {
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinutes;

  // Find active bookings (happening now)
  const activeBookings = bookings.filter(booking => {
    if (booking.status !== 'upcoming') return false;

    const bookingDate = new Date(booking.date);
    const today = new Date();

    // Check if booking is today
    if (bookingDate.toDateString() !== today.toDateString()) return false;

    // Parse start and end times
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);

    const startTimeMinutes = startHour * 60 + startMin;
    const endTimeMinutes = endHour * 60 + endMin;

    // Check if current time is within booking window (allow 15 min early check-in)
    return currentTimeMinutes >= (startTimeMinutes - 15) && currentTimeMinutes <= endTimeMinutes;
  });

  const handleCheckIn = async (bookingId: string) => {
    setCheckingIn(bookingId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onCheckIn) {
      onCheckIn(bookingId);
    }

    toast.success('Checked in successfully!', {
      description: 'Room is now active for your meeting',
    });

    setCheckingIn(null);
  };

  const handleCheckOut = async (bookingId: string) => {
    setCheckingOut(bookingId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onCheckOut) {
      onCheckOut(bookingId);
    }

    toast.success('Checked out successfully!', {
      description: 'Room is now available for others',
    });

    setCheckingOut(null);
  };

  if (activeBookings.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="h-5 w-5 text-primary" />
                </motion.div>
                Active Bookings
              </CardTitle>
              <CardDescription>
                Check in or check out from your current room bookings
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Timer className="h-3 w-3" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activeBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{booking.roomName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {booking.purpose}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={checkingIn === booking.id}
                          >
                            {checkingIn === booking.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Timer className="h-4 w-4" />
                                </motion.div>
                                Checking In...
                              </>
                            ) : (
                              <>
                                <LogIn className="h-4 w-4" />
                                Check In
                              </>
                            )}
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleCheckOut(booking.id)}
                            disabled={checkingOut === booking.id}
                          >
                            {checkingOut === booking.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Timer className="h-4 w-4" />
                                </motion.div>
                                Checking Out...
                              </>
                            ) : (
                              <>
                                <LogOut className="h-4 w-4" />
                                Check Out
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
