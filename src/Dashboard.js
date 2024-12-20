import React, { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Dashboard = ({ bookings = [] }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    flatpickr('#calendar', {
      dateFormat: 'd/m/Y',
      maxDate: new Date().fp_incr(7), // 7 days from today
      onChange: (selectedDates) => {
        setSelectedDate(selectedDates[0]);
      },
    });
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServiceType = serviceType ? booking.serviceType === serviceType : true;
    return matchesSearch && matchesServiceType;
  });

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="mt-16 p-4">
        Page specific content goes here
      </div>
    </div>
  );
};

export default Dashboard;
