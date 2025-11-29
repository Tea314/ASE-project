import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, MapPin, Users, Star, Calendar as CalendarIcon } from 'lucide-react';
import type { Room } from '@/types';
import { Calendar } from './ui/calendar';

interface RoomDetailsProps {
  room: Room;
  onBack: () => void;
  onBook: (roomId: string) => void;
  onToggleFavorite: (roomId: string) => void;
}

export function RoomDetails({ room, onBack, onBook, onToggleFavorite }: RoomDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock availability data
  const bookedSlots = ['09:00', '10:00', '14:00', '15:00'];
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to rooms
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Room Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={room.image}
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
                    {room.location}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleFavorite(room.id)}
                >
                  <Star
                    className={`h-4 w-4 ${
                      room.isFavorite
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4>Description</h4>
                <p className="text-muted-foreground mt-1">{room.description}</p>
              </div>

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
                  {room.equipment.map((eq) => (
                    <Badge key={eq} variant="outline">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={() => onBook(room.id)} className="w-full">
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
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />

              {selectedDate && (
                <div className="space-y-2">
                  <h4>
                    Available Slots - {selectedDate.toLocaleDateString()}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
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
