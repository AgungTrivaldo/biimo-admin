import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarHeader from '../src/Header';
import Dashboard from '../src/Dashboard';
import InboxChat from '../src/Inbox';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <SidebarHeader />
        <div className="flex-1 flex flex-col ml-64">
          <div className="p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inbox" element={<InboxChat />} />
              {/* Default Route */}
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
