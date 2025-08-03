import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingListProps {
  bookings: any[];
}


const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  const [lodgingDetails, setLodgingDetails] = useState<{[id: number]: any}>({});
  const [conferenceDetails, setConferenceDetails] = useState<{[id: number]: any}>({});
  const [modal, setModal] = useState<{ type: 'lodging' | 'conference', data: any } | null>(null);

  useEffect(() => {
    // Find unique lodging and conference IDs from bookings
    const lodgingIds = Array.from(new Set(bookings.map(b => b.lodging_id).filter(Boolean)));
    const conferenceIds = Array.from(new Set(bookings.map(b => b.conference_id).filter(Boolean)));

    // Use backend URL from env
    // Vite env typing workaround
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL?.replace(/\/$/, '');

    // Fetch all missing lodging details
    lodgingIds.forEach(id => {
      if (!lodgingDetails[id]) {
        fetch(`${backendUrl}/lodgings/${id}`)
          .then(res => res.json())
          .then(data => {
            // removed log
            setLodgingDetails(prev => ({ ...prev, [id]: data }));
          })
          .catch((err) => { });
      }
    });
    // Fetch all missing conference details
    conferenceIds.forEach(id => {
      if (!conferenceDetails[id]) {
        fetch(`${backendUrl}/conferences/${id}`)
          .then(res => res.json())
          .then(data => {
            // removed log
            setConferenceDetails(prev => ({ ...prev, [id]: data }));
          })
          .catch((err) => { });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);


  // Tabs: 'confirmed' or 'pending'
  const [activeTab, setActiveTab] = useState<'confirmed' | 'pending'>('confirmed');

  // Confirmed bookings split by type
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const confirmedLodgings = confirmed.filter(b => b.lodging_id);
  const confirmedConferences = confirmed.filter(b => b.conference_id);
  const pending = bookings.filter(b => b.status !== 'confirmed');

  const renderBooking = (booking: any) => {
    // Lodging or conference details
    const lodging = booking.lodging_id ? lodgingDetails[booking.lodging_id] : null;
    const conference = booking.conference_id ? conferenceDetails[booking.conference_id] : null;
    // removed log

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
              <strong>Room/Conference:</strong>{' '}
              {lodging ? (
                <button
                  type="button"
                  className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => setModal({ type: 'lodging', data: lodging })}
                >
                  {lodging.name || `Lodging #${lodging.id}`}
                </button>
              ) : conference ? (
                <button
                  type="button"
                  className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => setModal({ type: 'conference', data: conference })}
                >
                  {conference.name || `Conference #${conference.id}`}
                </button>
              ) : 'N/A'}
            </p>
            {lodging && (
              <>
                <p className="text-xs text-gray-700">Type: {lodging.type}</p>
                <p className="text-xs text-gray-700">Price: ₦{lodging.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-700">Occupancy: {lodging.occupancy}</p>
              </>
            )}
            {conference && (
              <>
                <p className="text-xs text-gray-700">Price: ₦{conference.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-700">Size: {conference.size}</p>
                <p className="text-xs text-gray-700">Max Users: {conference.max_users}</p>
              </>
            )}
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
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
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
            <>
              {activeTab === 'confirmed' ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-green-700">Lodging Bookings</h2>
                    {confirmedLodgings.length > 0 ? (
                      <div className="space-y-4">
                        {confirmedLodgings.map(renderBooking)}
                      </div>
                    ) : (
                      <div className="text-gray-500">No confirmed lodging bookings.</div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-green-700">Conference Bookings</h2>
                    {confirmedConferences.length > 0 ? (
                      <div className="space-y-4">
                        {confirmedConferences.map(renderBooking)}
                      </div>
                    ) : (
                      <div className="text-gray-500">No confirmed conference bookings.</div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-yellow-700">Pending Bookings</h2>
                  {pending.length > 0 ? (
                    <div className="space-y-4">
                      {pending.map(renderBooking)}
                    </div>
                  ) : (
                    <div className="text-gray-500">No pending bookings.</div>
                  )}
                </div>
              )}
            </>
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
            <h2 className="text-lg font-bold mb-2">
              {modal.type === 'lodging' ? 'Room Details' : 'Conference Details'}
            </h2>
            <div className="space-y-1">
              {/* Lodging-specific details */}
              {modal.type === 'lodging' && (
                <>
                  {modal.data.image_urls && Array.isArray(modal.data.image_urls) && modal.data.image_urls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {modal.data.image_urls.map((url: string, idx: number) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Room image ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                  {modal.data.type && (
                    <div>
                      <span className="font-semibold">Type:</span> {modal.data.type}
                    </div>
                  )}
                  {modal.data.occupancy && (
                    <div>
                      <span className="font-semibold">Occupancy:</span> {modal.data.occupancy}
                    </div>
                  )}
                </>
              )}
              {/* Conference-specific details */}
              {modal.type === 'conference' && modal.data.image_urls && Array.isArray(modal.data.image_urls) && modal.data.image_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {modal.data.image_urls.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Conference image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              {/* Show all other fields generically */}
              {Object.entries(modal.data).map(([key, value]) => {
                if (key === 'image_urls' || (modal.type === 'lodging' && (key === 'type' || key === 'occupancy'))) return null;
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

export default BookingList;
