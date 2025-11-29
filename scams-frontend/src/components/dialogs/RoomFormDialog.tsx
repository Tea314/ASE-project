import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import type { Room } from '@/types';
import { X } from 'lucide-react';

interface RoomFormDialogProps {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onSave: (room: Partial<Room> & { id?: string }) => void;
}

const EQUIPMENT_OPTIONS = [
  'Projector',
  'Whiteboard',
  'Video Conference',
  'WiFi',
  'TV Screen',
  'Digital Whiteboard',
  'Speakers',
  'Microphone',
  'Conference Phone',
];

export function RoomFormDialog({ room, open, onClose, onSave }: RoomFormDialogProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [status, setStatus] = useState<Room['status']>('available');

  useEffect(() => {
    if (room) {
      setName(room.name);
      setLocation(room.location);
      setFloor(room.floor || '');
      setCapacity(room.capacity.toString());
      setType(room.type || '');
      setDescription(room.description);
      setEquipment(room.equipment);
      setStatus(room.status || 'available');
    } else {
      // Reset for new room
      setName('');
      setLocation('');
      setFloor('');
      setCapacity('');
      setType('');
      setDescription('');
      setEquipment([]);
      setStatus('available');
    }
  }, [room, open]);

  const toggleEquipment = (item: string) => {
    setEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    const roomData: Partial<Room> & { id?: string } = {
      name,
      location,
      floor,
      capacity: parseInt(capacity),
      type,
      description,
      equipment,
      status,
      image: room?.image || 'https://images.unsplash.com/photo-1703355685952-03ed19f70f51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjAzMzc0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    };

    if (room) {
      roomData.id = room.id;
    }

    onSave(roomData);
    onClose();
  };

  const isValid = name && location && capacity && type;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{room ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          <DialogDescription>
            {room ? 'Update room details' : 'Create a new meeting room'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Executive Conference Room"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Huddle">Huddle</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Board Room">Board Room</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Floor 5, West Wing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="12"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Room['status'])}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the room..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Equipment & Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((item) => (
                <Badge
                  key={item}
                  variant={equipment.includes(item) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleEquipment(item)}
                >
                  {item}
                  {equipment.includes(item) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {room ? 'Save Changes' : 'Create Room'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
