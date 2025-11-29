import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Room, MaintenanceSchedule } from '@/types';

interface MaintenanceDialogProps {
  rooms: Room[];
  maintenance: MaintenanceSchedule | null;
  open: boolean;
  onClose: () => void;
  onSave: (maintenance: Partial<MaintenanceSchedule> & { id?: string }) => void;
}

export function MaintenanceDialog({ rooms, maintenance, open, onClose, onSave }: MaintenanceDialogProps) {
  const [roomId, setRoomId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<MaintenanceSchedule['status']>('scheduled');

  useEffect(() => {
    if (maintenance) {
      setRoomId(maintenance.roomId);
      setStartDate(maintenance.startDate);
      setEndDate(maintenance.endDate);
      setReason(maintenance.reason);
      setStatus(maintenance.status);
    } else {
      setRoomId('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setStatus('scheduled');
    }
  }, [maintenance, open]);

  const handleSave = () => {
    const selectedRoom = rooms.find(r => r.id === roomId);
    if (!selectedRoom) return;

    const maintenanceData: Partial<MaintenanceSchedule> & { id?: string } = {
      roomId,
      roomName: selectedRoom.name,
      startDate,
      endDate,
      reason,
      status,
    };

    if (maintenance) {
      maintenanceData.id = maintenance.id;
    }

    onSave(maintenanceData);
    onClose();
  };

  const isValid = roomId && startDate && endDate && reason;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{maintenance ? 'Edit Maintenance' : 'Schedule Maintenance'}</DialogTitle>
          <DialogDescription>
            {maintenance ? 'Update maintenance schedule' : 'Schedule room maintenance'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room">Room *</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger id="room">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="AV System Upgrade, Carpet Replacement, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as MaintenanceSchedule['status'])}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {maintenance ? 'Save Changes' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
