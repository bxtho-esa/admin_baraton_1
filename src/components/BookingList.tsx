import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingListProps {
  bookings: any[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  // Split bookings into confirmed and unconfirmed
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const unconfirmed = bookings.filter(b => b.status !== 'confirmed');

  // Helper to render booking card
  const renderBooking = (booking: any) => (
    <div key={booking.id} className="border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium">{booking.guest_name}</h3>
          <p className="text-sm text-gray-600">{booking.guest_email}</p>
          {booking.guest_phone && (
            <p className="text-sm text-gray-600">{booking.guest_phone}</p>
          )}
          {booking.special_requests && (
            <p className="text-xs text-gray-500 mt-1">Special: {booking.special_requests}</p>
          )}
        </div>
        <div>
          <p className="text-sm">
            <strong>Room/Conference:</strong>{' '}
            {booking.Lodging?.id ? (
              <a
                href={`/lodging/${booking.Lodging.id}`}
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {booking.Lodging.name || `Lodging #${booking.Lodging.id}`}
              </a>
            ) : booking.Conference?.id ? (
              <a
                href={`/conference/${booking.Conference.id}`}
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {booking.Conference.name || `Conference #${booking.Conference.id}`}
              </a>
            ) : 'N/A'}
          </p>
          <p className="text-sm">
            <strong>Dates:</strong> {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'} to {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-sm">
            <strong>Guests:</strong> {booking.guests}
          </p>
          {booking.reference && (
            <p className="text-xs text-gray-500">Ref: {booking.reference}</p>
          )}
        </div>
        <div>
          <p className="text-sm">
            <strong>Status:</strong> {booking.status}
          </p>
          <p className="text-xs text-gray-500">Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : ''}</p>
          <p className="text-xs text-gray-500">Updated: {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : ''}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings && bookings.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-green-700">Confirmed Bookings</h2>
              {confirmed.length > 0 ? (
                <div className="space-y-4">
                  {confirmed.map(renderBooking)}
                </div>
              ) : (
                <div className="text-gray-500">No confirmed bookings.</div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-yellow-700">Unconfirmed Bookings</h2>
              {unconfirmed.length > 0 ? (
                <div className="space-y-4">
                  {unconfirmed.map(renderBooking)}
                </div>
              ) : (
                <div className="text-gray-500">No unconfirmed bookings.</div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No bookings found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingList;
