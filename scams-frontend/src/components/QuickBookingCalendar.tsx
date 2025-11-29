import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import type { Booking, Room } from '@/types';
import { QuickBookingDialog } from './dialogs/QuickBookingDialog';

interface QuickBookingCalendarProps {
  bookings: Booking[];
  rooms?: Room[];
  onSelectDate: (date: Date) => void;
  onCreateBooking: () => void;
  onQuickBook?: (booking: {
    roomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
    teamMembers: string[];
  }) => void;
}

export function QuickBookingCalendar({
  bookings,
  rooms = [],
  onSelectDate,
  onCreateBooking,
  onQuickBook
}: QuickBookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get week starting from Monday
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking =>
      isSameDay(new Date(booking.date), date) && booking.status === 'upcoming'
    );
  };

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  const handleQuickBookClick = () => {
    if (rooms.length > 0 && onQuickBook) {
      setDialogOpen(true);
    } else {
      onCreateBooking();
    }
  };

  const handleBookingSubmit = (booking: {
    roomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
    teamMembers: string[];
  }) => {
    if (onQuickBook) {
      onQuickBook(booking);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <CalendarIcon className="h-5 w-5" />
              </motion.div>
              Quick Booking Calendar
            </CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" onClick={handleQuickBookClick} className="gap-2">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="outline" size="icon" onClick={handlePrevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="text-center">
              <p className="font-medium">{format(currentDate, 'MMMM yyyy')}</p>
              <p className="text-xs text-muted-foreground">
                Week {format(weekStart, 'w')}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const dayBookings = getBookingsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.button
                    className={`
                    w-full aspect-square rounded-xl p-2 flex flex-col items-center justify-center gap-1 transition-all
                    ${isSelected
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                        : isCurrentDay
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                      }
                  `}
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xs opacity-70">
                      {format(day, 'EEE')}
                    </span>
                    <span className={`text-lg font-semibold ${isSelected ? 'text-white' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayBookings.length > 0 && (
                      <motion.div
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Date Bookings */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {format(selectedDate, 'EEEE, MMMM d')}
              </p>
              {selectedDateBookings.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Badge variant="secondary">
                    {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'booking' : 'bookings'}
                  </Badge>
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedDateBookings.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  </motion.div>
                  <p className="text-sm">No bookings for this day</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleQuickBookClick}
                    className="mt-2"
                  >
                    Create a booking
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2 max-h-64 overflow-y-auto"
                >
                  {selectedDateBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{booking.roomName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {booking.purpose}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {booking.startTime}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Quick Booking Dialog */}
      <QuickBookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        rooms={rooms}
        onBookRoom={handleBookingSubmit}
        preselectedDate={selectedDate}
      />
    </>
  );
}
