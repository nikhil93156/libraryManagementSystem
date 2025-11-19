import React from 'react'; // Don't forget to import React
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Maintenance from './Maintenance';
import Reports from './Reports';
import Transactions from './Transactions';

function Dashboard() {
  const role = localStorage.getItem('role') || 'user';
  const username = localStorage.getItem('username') || '';

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="p-6 space-y-4">
      <Navbar role={role} username={username} onLogout={logout} />

      <div className="flex gap-4">
        <aside className="w-56 space-y-2">
          {role === 'admin' && (
            <Link 
              className="block p-2 bg-white rounded shadow hover:bg-gray-50" 
              to="/dashboard/maintenance"
            >
              Maintenance
            </Link>
          )}
          <Link 
            className="block p-2 bg-white rounded shadow hover:bg-gray-50" 
            to="/dashboard/reports"
          >
            Reports
          </Link>
          <Link 
            className="block p-2 bg-white rounded shadow hover:bg-gray-50" 
            to="/dashboard/transactions"
          >
            Transactions
          </Link>
        </aside>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<div className="p-4 bg-white rounded shadow">Select an option from the menu</div>} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="transactions" element={<Transactions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
