import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Users, 
  ChevronLeft, 
  Car, 
  CheckCircle2,
  TrendingUp,
  MapPinned,
  MoreHorizontal,
  DollarSign
} from 'lucide-react';

interface MyTripsProps {
  user: User;
}

const MyTrips: React.FC<MyTripsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // بيانات افتراضية للرحلات
  const trips = [
    {
      id: 't1',
      fromCity: 'جدة',
      fromLocation: 'حي العزيزية - نقطة التجمع',
      toCity: 'صنعاء',
      toLocation: 'شارع الستين - جولة الرويشان',
      date: '2024-05-25',
      time: '08:00 ص',
      status: 'ACTIVE',
      price: 150,
      seatsBooked: 3,
      seatsAvailable: 4,
      vehicle: 'تويوتا كامري 2023',
      driverName: 'سالم العولقي'
    },
    {
      id: 't2',
      fromCity: 'الرياض',
      fromLocation: 'البطحاء - موقف النقل الجماعي',
      toCity: 'عدن',
      toLocation: 'المنصورة - جولة السفينة',
      date: '2024-05-10',
      time: '10:00 م',
      status: 'COMPLETED',
      price: 220,
      seatsBooked: 4,
      seatsAvailable: 4,
      vehicle: 'هيونداي H1',
      driverName: 'محمد اليافعي'
    }
  ];

  const filteredTrips = trips.filter(trip => 
    activeTab === 'upcoming' ? trip.status === 'ACTIVE' : trip.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-800 bg-gray-50/50">
            <ArrowRight size={22} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900">رحلاتي</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">تتبع وإدارة رحلاتك</p>
          </div>
        </div>
        <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Tabs Design */}
      <div className="bg-gray-100/60 p-1.5 rounded-[2rem] flex items-center shadow-inner">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-black transition-all duration-300 ${
            activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm transform scale-[1.02]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <TrendingUp size={16} />
          الرحلات القادمة
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-black transition-all duration-300 ${
            activeTab === 'past' ? 'bg-white text-gray-700 shadow-sm transform scale-[1.02]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <CheckCircle2 size={16} />
          الرحلات السابقة
        </button>
      </div>
      
      {/* List Area */}
      <div className="space-y-5">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div 
              key={trip.id} 
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer"
            >
              {/* Card Header: Info & Badge */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-400 mb-0.5">موعد الرحلة</div>
                    <div className="text-sm font-black text-gray-800">{trip.date} • {trip.time}</div>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wide ${
                  trip.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500'
                }`}>
                  {trip.status === 'ACTIVE' ? 'نشطة الآن' : 'تمت بنجاح'}
                </div>
              </div>

              {/* Card Body: Route Timeline */}
              <div className="px-8 py-4">
                <div className="relative pr-6 space-y-8 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-blue-50 before:border-r before:border-dashed before:border-blue-200">
                  <div className="relative">
                    <div className="absolute -right-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-4 border-white shadow-sm ring-4 ring-blue-50/50"></div>
                    <div>
                      <div className="font-black text-gray-800 text-lg leading-none mb-1">{trip.fromCity}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{trip.fromLocation}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -right-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-green-500 border-4 border-white shadow-sm ring-4 ring-green-50/50"></div>
                    <div>
                      <div className="font-black text-gray-800 text-lg leading-none mb-1">{trip.toCity}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{trip.toLocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Stats & Price */}
              <div className="px-6 py-5 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400">
                      <Users size={14} />
                    </div>
                    <span className="text-xs font-black text-gray-600">{trip.seatsBooked} / {trip.seatsAvailable}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400">
                      <Car size={14} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 truncate max-w-[100px]">{trip.vehicle}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="text-xl font-black text-blue-600 leading-none mb-0.5">{trip.price} <span className="text-[10px]">ر.س</span></div>
                    <div className="text-[8px] text-gray-300 font-black uppercase text-left tracking-tighter">للمقعد الواحد</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100 group-hover:translate-x-[-4px] transition-transform">
                    <ChevronLeft size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 mb-6 border-8 border-white shadow-xl">
              <MapPinned size={48} />
            </div>
            <h3 className="font-black text-gray-800 text-xl">قائمة رحلاتك فارغة</h3>
            <p className="text-xs text-gray-400 font-bold mt-2 max-w-[200px] text-center leading-relaxed">لم تقم بإضافة أو حجز أي رحلات {activeTab === 'upcoming' ? 'قادمة' : 'سابقة'} حتى الآن.</p>
            <button 
              onClick={() => navigate('/add-trip')}
              className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all hover:bg-blue-700"
            >
              ابدأ رحلتك الأولى
            </button>
          </div>
        )}
      </div>

      {/* Summary Footer Stats (Only for Past Tab) */}
      {activeTab === 'past' && filteredTrips.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 grid grid-cols-2 gap-8 divide-x divide-white/10 divide-x-reverse">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">
                <DollarSign size={12} /> إجمالي الأرباح
              </div>
              <div className="text-4xl font-black tracking-tight">1,450 <span className="text-sm font-bold opacity-60">ر.س</span></div>
            </div>
            <div className="pr-8 space-y-1">
              <div className="flex items-center gap-2 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">
                <CheckCircle2 size={12} /> رحلات مكتملة
              </div>
              <div className="text-4xl font-black tracking-tight">12</div>
            </div>
          </div>
          {/* Abstract Decorations */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;