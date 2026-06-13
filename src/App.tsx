import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './components';
import { Dashboard, Bookings, Customers, Staff, UserIncome, Dealer, Settings } from './pages';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardLayout
      onNavigate={handleNavigate}
      userName="Admin User"
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/user-income" element={<UserIncome />} />
        <Route path="/dealer" element={<Dealer />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
