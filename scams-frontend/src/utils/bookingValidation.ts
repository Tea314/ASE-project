import type { Booking } from '@/types';

export interface BookingConflictCheck {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  message?: string;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function checkBookingConflict(
  bookings: Booking[],
  newBooking: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
  },
  excludeBookingId?: string
): BookingConflictCheck {

  const newStartMin = toMinutes(newBooking.startTime);
  const newEndMin = toMinutes(newBooking.endTime);

  const conflictingBookings = bookings.filter((booking) => {
    if (booking.status === 'cancelled' || booking.id === excludeBookingId) {
      return false;
    }

    if (String(booking.roomId) !== String(newBooking.roomId) || booking.date !== newBooking.date) {
      return false;
    }

    const existingStartMin = toMinutes(booking.startTime);
    const existingEndMin = toMinutes(booking.endTime);

    const isOverlapping = newStartMin < existingEndMin && newEndMin > existingStartMin;

    return isOverlapping;
  });

  return {
    hasConflict: conflictingBookings.length > 0,
    conflictingBookings,
    message:
      conflictingBookings.length > 0
        ? `Conflict detected! This time slot overlaps with ${conflictingBookings.length} existing booking(s).`
        : undefined,
  };
}


export function validateBookingTime(startTime: string, endTime: string): {
  isValid: boolean;
  message?: string;
} {
  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);

  if (endMin <= startMin) {
    return {
      isValid: false,
      message: 'End time must be after start time',
    };
  }

  const duration = endMin - startMin;
  if (duration < 30) {
    return {
      isValid: false,
      message: 'Booking must be at least 30 minutes',
    };
  }

  if (duration > 480) {
    return {
      isValid: false,
      message: 'Booking cannot exceed 8 hours',
    };
  }

  return { isValid: true };
}

export function validateBookingDate(date: string): {
  isValid: boolean;
  message?: string;
} {
  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bookingDate < today) {
    return {
      isValid: false,
      message: 'Cannot book rooms in the past',
    };
  }

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  if (bookingDate > maxDate) {
    return {
      isValid: false,
      message: 'Cannot book rooms more than 90 days in advance',
    };
  }

  return { isValid: true };
}

export function generateHourlyTimeSlots(startHour = 7, endHour = 21): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}
