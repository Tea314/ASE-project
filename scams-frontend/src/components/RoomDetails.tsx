import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, MapPin, Users, Calendar as CalendarIcon, Loader2, AlertCircle, Clock } from 'lucide-react';
import type { Room, RoomSchedule } from '@/types';
import { Calendar } from './ui/calendar';
import { roomService } from '@/services/roomService';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleCreateBooking } = useAppContext();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [roomSchedule, setRoomSchedule] = useState<RoomSchedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) {
        setError("Room ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedRoom = await roomService.getRoomById(parseInt(id));
        setRoom(fetchedRoom);
      } catch (err) {
        console.error("Failed to fetch room details:", err);
        setError("Failed to load room details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id]);

  // Fetch room schedule for selected date
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!room || !selectedDate) return;

      try {
        setScheduleLoading(true);
        setScheduleError(null);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const schedule = await roomService.getRoomSchedule(room.id, dateString);
        setRoomSchedule(schedule);
      } catch (err) {
        console.error("Failed to fetch room schedule:", err);
        setScheduleError("Failed to load schedule. Please try again.");
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchSchedule();
  }, [room, selectedDate]);

  const handleBookRoom = () => {
    if (room) {
      handleCreateBooking(room.id);
      // Optionally, navigate to a booking page or open a dialog
    }
  };

  const generateTimeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-red-500">
        <AlertCircle className="h-10 w-10 mb-3" />
        <p>{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-muted-foreground">
        <AlertCircle className="h-10 w-10 mb-3" />
        <p>Room not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to rooms
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Room Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={roomService.getRoomImage(room)}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3" />
                    {roomService.formatRoomLocation(room)}
                  </CardDescription>
                </div>
                {/* Removed favorite button as it's not in Room type */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4>Capacity</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {room.capacity} people
                  </Badge>
                </div>
              </div>

              <div>
                <h4>Equipment & Amenities</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {room.devices.map((device) => (
                    <Badge key={device.id} variant="outline">
                      {device.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleBookRoom} className="w-full">
                Book This Room
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Availability Calendar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Live Availability
              </CardTitle>
              <CardDescription>
                Select a date to view available time slots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />

              {selectedDate && (
                <div className="space-y-2">
                  <h4>
                    Available Slots - {format(selectedDate, 'PPP')}
                  </h4>
                  {scheduleLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : scheduleError ? (
                    <div className="text-red-500 text-center">
                      <AlertCircle className="h-5 w-5 inline-block mr-2" />
                      {scheduleError}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {generateTimeSlots.map((time) => {
                        const isBooked = roomSchedule?.scheduled_slots.includes(time);
                        return (
                          <Button
                            key={time}
                            variant={isBooked ? 'outline' : 'secondary'}
                            size="sm"
                            disabled={isBooked}
                            className={isBooked ? 'opacity-50' : ''}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-secondary rounded" />
                      Available
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-muted border rounded" />
                      Booked
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
