import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarHeader from './Header';
import Dashboard from './Dashboard';
import InboxChat from './Inbox';
import MontirDashboard from './MontirDashboard'; // Correct import
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <Router>
      {user ? (
        <div className="flex">
          <SidebarHeader />
          <div className="flex-1 flex flex-col ml-64">
            <div className="p-4">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inbox" element={<InboxChat />} />
                <Route path="/montir" element={<MontirDashboard />} />
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
