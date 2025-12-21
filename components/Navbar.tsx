
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, User as UserIcon, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: User;
  mode: UserRole;
  setMode: (mode: UserRole) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, mode, setMode, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <Link to="/" className="text-2xl font-bold text-blue-600">رَفيق</Link>
        
        <div className="flex items-center gap-4">
          {user.role === UserRole.DRIVER && (
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setMode(UserRole.PASSENGER)}
                className={`px-3 py-1 rounded-md text-sm transition ${mode === UserRole.PASSENGER ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
              >
                مسافر
              </button>
              <button
                onClick={() => setMode(UserRole.DRIVER)}
                className={`px-3 py-1 rounded-md text-sm transition ${mode === UserRole.DRIVER ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}
              >
                سائق
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
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
