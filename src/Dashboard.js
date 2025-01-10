import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from './firebase';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceCategory, setServiceCategory] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = () => {
    try {
      const bookingsRef = ref(db, 'bookings');
      onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const bookingData = Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }));
          setBookings(bookingData);
          setFilteredBookings(bookingData);
        } else {
          setBookings([]);
          setFilteredBookings([]);
        }
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];
  
    if (searchQuery) {
      filtered = filtered.filter((booking) =>
        booking.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (selectedDate) {
      const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
      filtered = filtered.filter(
        (booking) => booking.bookingDate === selectedDateStr
      );
    }
  
    if (serviceCategory) {
      filtered = filtered.filter((booking) => {
        return booking.serviceCategory?.toLowerCase() === serviceCategory.toLowerCase();
      });
    }
  
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    filterBookings();
  }, [searchQuery, selectedDate, serviceCategory, bookings]);

  useEffect(() => {
    fetchBookings();
    // Clean up subscription on unmount
    return () => {
      const bookingsRef = ref(db, 'bookings');
      // Detach the listener
      onValue(bookingsRef, () => {}, { onlyOnce: true });
    };
  }, []);

  const updateBookingStatus = async (id, newStatus) => {
    if (isUpdating) return; // Prevent multiple simultaneous updates
    
    setIsUpdating(true);
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) throw new Error('Booking not found');

      let description = '';
      switch (newStatus) {
        case 'Montir bersiap':
          description = 'Mechanic is preparing';
          break;
        case 'Montir sedang dalam perjalanan':
          description = 'Mechanic is on the way';
          break;
        case 'Montir Sampai':
          description = 'Mechanic has arrived';
          break;
        case 'booked':
          description = 'Booking confirmed';
          break;
        case 'on going':
          description = 'Service in progress';
          break;
        case 'completed':
          description = 'Thank you for using our service';
          break;
        default:
          description = '';
      }

      const bookingRef = ref(db, `bookings/${id}`);
      await update(bookingRef, {
        status: newStatus,
        description,
        lastUpdated: new Date().toISOString()
      });

      // Update local state immediately for better UX
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === id
            ? { ...booking, status: newStatus, description }
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-16">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Filter Controls Container */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0 w-1/4">
            <Flatpickr
              className="bg-gray-200 pl-3 pr-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Select Date"
              options={{ dateFormat: 'Y-m-d' }}
              onChange={([date]) => setSelectedDate(date)}
            />
          </div>

          <div className="flex-shrink-0 w-1/4 ml-auto">
            <input
              type="text"
              placeholder="Search by Vehicle Model"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-200 pl-3 pr-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex-shrink-0 w-1/4">
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="bg-gray-200 px-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">All Services</option>
              <option value="bookServices">Booking Service</option>
              <option value="homeServices">Home Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">User Name</th>
              <th className="py-2 px-4 border">Vehicle</th>
              <th className="py-2 px-4 border">Booking Date</th>
              <th className="py-2 px-4 border">Booking Time</th>
              <th className="py-2 px-4 border">Mechanic</th>
              <th className="py-2 px-4 border">Service Category</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Pickup Address</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{booking.userName || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    {`${booking.brand || 'N/A'} ${booking.model || ''} ${booking.variant || ''} (${booking.year || ''})`}
                  </td>
                  <td className="py-2 px-4 border">{booking.bookingDate || 'N/A'}</td>
                  <td className="py-2 px-4 border">{booking.bookingTime || 'N/A'}</td>
                  <td className="py-2 px-4 border">{booking.montirName || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    {booking.serviceCategory === 'homeServices' ? 'Home Service' : 
                    booking.serviceCategory === 'bookServices' ? 'Onsite Service' : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Montir sedang dalam perjalanan' || booking.status === 'on going' ? 'bg-white text-black' :
                      'bg-white text-black'
                    }`}>
                      {booking.status || 'N/A'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">{booking.pickupAddress || 'N/A'}</td>
                  <td className="py-2 px-4 border text-center">
                    <select
                      className={`bg-gray-200 px-3 py-1 rounded focus:outline-none focus:ring focus:ring-blue-300 ${
                        isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      value={booking.status || ''}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      disabled={isUpdating}
                    >
                      {booking.serviceCategory === 'bookServices' ? (
                        <>
                          <option value="">Select Status</option>
                          <option value="booked">Booked</option>
                          <option value="on going">On Going</option>
                          <option value="completed">Completed</option>
                        </>
                      ) : booking.serviceCategory === 'homeServices' ? (
                        <>
                          <option value="">Select Status</option>
                          <option value="Montir bersiap">Montir sedang bersiap</option>
                          <option value="Montir sedang dalam perjalanan">Montir sedang dalam perjalanan</option>
                          <option value="Montir Sampai">Montir Sudah Sampai</option>
                          <option value="completed">Completed</option>
                        </>
                      ) : (
                        <option value="">Unknown Service Type</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-2 px-4 border text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
