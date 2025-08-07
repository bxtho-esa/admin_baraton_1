import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingListProps {
  bookings: any[];
}

const ConferenceBookings: React.FC<BookingListProps> = ({ bookings }) => {
  const [conferenceDetails, setConferenceDetails] = useState<{ [id: number]: any }>({});
  const [modal, setModal] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'confirmed' | 'pending'>('confirmed');

  useEffect(() => {
    const conferenceIds = Array.from(new Set(bookings.map(b => b.booking_id)));
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL?.replace(/\/$/, '');

    conferenceIds.forEach(id => {
      if (!conferenceDetails[id]) {
        fetch(`${backendUrl}/conferences/${id}`)
          .then(res => res.json())
          .then(data => {
            setConferenceDetails(prev => ({ ...prev, [id]: data }));
          })
          .catch(() => {});
      }
    });
  }, [bookings]);

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const pending = bookings.filter(b => b.status !== 'confirmed');

  const renderBooking = (booking: any) => {
    const conference = conferenceDetails[booking.booking_id];

    return (
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
              <strong>Conference:</strong>{' '}
              {conference ? (
                <button
                  type="button"
                  className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => setModal(conference)}
                >
                  {conference.name || `Conference #${conference.id}`}
                </button>
              ) : 'N/A'}
            </p>
            {conference && (
              <>
                <p className="text-xs text-gray-700">Price: ₦{conference.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-700">Size: {conference.size}</p>
                <p className="text-xs text-gray-700">Max Users: {conference.max_users}</p>
              </>
            )}
            {booking.time && <p className="text-xs text-gray-700">Time: {booking.time}</p>}
            {booking.attendance_type && <p className="text-xs text-gray-700">Attendance: {booking.attendance_type}</p>}
            <p className="text-sm">
              <strong>Dates:</strong> {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'} to {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-sm">
              <strong>Guests:</strong> {booking.guests}</p>
            {booking.reference && (
              <p className="text-xs text-gray-500">Ref: {booking.reference}</p>
            )}
          </div>
          <div>
            <p className="text-sm">
              <strong>Status:</strong> {booking.status}</p>
            <p className="text-xs text-gray-500">Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : ''}</p>
            <p className="text-xs text-gray-500">Updated: {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : ''}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Conference Bookings</CardTitle>
        </CardHeader>
        <div className="flex gap-4 px-6 pt-4">
          <button
            className={`px-4 py-2 rounded-t ${activeTab === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-4 py-2 rounded-t ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            activeTab === 'confirmed' ? (
              confirmed.length > 0 ? (
                <div className="space-y-4">
                  {confirmed.map(renderBooking)}
                </div>
              ) : (
                <div className="text-gray-500">No confirmed conference bookings.</div>
              )
            ) : (
              pending.length > 0 ? (
                <div className="space-y-4">
                  {pending.map(renderBooking)}
                </div>
              ) : (
                <div className="text-gray-500">No pending conference bookings.</div>
              )
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              No bookings found.
            </div>
          )}
        </CardContent>
      </Card>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2">Conference Details</h2>
            <div className="space-y-1">
              {modal.image_urls && Array.isArray(modal.image_urls) && modal.image_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {modal.image_urls.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Conference image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              {Object.entries(modal).map(([key, value]) => {
                if (key === 'image_urls') return null;
                return (
                  <div key={key}>
                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    <span>{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConferenceBookings;
