import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Building2,
  Briefcase,
  CalendarRange,
  Eye,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import type { Room, Booking } from '../types';
import { TiltCard } from './TiltCard';
import { roomService } from '../services/roomService';
import { scheduleService, type GetSchedulesParams } from '../services/scheduleService';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
type ViewMode = 'grid' | 'timeline';
type FilterStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';

interface BookedRoomsViewAPIProps {
  initialBookings?: Booking[];
}

export function BookedRoomsViewAPI({ initialBookings = [] }: BookedRoomsViewAPIProps) {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [bookingsList, setBookingsList] = useState<Booking[]>(initialBookings);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [selectedDate, setSelectedDate] = useState<string>('all');

  // --- Fetch Rooms ---
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const fetchedRooms = await roomService.getAllRooms();
        setRooms(fetchedRooms);
      } catch (err) {
        console.warn('Room API unavailable:', err);
        setError('Could not load room details.');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // --- Fetch Schedules (Bookings) ---
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoadingBookings(true);
      try {
        const params: GetSchedulesParams = {};

        // 1. Filter by Date
        if (selectedDate !== 'all') {
          params.date = selectedDate;
        }

        // 2. Filter by Building
        if (selectedBuilding !== 'all') {
          params.building_id = parseInt(selectedBuilding);
        }

        const data = await scheduleService.getAllSchedules(params);
        setBookingsList(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch schedules', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchSchedules();
  }, [selectedDate, selectedBuilding]);

  // --- Derived Data for UI Filters ---

  const floors = useMemo(() => {
    const floorSet = new Set(rooms.map(room => room.floor_number.toString()));
    return Array.from(floorSet).sort((a, b) => parseInt(a) - parseInt(b));
  }, [rooms]);

  const buildings = useMemo(() => {
    const buildingMap = new Map<number, string>();
    rooms.forEach(room => {
      buildingMap.set(room.building_id, room.building_name);
    });
    return Array.from(buildingMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [rooms]);

  const dates = useMemo(() => {
    const dateSet = new Set(bookingsList.map(b => b.date));
    dateSet.add(new Date().toISOString().split('T')[0]);
    return Array.from(dateSet).sort();
  }, [bookingsList]);

  const getRoomById = (roomId: number | string): Room | undefined => {
    return rooms.find(r => r.id.toString() === roomId.toString());
  };

  // --- Client-side Filtering ---
  const filteredBookings = useMemo(() => {
    return bookingsList.filter(booking => {
      const room = getRoomById(booking.roomId);

      // Search filter (Client side)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        booking.roomName.toLowerCase().includes(searchLower) ||
        booking.userName?.toLowerCase().includes(searchLower) ||
        booking.purpose.toLowerCase().includes(searchLower) ||
        booking.userDepartment?.toLowerCase().includes(searchLower) ||
        room?.building_name.toLowerCase().includes(searchLower);

      const matchesFloor = selectedFloor === 'all' ||
        room?.floor_number.toString() === selectedFloor;

      const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;

      const matchesBuilding = selectedBuilding === 'all' || room?.building_id.toString() === selectedBuilding;
      const matchesDate = selectedDate === 'all' || booking.date === selectedDate;

      return matchesSearch && matchesFloor && matchesStatus && matchesBuilding;
    });
  }, [searchQuery, selectedFloor, selectedBuilding, selectedStatus, selectedDate, bookingsList, rooms]);

  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: Booking[] } = {};
    filteredBookings.forEach(booking => {
      if (!groups[booking.date]) {
        groups[booking.date] = [];
      }
      groups[booking.date].push(booking);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Loading state (Initial load)
  if (loadingRooms && bookingsList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 bg-background/40 backdrop-blur-xl border-white/10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
            <p className="text-muted-foreground">Loading system data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Eye className="w-6 h-6 text-purple-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl flex items-center gap-2">
                Booked Rooms
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </h1>
              <p className="text-muted-foreground">View all room bookings across the organization</p>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/30 mb-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by room, booker, purpose, building, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-white/10 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Building Filter - Triggers API call */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Building</label>
                  <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buildings</SelectItem>
                      {buildings.map(([id, name]) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Floor Filter - Client side */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Floor</label>
                  <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floors</SelectItem>
                      {floors.map(floor => (
                        <SelectItem key={floor} value={floor}>
                          Floor {floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter - Client side */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as FilterStatus)}>
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter - Triggers API call */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background/50 border-white/10",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate && selectedDate !== 'all' ? (
                          format(new Date(selectedDate), "PPP")
                        ) : (
                          <span>Today (Default)</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate === 'all' ? undefined : new Date(selectedDate)}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(format(date, "yyyy-MM-dd"));
                          } else {
                            setSelectedDate('all');
                          }
                        }}
                        initialFocus
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {loadingBookings ? 'Updating...' : `Showing ${filteredBookings.length} bookings`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'timeline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('timeline')}
                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                  >
                    Timeline
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loadingBookings ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBookings.map((booking, index) => {
                const room = getRoomById(booking.roomId);
                const uniqueDevices = room ? roomService.getUniqueDevices(room) : [];

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TiltCard tiltAmount={5}>
                      <Card className="overflow-hidden bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all group h-full">
                        {/* Room Image */}
                        <div className="relative h-48 overflow-hidden">
                          <motion.img
                            src={room ? roomService.getRoomImage(room) : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'}
                            alt={booking.roomName}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                          <Badge className={`absolute top-3 right-3 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </Badge>
                          {room && (
                            <Badge className="absolute top-3 left-3 bg-purple-500/30 text-purple-200 border-purple-500/50">
                              <Users className="w-3 h-3 mr-1" />
                              {room.capacity}
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="mb-1">{booking.roomName}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {booking.purpose}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                            </div>
                            {room && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-pink-400" />
                                <span>{roomService.formatRoomLocation(room)}</span>
                              </div>
                            )}
                            {room && (
                              <div className="flex items-center gap-2 text-sm">
                                <Building2 className="w-4 h-4 text-green-400" />
                                <span>{room.building_name}</span>
                              </div>
                            )}
                          </div>

                          {/* Devices */}
                          {uniqueDevices.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {uniqueDevices.slice(0, 3).map((device, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-white/20">
                                  {device}
                                </Badge>
                              ))}
                              {uniqueDevices.length > 3 && (
                                <Badge variant="outline" className="text-xs border-white/20">
                                  +{uniqueDevices.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="pt-3 border-t border-white/10 space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8 border border-white/20">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                                  {booking.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{booking.userName}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {booking.userDepartment}
                                </p>
                              </div>
                            </div>
                            {booking.teamMembers.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>+{booking.teamMembers.length} team member{booking.teamMembers.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {groupedByDate.map(([date, bookingsForDate], dateIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dateIndex * 0.1 }}
                >
                  <Card className="p-6 bg-background/40 backdrop-blur-xl border-white/10">
                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <CalendarRange className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      <div>
                        <h3>{formatDate(date)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {bookingsForDate.length} booking{bookingsForDate.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative space-y-4 pl-8">
                      {/* Timeline line */}
                      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50" />

                      {bookingsForDate.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((booking, index) => {
                        const room = getRoomById(booking.roomId);
                        return (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                          >
                            {/* Timeline dot */}
                            <motion.div
                              className="absolute -left-[1.65rem] top-3 w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-background"
                              whileHover={{ scale: 1.3 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            />

                            <Card className="p-4 bg-background/60 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="mb-1">{booking.roomName}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {booking.purpose}
                                      </p>
                                    </div>
                                    <Badge className={getStatusColor(booking.status)}>
                                      {booking.status}
                                    </Badge>
                                  </div>

                                  <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-blue-400" />
                                      <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                    </div>
                                    {room && (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-pink-400" />
                                          <span>{roomService.formatRoomLocation(room)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4 text-green-400" />
                                          <span>{room.building_name}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8 border border-white/20">
                                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                                        {booking.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm">{booking.userName}</p>
                                      {booking.teamMembers.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                          +{booking.teamMembers.length} team member{booking.teamMembers.length > 1 ? 's' : ''}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}

              {filteredBookings.length === 0 && !loadingBookings && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <Card className="p-12 bg-background/40 backdrop-blur-xl border-white/10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block mb-4"
                    >
                      <Calendar className="w-16 h-16 text-muted-foreground" />
                    </motion.div>
                    <h3 className="mb-2">No bookings found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to see more results
                    </p>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
