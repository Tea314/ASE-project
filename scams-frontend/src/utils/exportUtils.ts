import type { Booking, Room, User, UtilizationData, DepartmentUsage } from "@/types";

export function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`;
        }
        // Escape quotes in strings
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBookingsCSV(bookings: Booking[]) {
  const data = bookings.map(booking => ({
    'Booking ID': booking.id,
    'Room': booking.roomName,
    'User': booking.userName || 'N/A',
    'Department': booking.userDepartment || 'N/A',
    'Date': booking.date,
    'Start Time': booking.startTime,
    'End Time': booking.endTime,
    'Purpose': booking.purpose,
    'Team Members': booking.teamMembers.join('; '),
    'Status': booking.status,
    'Created At': booking.createdAt,
  }));

  downloadCSV(data, 'bookings');
}

export function exportRoomsCSV(rooms: Room[]) {
  const data = rooms.map(room => ({
    'Room ID': room.id,
    'Name': room.name,
    'Type': room.type || 'N/A',
    'Location': room.location,
    'Floor': room.floor || 'N/A',
    'Capacity': room.capacity,
    'Status': room.status || 'available',
    'Equipment': room.equipment.join('; '),
  }));

  downloadCSV(data, 'rooms');
}

export function exportUsersCSV(users: User[]) {
  const data = users.map(user => ({
    'User ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Department': user.department,
    'Role': user.role,
    'Status': user.status || 'active',
    'Created At': user.createdAt || 'N/A',
  }));

  downloadCSV(data, 'users');
}

export function exportUtilizationCSV(utilization: UtilizationData[]) {
  const data = utilization.map(item => ({
    'Room': item.roomName,
    'Total Hours': item.totalHours,
    'Booked Hours': item.bookedHours,
    'Utilization Rate': `${item.utilizationRate}%`,
  }));

  downloadCSV(data, 'room_utilization');
}

export function exportDepartmentUsageCSV(departmentUsage: DepartmentUsage[]) {
  const data = departmentUsage.map(item => ({
    'Department': item.department,
    'Booking Count': item.bookingCount,
    'Total Hours': item.totalHours,
  }));

  downloadCSV(data, 'department_usage');
}

export function generatePDFContent(type: 'bookings' | 'rooms' | 'users' | 'analytics'): string {
  // This would typically use a library like jsPDF
  // For now, we'll return a mock implementation
  return `PDF report for ${type} generated at ${new Date().toLocaleString()}`;
}
