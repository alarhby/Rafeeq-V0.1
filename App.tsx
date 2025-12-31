import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { UserRole, User } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchTrips from './pages/SearchTrips';
import MyTrips from './pages/MyTrips';
import AddTrip from './pages/AddTrip';
import EditTrip from './pages/EditTrip';
import ManageVehicles from './pages/ManageVehicles';
import AddVehicle from './pages/AddVehicle';
import ShipmentList from './pages/ShipmentList';
import CreateShipment from './pages/CreateShipment';
import ShipmentDetails from './pages/ShipmentDetails';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import TripDetails from './pages/TripDetails';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<UserRole>(UserRole.PASSENGER);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData, id: firebaseUser.uid });
            setMode(userData.role);
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'مستخدم جديد',
              phone: firebaseUser.phoneNumber || '',
              role: UserRole.PASSENGER,
              isVerified: false,
              verificationStatus: 'NONE' as any
            } as User);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setMode(userData.role);
  };

  const handleLogout = async () => {
    await auth.signOut();
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
      <div className="min-h-screen pb-20 md:pb-0 bg-slate-50">
        {user && (
          <Navbar 
            user={user} 
            mode={mode} 
            setMode={setMode} 
            onLogout={handleLogout} 
          />
        )}
        
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
                <Route path="/register" element={<Register onRegister={handleLoginSuccess} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard user={user} mode={mode} setMode={setMode} />} />
                <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
                <Route path="/notifications" element={<Notifications user={user} />} />
                
                {/* مسارات المسافر */}
                <Route path="/search" element={<SearchTrips />} />
                <Route path="/shipments" element={<ShipmentList user={user} mode={mode} />} />
                <Route path="/create-shipment" element={<CreateShipment user={user} />} />
                <Route path="/shipment/:id" element={<ShipmentDetails user={user} />} />
                <Route path="/trip/:id" element={<TripDetails user={user} />} />

                {/* مسارات السائق */}
                <Route path="/add-trip" element={mode === UserRole.DRIVER ? <AddTrip user={user} /> : <Navigate to="/" />} />
                <Route path="/edit-trip/:id" element={mode === UserRole.DRIVER ? <EditTrip user={user} /> : <Navigate to="/" />} />
                <Route path="/my-trips" element={mode === UserRole.DRIVER ? <MyTrips user={user} /> : <Navigate to="/" />} />
                <Route path="/vehicles" element={mode === UserRole.DRIVER ? <ManageVehicles user={user} /> : <Navigate to="/" />} />
                <Route path="/add-vehicle" element={mode === UserRole.DRIVER ? <AddVehicle user={user} /> : <Navigate to="/" />} />

                {/* مسارات الإدارة */}
                <Route path="/admin" element={user.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>

        {user && <BottomNav mode={mode} role={user.role} />}
      </div>
    </Router>
  );
};

export default App;