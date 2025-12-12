import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, Users, Star, SlidersHorizontal } from 'lucide-react';
import type { Room } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { roomService } from '@/services/roomService';

interface RoomBrowserProps {
  rooms: Room[];
  onViewRoom: (roomId: string) => void;
  onToggleFavorite: (roomId: string) => void;
}

export function RoomBrowser({ rooms, onViewRoom, onToggleFavorite }: RoomBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [capacityFilter, setCapacityFilter] = useState<number[]>([0]);
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);

  const allEquipment = Array.from(new Set(rooms.flatMap((r) => (r.devices || []).map(d => d.name))));

  const filteredRooms = rooms
    .filter((room) => {
      const location = `${room.building_name}, Floor ${room.floor_number}`;
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCapacity = capacityFilter[0] === 0 || room.capacity >= capacityFilter[0];
      
      const matchesEquipment =
        equipmentFilter.length === 0 ||
        equipmentFilter.every((eq) => (room.devices || []).some(d => d.name === eq));

      return matchesSearch && matchesCapacity && matchesEquipment;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      const locationA = `${a.building_name}, Floor ${a.floor_number}`;
      const locationB = `${b.building_name}, Floor ${b.floor_number}`;
      if (sortBy === 'location') return locationA.localeCompare(locationB);
      // @ts-ignore
      if (sortBy === 'favorites') return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      return 0;
    });

  const handleToggleEquipment = (equipment: string) => {
    setEquipmentFilter((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Browse Rooms</h2>
        <p className="text-muted-foreground">Search and filter available meeting spaces</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="capacity">Capacity</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(capacityFilter[0] > 0 || equipmentFilter.length > 0) && (
                <Badge variant="secondary" className="ml-1 px-1.5">
                  {(capacityFilter[0] > 0 ? 1 : 0) + equipmentFilter.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Minimum Capacity: {capacityFilter[0]}</Label>
                <Slider
                  value={capacityFilter}
                  onValueChange={setCapacityFilter}
                  max={20}
                  step={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Equipment</Label>
                <div className="flex flex-wrap gap-2">
                  {allEquipment.map((equipment) => (
                    <Badge
                      key={equipment}
                      variant={equipmentFilter.includes(equipment) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleToggleEquipment(equipment)}
                    >
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setCapacityFilter([0]);
                  setEquipmentFilter([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Showing {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''}
        </p>

        {filteredRooms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No rooms found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="group cursor-pointer overflow-hidden hover:border-primary transition-colors"
                onClick={() => onViewRoom(room.id)}
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={roomService.getRoomImage(room)}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(room.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        // @ts-ignore
                        room.isFavorite
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3>{room.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {room.building_name}, Floor {room.floor_number}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {room.capacity}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(room.devices || []).slice(0, 3).map((device) => (
                      <Badge key={device.id} variant="outline" className="text-xs">
                        {device.name}
                      </Badge>
                    ))}
                    {(room.devices || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(room.devices || []).length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
