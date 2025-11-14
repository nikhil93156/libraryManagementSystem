import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard'

export default function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard/*"
          element={token ? <DashBoard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
