import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

interface RoomListProps {
  rooms: any[];
  loading: boolean;
  onEdit: (room: any) => void;
  onDelete: (roomId: string) => void;
  onAdd: () => void;
  deletingRoomId: string | null;
  deleteRoomPending: boolean;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, loading, onEdit, onDelete, onAdd, deletingRoomId, deleteRoomPending }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Room Management</h3>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add Room
      </Button>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Existing Rooms</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading rooms...</div>
        ) : rooms && rooms.length > 0 ? (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-gray-600">
                      {room.type} • Ksh {room.price_per_night ? Math.round(room.price_per_night / 2.1).toLocaleString() : 0}/night
                    </p>
                    <p className="text-sm text-gray-500">
                      {room.capacity} guests • Room {room.room_number}
                    </p>
                    {room.images && room.images.length > 0 && room.images[0].image_url && (
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={room.images[0].image_url}
                          alt={room.images[0].alt_text || `Room image`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-blue-600">
                          {room.images.length} image{room.images.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(room)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(room.id)}
                      disabled={deleteRoomPending}
                    >
                      {deletingRoomId === room.id ? (
                        "Click again to confirm"
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No rooms found. Add your first room to get started.
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

export default RoomList;
