
import React, { useState, useEffect } from 'react';
import { User, UserRole, Notification } from '../types';
import { LogOut, User as UserIcon, Settings, ShieldCheck, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToMyNotifications } from '../services/database';

interface NavbarProps {
  user: User;
  mode: UserRole;
  setMode: (mode: UserRole) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, mode, setMode, onLogout }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeToMyNotifications(user.id, (notifs) => {
      const unread = notifs.filter(n => !n.read).length;
      setUnreadCount(unread);
    });
    return () => unsub();
  }, [user.id]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <Link to="/" className="text-2xl font-bold text-blue-600">رَفيق</Link>
        
        <div className="flex items-center gap-2">
          {user.role === UserRole.DRIVER && (
            <div className="bg-gray-100 p-1 rounded-xl flex ml-2">
              <button
                onClick={() => setMode(UserRole.PASSENGER)}
                className={`px-3 py-1 rounded-lg text-xs transition ${mode === UserRole.PASSENGER ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
              >
                مسافر
              </button>
              <button
                onClick={() => setMode(UserRole.DRIVER)}
                className={`px-3 py-1 rounded-lg text-xs transition ${mode === UserRole.DRIVER ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
              >
                سائق
              </button>
            </div>
          )}

          <div className="flex items-center gap-1">
             <Link to="/notifications" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition relative">
               <Bell size={20} />
               {unreadCount > 0 && (
                 <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-bold min-w-[14px] h-[14px] flex items-center justify-center rounded-full border border-white">
                   {unreadCount > 9 ? '+9' : unreadCount}
                 </span>
               )}
             </Link>
             {user.role === UserRole.ADMIN && (
               <Link to="/admin" className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition">
                 <ShieldCheck size={20} />
               </Link>
             )}
             <Link to="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
               <UserIcon size={20} />
             </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
