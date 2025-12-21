
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, Package, UserCircle, Car, List } from 'lucide-react';
import { UserRole } from '../types';

interface BottomNavProps {
  mode: UserRole;
  role: UserRole;
}

const BottomNav: React.FC<BottomNavProps> = ({ mode, role }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2 md:hidden z-50">
      <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        <Home size={20} />
        <span className="text-xs">الرئيسية</span>
      </NavLink>

      {mode === UserRole.PASSENGER ? (
        <>
          <NavLink to="/search" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <Search size={20} />
            <span className="text-xs">بحث</span>
          </NavLink>
          <NavLink to="/create-shipment" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <PlusCircle size={20} />
            <span className="text-xs">شحن</span>
          </NavLink>
          <NavLink to="/shipments" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <Package size={20} />
            <span className="text-xs">شحناتي</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/add-trip" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <PlusCircle size={20} />
            <span className="text-xs">رحلة</span>
          </NavLink>
          <NavLink to="/my-trips" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <List size={20} />
            <span className="text-xs">رحلاتي</span>
          </NavLink>
          <NavLink to="/vehicles" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <Car size={20} />
            <span className="text-xs">سياراتي</span>
          </NavLink>
        </>
      )}

      <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        <UserCircle size={20} />
        <span className="text-xs">حسابي</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
