import { useState, useEffect } from 'react'; // Import hooks
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';

export default function App() {
  // Initialize state directly from localStorage so it persists on refresh
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          // Pass setToken to Login so it can update this state
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard/*"
          element={token ? <DashBoard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}