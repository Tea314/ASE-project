import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Room, Booking } from '@/types';
import { format } from 'date-fns';
import { generateTimeSlots } from '../data/mockData';
import { checkBookingConflict, validateBookingTime, validateBookingDate } from '../utils/bookingValidation';

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
  }) => void;
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

  const timeSlots = generateTimeSlots();
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Check for conflicts when date/time changes
  const checkConflicts = () => {
    if (!selectedDate || !startTime || !endTime || !selectedRoomId) {
      return null;
    }

    const dateValidation = validateBookingDate(selectedDate.toISOString().split('T')[0]);
    if (!dateValidation.isValid) {
      return dateValidation.message;
    }

    const timeValidation = validateBookingTime(startTime, endTime);
    if (!timeValidation.isValid) {
      return timeValidation.message;
    }

    const conflictCheck = checkBookingConflict(bookings, {
      roomId: selectedRoomId,
      date: selectedDate.toISOString().split('T')[0],
      startTime,
      endTime,
    });

    if (conflictCheck.hasConflict) {
      return conflictCheck.message;
    }

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

  const handleConfirm = () => {
    if (selectedDate && selectedRoomId && startTime && endTime) {
      const error = checkConflicts();
      if (error) {
        setValidationError(error);
        return;
      }

      onConfirm({
        roomId: selectedRoomId,
        date: selectedDate,
        startTime,
        endTime,
        purpose,
        teamMembers: teamMembers.split(',').map((m) => m.trim()).filter(Boolean),
      });
      setShowConfirmation(true);
    }
  };

  const canProceedStep1 = selectedRoomId !== '';
  const canProceedStep2 = selectedDate && startTime && endTime;
  const canConfirm = canProceedStep2 && purpose;

  if (showConfirmation) {
    return (
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle>Booking Confirmed!</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Your booking for {selectedRoom?.name} on{' '}
              {selectedDate && format(selectedDate, 'MMMM dd, yyyy')} at {startTime} has been
              confirmed. You will receive a confirmation email shortly.
            </CardDescription>
            <div className="pt-4">
              <Button onClick={onBack}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2>Create New Booking</h2>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step 1: Select Room */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Room</CardTitle>
              <CardDescription>Choose the meeting space for your booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      selectedRoomId === room.id
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <h4>{room.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{room.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Users className="h-3 w-3" />
                        {room.capacity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!canProceedStep1}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Date & Time */}
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
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setValidationError(null);
                  }}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select
                    value={startTime}
                    onValueChange={(value) => {
                      setStartTime(value);
                      setValidationError(null);
                    }}
                  >
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
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
                  >
                    <SelectTrigger id="endTime">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots
                        .filter((time) => !startTime || time > startTime)
                        .map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!canProceedStep2}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Add Details */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Booking Details</CardTitle>
              <CardDescription>Provide additional information for your booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose / Meeting Title *</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Q4 Planning Meeting"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamMembers">Team Members (Optional)</Label>
                <Textarea
                  id="teamMembers"
                  placeholder="Enter names separated by commas"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <h4>Booking Summary</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {selectedRoom?.name}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate && format(selectedDate, 'MMMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {startTime} - {endTime}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleConfirm} disabled={!canConfirm}>
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
