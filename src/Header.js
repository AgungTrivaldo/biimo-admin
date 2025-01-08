import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { auth } from './firebase'; // Import Firebase auth for logging out
import { signOut } from 'firebase/auth'; // Firebase signOut method

const SidebarHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogout = () => {
    // Firebase logout logic
    signOut(auth)
      .then(() => {
        // Successfully logged out
        console.log('Logged out');
        navigate('/login'); // Redirect to login page
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
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
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none"
        >
          Logout
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
