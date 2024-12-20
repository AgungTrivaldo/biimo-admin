import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  // Function to fetch bookings from Firestore
  const fetchBookings = async () => {
    try {
      // Fetch data from the 'bookings' collection
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const bookingData = querySnapshot.docs.map(doc => ({
        id: doc.id, // unique document ID
        ...doc.data(), // all the fields in the document
      }));
      setBookings(bookingData); // Set the fetched bookings in state
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Service Type</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Time</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{booking.customer || 'N/A'}</td>
                  <td className="py-2 px-4 border">{booking.serviceType || 'N/A'}</td>
                  <td className="py-2 px-4 border">{booking.description || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    {booking.date && booking.date.seconds 
                      ? new Date(booking.date.seconds * 1000).toLocaleDateString() 
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border">
                    {booking.time && booking.time.seconds 
                      ? new Date(booking.time.seconds * 1000).toLocaleTimeString() 
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border">{booking.status || 'N/A'}</td>
                  <td className="py-2 px-4 border">{booking.assignedTo || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 border text-center">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
