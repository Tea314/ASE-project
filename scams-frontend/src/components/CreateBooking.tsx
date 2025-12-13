import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, CheckCircle, AlertTriangle, Loader2, Info } from 'lucide-react';
import type { Room, Booking } from '../types';
import { format } from 'date-fns';
import { generateHourlyTimeSlots, checkBookingConflict, validateBookingTime, validateBookingDate } from '../utils/bookingValidation';
import { roomService } from '../services/roomService';
import { cn } from "@/lib/utils";

interface CreateBookingProps {
  rooms: Room[];
  bookings: Booking[];
  onBack: () => void;
  onConfirm: (booking: {
    roomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
    teamMembers: string[];
  }) => Promise<void>;
  preselectedRoomId?: string;
}

export function CreateBooking({ rooms, bookings, onBack, onConfirm, preselectedRoomId }: CreateBookingProps) {

  const [step, setStep] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(preselectedRoomId || '');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [teamMembers, setTeamMembers] = useState('');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateHourlyTimeSlots();
  const selectedRoom = rooms.find((r) => r.id.toString() === selectedRoomId.toString());

  const existingBookingsForDate = useMemo(() => {
    if (!selectedDate || !selectedRoomId) return [];

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    return bookings
      .filter(b =>
        b.roomId.toString() === selectedRoomId.toString() &&
        b.date === dateStr &&
        b.status !== 'cancelled'
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [bookings, selectedDate, selectedRoomId]);

  const isTimeBlocked = (timeStr: string) => {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const timeMin = toMinutes(timeStr);

    return existingBookingsForDate.some(booking => {
      const startMin = toMinutes(booking.startTime);
      let endMin = toMinutes(booking.endTime);
      if (endMin === 0 || !booking.endTime) endMin = startMin + 60;

      return timeMin >= startMin && timeMin < endMin;
    });
  };

  const checkConflicts = () => {
    if (!selectedDate || !startTime || !endTime || !selectedRoomId) {
      return null;
    }

    const dateValidation = validateBookingDate(selectedDate.toISOString().split('T')[0]);
    if (!dateValidation.isValid) return dateValidation.message;

    const timeValidation = validateBookingTime(startTime, endTime);
    if (!timeValidation.isValid) return timeValidation.message;

    const conflictCheck = checkBookingConflict(bookings, {
      roomId: selectedRoomId,
      date: selectedDate.toISOString().split('T')[0],
      startTime,
      endTime,
    });

    if (conflictCheck.hasConflict) return conflictCheck.message;

    return null;
  };

  const handleNext = () => {
    if (step === 2) {
      const error = checkConflicts();
      setValidationError(error);
      if (error) return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = async () => {
    if (selectedDate && selectedRoomId && startTime && endTime) {
      const error = checkConflicts();
      if (error) {
        setValidationError(error);
        return;
      }
      try {
        setIsSubmitting(true);
        setValidationError(null);
        await onConfirm({
          roomId: selectedRoomId,
          date: selectedDate,
          startTime,
          endTime,
          purpose,
          teamMembers: teamMembers.split(',').map((m) => m.trim()).filter(Boolean),
        });
        setShowConfirmation(true);
      } catch (err: any) {
        console.error("Booking submission error:", err);
        setValidationError(err.message || "Failed to create booking.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const canProceedStep1 = selectedRoomId !== '';
  const canProceedStep2 = selectedDate && startTime && endTime;
  const canConfirm = canProceedStep2 && purpose && !isSubmitting;

  if (showConfirmation) {
    return (
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto border-green-500/20 bg-green-500/5">
          <CardContent className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full animate-in zoom-in duration-300">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription className="max-w-md mx-auto text-base">
              Your booking for <span className="font-semibold text-foreground">{selectedRoom?.name}</span> on{' '}
              <span className="font-semibold text-foreground">{selectedDate && format(selectedDate, 'MMMM dd, yyyy')}</span>{' '}
              from <span className="font-semibold text-foreground">{startTime}</span> to <span className="font-semibold text-foreground">{endTime}</span> has been successfully created.
            </CardDescription>
            <div className="pt-6">
              <Button onClick={onBack} size="lg" className="min-w-[200px]">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={onBack} className="gap-2" disabled={isSubmitting}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Booking</h2>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Room</CardTitle>
              <CardDescription>Choose the meeting space for your booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id.toString())}
                    className={`group cursor-pointer rounded-lg border-2 p-0 transition-all overflow-hidden relative ${selectedRoomId.toString() === room.id.toString()
                      ? 'border-primary bg-accent ring-2 ring-primary ring-offset-2'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img
                        src={roomService.getRoomImage(room)}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <span className="font-semibold text-sm">{room.name}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground mb-2">
                        {room.building_name} • Floor {room.floor_number}
                      </p>
                      <Badge variant="outline" className="text-xs gap-1 w-full justify-center">
                        <Users className="h-3 w-3" />
                        Capacity: {room.capacity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={!canProceedStep1}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>
                Choose when you need {selectedRoom?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {validationError && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <div className="border rounded-md p-3 flex justify-center bg-background/50">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setValidationError(null);
                          setStartTime('');
                          setEndTime('');
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="rounded-md border bg-slate-50 dark:bg-slate-900 p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Booked Slots on {format(selectedDate, 'MMM dd')}
                      </h4>
                      {existingBookingsForDate.length > 0 ? (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                          {existingBookingsForDate.map(booking => (
                            <div key={booking.id} className="text-xs flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                  {booking.startTime.slice(0, 5)} - {booking.endTime?.slice(0, 5)}
                                </span>
                              </div>
                              <span className="text-muted-foreground truncate max-w-[100px]">{booking.purpose}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic text-center py-2">
                          All time slots are available today.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Select
                      value={startTime}
                      onValueChange={(value) => {
                        setStartTime(value);
                        setValidationError(null);
                        if (endTime && value >= endTime) {
                          setEndTime('');
                        }
                      }}
                      disabled={!selectedDate}
                    >
                      <SelectTrigger id="startTime">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => {
                          const isBlocked = isTimeBlocked(time);
                          return (
                            <SelectItem
                              key={time}
                              value={time}
                              disabled={isBlocked}
                              className={isBlocked ? "opacity-50 cursor-not-allowed text-muted-foreground" : ""}
                            >
                              {time} {isBlocked && "(Booked)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Select
                      value={endTime}
                      onValueChange={(value) => {
                        setEndTime(value);
                        setValidationError(null);
                      }}
                      disabled={!startTime}
                    >
                      <SelectTrigger id="endTime">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots
                          .filter((time) => !startTime || time > startTime)
                          .map((time) => {
                            const isBlocked = isTimeBlocked(time);
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            )
                          })}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDate && startTime && endTime && (
                    <div className="rounded-lg bg-primary/10 p-4 border border-primary/20 mt-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                        <Clock className="h-4 w-4" /> Summary
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(selectedDate, 'EEEE, MMMM do')} <br />
                        {startTime} - {endTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!canProceedStep2}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Booking Details</CardTitle>
              <CardDescription>Provide additional information for your booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {validationError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose / Meeting Title *</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Q4 Planning Meeting"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamMembers">Team Members (Optional)</Label>
                <Textarea
                  id="teamMembers"
                  placeholder="Enter names separated by commas (e.g. Dr. Nam, Ms. Huong)"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <h4 className="font-medium text-sm text-foreground">Booking Summary</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{selectedRoom?.name}</span>
                    <span className="text-xs">({selectedRoom?.building_name})</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span>{selectedDate && format(selectedDate, 'EEEE, MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{startTime} - {endTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </Button>
                <Button onClick={handleConfirm} disabled={!canConfirm || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
