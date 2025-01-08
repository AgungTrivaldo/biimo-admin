import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase'; // Ensure your firebase.js is correctly set up
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceType, setServiceType] = useState('');

  // Function to fetch bookings from Realtime Database
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

  // Filter bookings based on search query, selected date, and service type
  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchQuery) {
      filtered = filtered.filter((booking) =>
        booking.vehicleModel?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      const selectedDateStr = selectedDate.toLocaleDateString('en-CA'); // Format to match 'YYYY-MM-DD'
      filtered = filtered.filter(
        (booking) => booking.bookingDate === selectedDateStr
      );
    }

    if (serviceType) {
      filtered = filtered.filter((booking) => booking.serviceType === serviceType);
    }

    setFilteredBookings(filtered);
  };

  // Apply filters whenever search query, date, or service type changes
  useEffect(() => {
    filterBookings();
  }, [searchQuery, selectedDate, serviceType, bookings]);

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Calendar, Search Bar, and Filters */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Calendar Input */}
        <div className="relative flex-shrink-0 w-1/4">
          <Flatpickr
            className="bg-gray-200 pl-3 pr-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Select Date"
            options={{ dateFormat: 'Y-m-d' }}
            onChange={([date]) => setSelectedDate(date)}
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex-shrink-0 w-1/4 ml-auto">
          <input
            type="text"
            placeholder="Search by Vehicle Model"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-200 pl-3 pr-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Service Type Dropdown Filter */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-shrink-0 w-1/4">
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="bg-gray-200 px-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">All Service Types</option>
            <option value="service_berkala">Service Berkala</option>
            <option value="emergency">Emergency Service</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">User ID</th>
              <th className="py-2 px-4 border">Vehicle</th>
              <th className="py-2 px-4 border">Service Type</th>
              <th className="py-2 px-4 border">Booking Date</th>
              <th className="py-2 px-4 border">Booking Time</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((bookings, index) => (
                <tr key={bookings.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{bookings.userId || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    {`${bookings.vehicleBrand || 'N/A'} ${bookings.vehicleModel || ''} (${bookings.vehicleYear || ''})`}
                  </td>
                  <td className="py-2 px-4 border">{bookings.serviceType || 'N/A'}</td>
                  <td className="py-2 px-4 border">{bookings.bookingDate || 'N/A'}</td>
                  <td className="py-2 px-4 border">{bookings.bookingTime || 'N/A'}</td>
                  <td className="py-2 px-4 border">{bookings.status || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-2 px-4 border text-center">
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
