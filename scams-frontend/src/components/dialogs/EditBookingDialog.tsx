import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Booking, Room } from '@/types';
import { generateTimeSlots } from '../../data/mockData';

interface EditBookingDialogProps {
  booking: Booking | null;
  rooms: Room[];
  open: boolean;
  onClose: () => void;
  onSave: (bookingId: string, updates: Partial<Booking>) => void;
}

export function EditBookingDialog({ booking, rooms, open, onClose, onSave }: EditBookingDialogProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [teamMembers, setTeamMembers] = useState('');

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (booking) {
      setDate(booking.date);
      setStartTime(booking.startTime);
      setEndTime(booking.endTime);
      setPurpose(booking.purpose);
      setTeamMembers(booking.teamMembers.join(', '));
    }
  }, [booking]);

  const handleSave = () => {
    if (booking) {
      onSave(booking.id, {
        date,
        startTime,
        endTime,
        purpose,
        teamMembers: teamMembers.split(',').map(m => m.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      });
      onClose();
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Update your booking details for {booking.roomName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime">
                  <SelectValue />
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
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="endTime">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.filter(t => t > startTime).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Meeting purpose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamMembers">Team Members</Label>
            <Textarea
              id="teamMembers"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              placeholder="Comma-separated names"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
