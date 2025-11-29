import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import type { Room } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface QuickBookingDialogProps {
  open: boolean;
  onClose: () => void;
  rooms: Room[];
  onBookRoom: (booking: {
    roomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
    teamMembers: string[];
  }) => void;
  preselectedDate?: Date;
}

export function QuickBookingDialog({
  open,
  onClose,
  rooms,
  onBookRoom,
  preselectedDate
}: QuickBookingDialogProps) {
  const [currentStep, setCurrentStep] = useState<'room' | 'datetime' | 'details'>('room');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(preselectedDate || new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [purpose, setPurpose] = useState('');
  const [teamMembers, setTeamMembers] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCurrentStep('room');
        setSelectedRoom(null);
        setSelectedDate(preselectedDate || new Date());
        setStartTime('09:00');
        setEndTime('10:00');
        setPurpose('');
        setTeamMembers('');
        setSearchQuery('');
        setCapacityFilter(null);
      }, 300);
    }
  }, [open, preselectedDate]);

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity = capacityFilter === null || room.capacity >= capacityFilter;
    return matchesSearch && matchesCapacity;
  });

  // Time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setCurrentStep('datetime');
  };

  const handleDateTimeNext = () => {
    if (!startTime || !endTime) {
      toast.error('Please select both start and end times');
      return;
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      toast.error('End time must be after start time');
      return;
    }

    setCurrentStep('details');
  };

  const handleSubmit = () => {
    if (!selectedRoom || !purpose.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const teamMembersList = teamMembers
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    onBookRoom({
      roomId: selectedRoom.id,
      date: selectedDate,
      startTime,
      endTime,
      purpose: purpose.trim(),
      teamMembers: teamMembersList,
    });

    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'room':
        return 'Select a Room';
      case 'datetime':
        return 'Choose Date & Time';
      case 'details':
        return 'Booking Details';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{getStepTitle()}</DialogTitle>
              <DialogDescription>
                {currentStep === 'room' && 'Browse and select your perfect meeting space'}
                {currentStep === 'datetime' && 'Pick the best time for your meeting'}
                {currentStep === 'details' && 'Add final details to complete your booking'}
              </DialogDescription>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {['room', 'datetime', 'details'].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <motion.div
                  className={`h-2 rounded-full flex-1 ${currentStep === step
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : index < ['room', 'datetime', 'details'].indexOf(currentStep)
                      ? 'bg-green-600'
                      : 'bg-muted'
                    }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Room Selection */}
              {currentStep === 'room' && (
                <motion.div
                  key="room"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Search and Filters */}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[4, 8, 12, 20].map(capacity => (
                        <Button
                          key={capacity}
                          size="sm"
                          variant={capacityFilter === capacity ? 'default' : 'outline'}
                          onClick={() => setCapacityFilter(capacityFilter === capacity ? null : capacity)}
                        >
                          {capacity}+ seats
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Room Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {filteredRooms.map((room, index) => (
                      <motion.button
                        key={room.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleRoomSelect(room)}
                        className="text-left rounded-xl border-2 overflow-hidden hover:border-primary transition-all group"
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                              <Users className="h-3 w-3 mr-1" />
                              {room.capacity}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4>{room.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {room.location}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {room.equipment.slice(0, 3).map((eq) => (
                              <Badge key={eq} variant="outline" className="text-xs">
                                {eq}
                              </Badge>
                            ))}
                            {room.equipment.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{room.equipment.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {filteredRooms.length === 0 && (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No rooms found matching your criteria</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Date & Time Selection */}
              {currentStep === 'datetime' && selectedRoom && (
                <motion.div
                  key="datetime"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Selected Room Info */}
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4>{selectedRoom.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedRoom.location}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCurrentStep('room')}
                      >
                        Change Room
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div className="space-y-3">
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-lg border"
                      />
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>Start Time</Label>
                        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                          {timeSlots.map((time) => (
                            <Button
                              key={`start-${time}`}
                              size="sm"
                              variant={startTime === time ? 'default' : 'outline'}
                              onClick={() => setStartTime(time)}
                              className="w-full"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>End Time</Label>
                        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                          {timeSlots.map((time) => (
                            <Button
                              key={`end-${time}`}
                              size="sm"
                              variant={endTime === time ? 'default' : 'outline'}
                              onClick={() => setEndTime(time)}
                              className="w-full"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Duration Display */}
                      {startTime && endTime && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 rounded-lg bg-primary/10 border border-primary/20"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {format(selectedDate, 'MMM dd, yyyy')} • {startTime} - {endTime}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setCurrentStep('room')}>
                      Back
                    </Button>
                    <Button onClick={handleDateTimeNext}>
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {currentStep === 'details' && selectedRoom && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Booking Summary */}
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <h4 className="mb-3">Booking Summary</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedRoom.name}</span>
                        <Badge variant="outline">{selectedRoom.location}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{format(selectedDate, 'EEEE, MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{startTime} - {endTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="purpose">
                        Meeting Purpose <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="purpose"
                        placeholder="e.g., Team Standup, Client Meeting, Workshop"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team">Team Members (optional)</Label>
                      <Textarea
                        id="team"
                        placeholder="Enter names separated by commas (e.g., John Doe, Jane Smith)"
                        value={teamMembers}
                        onChange={(e) => setTeamMembers(e.target.value)}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple names with commas
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setCurrentStep('datetime')}>
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm Booking
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
