import { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Trash2,
  Edit,
  Plus,
  MoreVertical
} from 'lucide-react';
import type { Booking } from '@/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface MyBookingsProps {
  bookings: Booking[];
  onCreateBooking: () => void;
  onEditBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

interface GroupedBooking extends Booking {
  isGrouped?: boolean;
  totalDuration?: number;
  relatedIds?: string[];
}

interface EmptyStateProps {
  type: 'upcoming' | 'past';
  onCreate: () => void;
}

const EmptyState = ({ type, onCreate }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-lg bg-gray-50/50">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
      {type === 'upcoming' ? (
        <CalendarDays className="h-8 w-8 text-primary/40" />
      ) : (
        <Clock className="h-8 w-8 text-muted-foreground/40" />
      )}
    </div>
    <h3 className="text-lg font-semibold mb-1">
      {type === 'upcoming' ? "No Upcoming Bookings" : "No Past Bookings"}
    </h3>
    <p className="text-sm text-muted-foreground max-w-xs mb-6">
      {type === 'upcoming'
        ? "You don't have any scheduled meetings at the moment."
        : "Your booking history is currently empty."}
    </p>
    {type === 'upcoming' && (
      <Button onClick={onCreate} className="gap-2 shadow-lg shadow-primary/20">
        <Plus className="h-4 w-4" /> Book a Room
      </Button>
    )}
  </div>
);

interface BookingCardProps {
  booking: GroupedBooking;
  isPast?: boolean;
  onEdit: (id: string) => void;
  onCancelClick: (id: string) => void;
}

const BookingCard = ({ booking, isPast = false, onEdit, onCancelClick }: BookingCardProps) => {
  const statusColor = isPast ? "bg-gray-100 border-gray-200" : "bg-white border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow";
  const dateObj = new Date(booking.date);

  return (
    <Card className={`overflow-hidden border border-gray-100 ${statusColor}`}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Cột trái: Ngày tháng */}
          <div className={`flex flex-row sm:flex-col items-center justify-center p-4 sm:w-24 shrink-0 gap-2 sm:gap-0 ${isPast ? 'bg-gray-50' : 'bg-primary/5'}`}>
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
              {format(dateObj, 'MMM')}
            </span>
            <span className={`text-2xl sm:text-3xl font-bold ${isPast ? 'text-gray-500' : 'text-primary'}`}>
              {format(dateObj, 'dd')}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {format(dateObj, 'EEE')}
            </span>
          </div>

          {/* Cột giữa: Thông tin chính */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center gap-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-semibold text-lg line-clamp-1 ${isPast && 'text-muted-foreground'}`}>
                  {booking.purpose}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" />
                  <span className="font-medium text-foreground/80">{booking.roomName}</span>
                </div>
              </div>

              {/* Mobile Actions Dropdown */}
              <div className="hidden">
                {!isPast && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(booking.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => onCancelClick(booking.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-medium text-slate-700">
                  {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                </span>
              </div>

              {booking.teamMembers && booking.teamMembers.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{booking.teamMembers.length} members</span>
                </div>
              )}
            </div>
          </div>

          {/* {!isPast && ( */}
          {/*   <div className="hidden sm:flex flex-col items-center justify-center p-4 border-l border-gray-50 gap-2 bg-gray-50/50 w-32"> */}
          {/*     <Button */}
          {/*       variant="ghost" */}
          {/*       size="sm" */}
          {/*       className="w-full justify-start hover:text-primary hover:bg-primary/10" */}
          {/*       onClick={() => onEdit(booking.id)} */}
          {/*     > */}
          {/*       <Edit className="mr-2 h-3.5 w-3.5" /> Edit */}
          {/*     </Button> */}
          {/*     <Button */}
          {/*       variant="ghost" */}
          {/*       size="sm" */}
          {/*       className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50" */}
          {/*       onClick={() => onCancelClick(booking.id)} */}
          {/*     > */}
          {/*       <Trash2 className="mr-2 h-3.5 w-3.5" /> Cancel */}
          {/*     </Button> */}
          {/*   </div> */}
          {/* )} */}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Component Chính ---
export function MyBookings({ bookings, onCreateBooking, onEditBooking, onCancelBooking }: MyBookingsProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const groupBookings = (rawBookings: Booking[]): GroupedBooking[] => {
    if (rawBookings.length === 0) return [];
    const sorted = [...rawBookings].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    const groups: GroupedBooking[] = [];
    let currentGroup: GroupedBooking | null = null;

    sorted.forEach((booking) => {
      if (!currentGroup) {
        currentGroup = { ...booking, relatedIds: [booking.id] };
        return;
      }
      const isContinuous =
        booking.date === currentGroup.date &&
        booking.roomId === currentGroup.roomId &&
        booking.purpose === currentGroup.purpose &&
        booking.startTime === currentGroup.endTime;

      if (isContinuous) {
        currentGroup.endTime = booking.endTime;
        currentGroup.relatedIds?.push(booking.id);
        currentGroup.isGrouped = true;
      } else {
        groups.push(currentGroup);
        currentGroup = { ...booking, relatedIds: [booking.id] };
      }
    });
    if (currentGroup) groups.push(currentGroup);
    return groups;
  };

  const upcomingBookings = useMemo(() =>
    groupBookings(bookings.filter((b) => b.status === 'upcoming')),
    [bookings]);

  const pastBookings = useMemo(() =>
    groupBookings(bookings.filter((b) => b.status === 'completed')),
    [bookings]);

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (bookingToCancel) {
      onCancelBooking(bookingToCancel);
    }
    setCancelDialogOpen(false);
    setBookingToCancel(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground mt-1">Track and manage your room reservations</p>
        </div>
        <Button onClick={onCreateBooking} size="lg" className="gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          New Booking
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="upcoming" className="py-2.5 px-6">
            Upcoming
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              {upcomingBookings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="past" className="py-2.5 px-6">
            Past
            <Badge variant="secondary" className="ml-2">
              {pastBookings.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="animate-in fade-in-50 duration-500">
          {upcomingBookings.length === 0 ? (
            <EmptyState type="upcoming" onCreate={onCreateBooking} />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onEdit={onEditBooking} // Truyền prop vào
                  onCancelClick={handleCancelClick} // Truyền prop vào
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="animate-in fade-in-50 duration-500">
          {pastBookings.length === 0 ? (
            <EmptyState type="past" onCreate={onCreateBooking} />
          ) : (
            <div className="grid grid-cols-1 gap-4 opacity-75">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isPast={true}
                  onEdit={onEditBooking}
                  onCancelClick={handleCancelClick}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Cancel Booking
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to cancel this booking? This action cannot be undone and the room slot will be made available for others.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
