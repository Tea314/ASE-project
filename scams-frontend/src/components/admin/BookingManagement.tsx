import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Search, Plus, Edit, Trash2, AlertTriangle, Users } from 'lucide-react';
import type { Booking, BookingConflict } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

interface BookingManagementProps {
  bookings: Booking[];
  conflicts: BookingConflict[];
  onCreateBooking: () => void;
  onEditBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onResolveConflict: (conflictId: string) => void;
}

export function BookingManagement({
  bookings,
  conflicts,
  onCreateBooking,
  onEditBooking,
  onCancelBooking,
  onResolveConflict,
}: BookingManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((booking) =>
    booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingBookings = filteredBookings.filter((b) => b.status === 'upcoming');
  const completedBookings = filteredBookings.filter((b) => b.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Booking Management</h2>
          <p className="text-muted-foreground">Manage all room reservations</p>
        </div>
        <Button onClick={onCreateBooking} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Booking
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Past ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="conflicts">
            Conflicts ({conflicts.length})
            {conflicts.length > 0 && (
              <AlertTriangle className="ml-1 h-3 w-3 text-destructive" />
            )}
          </TabsTrigger>
        </TabsList>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by room, employee, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value="upcoming">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Booked By</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.roomName}</TableCell>
                    <TableCell>{format(new Date(booking.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{booking.userName}</p>
                        <p className="text-xs text-muted-foreground">{booking.userDepartment}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.purpose}</TableCell>
                    <TableCell>
                      <Badge variant="default">Upcoming</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditBooking(booking.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancelBooking(booking.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Booked By</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.roomName}</TableCell>
                    <TableCell>{format(new Date(booking.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{booking.userName}</p>
                        <p className="text-xs text-muted-foreground">{booking.userDepartment}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.purpose}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Completed</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          {conflicts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <CardDescription>No booking conflicts at this time</CardDescription>
              </CardContent>
            </Card>
          ) : (
            conflicts.map((conflict) => (
              <Card key={conflict.id} className="border-destructive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        {conflict.roomName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {conflict.date} • {conflict.timeRange}
                      </CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => onResolveConflict(conflict.id)}
                    >
                      Resolve Conflict
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      {conflict.bookings.length} overlapping bookings:
                    </p>
                    {conflict.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                      >
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{booking.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.purpose} • {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
