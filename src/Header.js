import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported from react-router-dom

const SidebarHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    // Handle the logout logic (e.g., clearing session, redirecting to login page)
    console.log('Logged out');
  };

  return (
    <>
      {/* Sidebar Section */}
      <div className="bg-blue-600 text-white w-64 flex flex-col fixed h-full">
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <i className="fas fa-user-circle text-3xl"></i>
          <span className="ml-2 text-xl font-semibold">Biimo Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-4">
            <ul>
              <li className="px-4 py-2 hover:bg-blue-700">
                <Link className="flex items-center" to="/dashboard">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-blue-700">
                <Link className="flex items-center" to="/inbox">
                  <i className="fas fa-envelope mr-2"></i>Inbox
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="fixed left-64 top-0 right-0 flex items-center justify-end bg-white h-16 px-4 shadow">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center focus:outline-none"
        >
          <span className="mr-2">Moni Roy</span>
          <img
            src="https://via.placeholder.com/40"
            className="rounded-full w-10 h-10"
            alt="Profile"
          />
          <i className="fas fa-chevron-down ml-2"></i>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarHeader;
