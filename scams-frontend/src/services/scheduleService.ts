import type { Booking } from '../types';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:8000/api/v1';

interface ScheduleApiResponse {
  lecturer_id: number;
  schedules: ApiSchedule[];
}

interface ApiSchedule {
  id: number;
  room_id: number;
  room_name: string;
  lecturer_id: number;
  lecturer_name: string;
  building_id: number;
  building_name: string;
  date: string;
  start_time: string;
  purpose: string;
  team_members: string | null;
  created_at: string;
}

/**
 * Maps an API schedule object to the application's Booking type.
 * @param schedule The schedule object from the API.
 * @returns A Booking object.
 */
function mapApiScheduleToBooking(schedule: ApiSchedule): Booking {
  // Assumption: If endTime is not provided, default to 1 hour after startTime.
  const startTimeParts = schedule.start_time.split(':');
  const startHour = parseInt(startTimeParts[0], 10);
  const endHour = (startHour + 1).toString().padStart(2, '0');
  const endTime = `${endHour}:${startTimeParts[1]}`;

  return {
    id: String(schedule.id),
    roomId: String(schedule.room_id),
    roomName: schedule.room_name,
    userId: String(schedule.lecturer_id),
    userName: schedule.lecturer_name,
    date: schedule.date,
    startTime: schedule.start_time.substring(0, 5), // Format HH:mm:ss to HH:mm
    endTime: endTime, // Assumed end time
    purpose: schedule.purpose,
    teamMembers: schedule.team_members ? schedule.team_members.split(',').map(s => s.trim()) : [],
    status: 'upcoming', // Assume all fetched schedules are upcoming
    createdAt: schedule.created_at,
  };
}

export const scheduleService = {
  /**
   * Get all schedules for the currently logged-in user (lecturer).
   * GET /schedules/me
   */
  async getMySchedules(): Promise<Booking[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        // If the server returns a 401 Unauthorized, it's a clean session expiry.
        // For other errors, throw to indicate a server/network problem.
        if (response.status === 401) {
          console.log("User is not authenticated. Can't fetch schedules.");
          return []; // Return empty array, the user will be logged out.
        }
        throw new Error(`Failed to fetch schedules: ${response.statusText}`);
      }

      const data: ScheduleApiResponse = await response.json();
      
      if (!data.schedules) {
        return [];
      }

      const bookings = data.schedules.map(mapApiScheduleToBooking);
      return bookings;

    } catch (error) {
      console.error('Error fetching schedules:', error);
      // Re-throw the error to be handled by the calling function (e.g., in AppContext)
      throw error;
    }
  },

  /**
   * Create a new booking.
   * POST /schedules/
   */
  async createBooking(bookingData: {
    room_id: number;
    date: string;
    start_time: string;
    end_time: string;
    purpose: string;
    team_members: string;
  }): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
        const errorMessage = errorData.detail || `Failed to create booking: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const newApiSchedule: ApiSchedule = await response.json();
      // Map the API response back to the app's Booking type
      return mapApiScheduleToBooking(newApiSchedule);

    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
};
