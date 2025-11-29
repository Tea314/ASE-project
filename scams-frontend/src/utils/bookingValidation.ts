import type { Booking } from '@/types';

export interface BookingConflictCheck {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  message?: string;
}

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
  const conflictingBookings = bookings.filter((booking) => {
    // Skip cancelled bookings and the booking being edited
    if (booking.status === 'cancelled' || booking.id === excludeBookingId) {
      return false;
    }

    // Check if same room and date
    if (booking.roomId !== newBooking.roomId || booking.date !== newBooking.date) {
      return false;
    }

    // Check for time overlap
    const existingStart = booking.startTime;
    const existingEnd = booking.endTime;
    const newStart = newBooking.startTime;
    const newEnd = newBooking.endTime;

    // Convert times to minutes for easier comparison
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const existingStartMin = toMinutes(existingStart);
    const existingEndMin = toMinutes(existingEnd);
    const newStartMin = toMinutes(newStart);
    const newEndMin = toMinutes(newEnd);

    // Check if times overlap
    return (
      (newStartMin >= existingStartMin && newStartMin < existingEndMin) ||
      (newEndMin > existingStartMin && newEndMin <= existingEndMin) ||
      (newStartMin <= existingStartMin && newEndMin >= existingEndMin)
    );
  });

  return {
    hasConflict: conflictingBookings.length > 0,
    conflictingBookings,
    message:
      conflictingBookings.length > 0
        ? `This time slot conflicts with ${conflictingBookings.length} existing booking(s)`
        : undefined,
  };
}

export function validateBookingTime(startTime: string, endTime: string): {
  isValid: boolean;
  message?: string;
} {
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

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
    // 8 hours
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

  // Check if more than 90 days in advance
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

export function getAlternativeRooms(
  allRooms: any[],
  conflictedRoomId: string,
  date: string,
  startTime: string,
  endTime: string,
  bookings: Booking[]
): any[] {
  const conflictedRoom = allRooms.find(r => r.id === conflictedRoomId);
  if (!conflictedRoom) return [];

  // Find rooms with similar capacity that don't have conflicts
  return allRooms
    .filter(room => {
      // Exclude the conflicted room
      if (room.id === conflictedRoomId) return false;

      // Only suggest available rooms
      if (room.status !== 'available') return false;

      // Check capacity (within 50% range)
      const capacityDiff = Math.abs(room.capacity - conflictedRoom.capacity);
      if (capacityDiff > conflictedRoom.capacity * 0.5) return false;

      // Check if this room has no conflicts
      const conflict = checkBookingConflict(bookings, {
        roomId: room.id,
        date,
        startTime,
        endTime,
      });

      return !conflict.hasConflict;
    })
    .slice(0, 3); // Return top 3 alternatives
}
