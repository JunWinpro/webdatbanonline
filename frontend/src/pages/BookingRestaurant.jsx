import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { format } from 'date-fns';

const BookingRestaurant = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { idrestaurant } = useParams();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Restaurant ID:', idrestaurant);
        const response = await axiosInstance.get(`/bookings/${idrestaurant}`);
        console.log('API Response:', response.data);
        if (response.data.success) {
          setBookings(response.data.data.data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        console.error('Error details:', err.response ? err.response.data : err);
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [idrestaurant]);

  const renderStatus = (booking) => {
    if (booking.isCanceled) return 'Canceled';
    if (booking.isFinished) return 'Finished';
    if (booking.isCheckin) return 'Checked In';
    return 'Pending';
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Bookings</h1>
      <p className="mb-4">Restaurant ID: {idrestaurant}</p> 
      {bookings.length === 0 ? (
        <p className="text-center py-4">No bookings found for this restaurant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tables</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 whitespace-nowrap">
                    {booking.firstName} {booking.lastName}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{booking.phone}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {format(new Date(booking.checkinTime), 'PPpp')}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      renderStatus(booking) === 'Canceled' ? 'bg-red-100 text-red-800' :
                      renderStatus(booking) === 'Finished' ? 'bg-green-100 text-green-800' :
                      renderStatus(booking) === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {renderStatus(booking)}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {booking.info.map((info) => info.tableNumber).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingRestaurant;