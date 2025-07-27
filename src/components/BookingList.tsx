import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingListProps {
  bookings: any[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Bookings</CardTitle>
    </CardHeader>
    <CardContent>
      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">{booking.guest_name}</h3>
                  <p className="text-sm text-gray-600">{booking.guest_email}</p>
                  {booking.guest_phone && (
                    <p className="text-sm text-gray-600">{booking.guest_phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    <strong>Room:</strong> {booking.room_name}
                  </p>
                  <p className="text-sm">
                    <strong>Dates:</strong> {booking.check_in_date} to {booking.check_out_date}
                  </p>
                  <p className="text-sm">
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <strong>Amount:</strong> ₦{((booking.total_amount || 0) / 100).toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      booking.status === 'cancelled' ? 'destructive' : 'default'
                    }>
                      {booking.status}
                    </Badge>
                    <Badge variant={
                      booking.payment_status === 'completed' ? 'default' :
                      booking.payment_status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No bookings found.
        </div>
      )}
    </CardContent>
  </Card>
);

export default BookingList;
