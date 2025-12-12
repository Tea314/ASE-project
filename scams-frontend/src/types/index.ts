export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'employee' | 'admin';
  status?: 'active' | 'inactive';
  createdAt?: string;
}
export interface Device {
  id: number;
  name: string;
}
export interface Room {
  id: string;
  name: string;
  image_url: string | null;
  floor_number: number;
  building_id: number;
  building_name: string;
  capacity: number;
  devices: Device[];
}
export interface RoomSchedule {
  room_id: number;
  date: string;
  scheduled_slots: string[];
}
export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName?: string;
  userDepartment?: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  teamMembers: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'system' | 'conflict';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface MaintenanceSchedule {
  id: string;
  roomId: number;
  roomName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface BookingConflict {
  id: string;
  roomId: string;
  roomName: string;
  bookings: Booking[];
  date: string;
  timeRange: string;
}

export interface UtilizationData {
  roomId: string;
  roomName: string;
  totalHours: number;
  bookedHours: number;
  utilizationRate: number;
}

export interface DepartmentUsage {
  department: string;
  bookingCount: number;
  totalHours: number;
}
