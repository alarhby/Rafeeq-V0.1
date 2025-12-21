import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, User, VerificationStatus } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchTrips from './pages/SearchTrips';
import MyTrips from './pages/MyTrips';
import AddTrip from './pages/AddTrip';
import ManageVehicles from './pages/ManageVehicles';
import AddVehicle from './pages/AddVehicle';
import ShipmentList from './pages/ShipmentList';
import CreateShipment from './pages/CreateShipment';
import ShipmentDetails from './pages/ShipmentDetails';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import TripDetails from './pages/TripDetails';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<UserRole>(UserRole.PASSENGER);

  useEffect(() => {
    // محاكاة التحقق من الجلسة باستخدام localStorage
    const storedUser = localStorage.getItem('rafiq_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setMode(parsedUser.role);
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setMode(userData.role);
    localStorage.setItem('rafiq_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    // محاكاة تسجيل الخروج
    localStorage.removeItem('rafiq_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-blue-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen pb-20 md:pb-0">
        {user && <Navbar user={user} mode={mode} setMode={setMode} onLogout={handleLogout} />}
        
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/" />} />
            
            {user ? (
              <>
                <Route path="/" element={<Dashboard user={user} mode={mode} setMode={setMode} />} />
                <Route path="/search" element={<SearchTrips />} />
                <Route path="/trip/:id" element={<TripDetails />} />
                <Route path="/my-trips" element={<MyTrips user={user} />} />
                <Route path="/add-trip" element={<AddTrip user={user} />} />
                <Route path="/vehicles" element={<ManageVehicles user={user} />} />
                <Route path="/add-vehicle" element={<AddVehicle user={user} />} />
                <Route path="/shipments" element={<ShipmentList user={user} mode={mode} />} />
                <Route path="/shipment/:id" element={<ShipmentDetails user={user} />} />
                <Route path="/create-shipment" element={<CreateShipment user={user} />} />
                <Route path="/admin" element={user.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>

        {user && <BottomNav mode={mode} role={user.role} />}
      </div>
    </Router>
  );
};

export default App;