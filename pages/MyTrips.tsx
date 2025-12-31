
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trip } from '../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Users, 
  CheckCircle2,
  TrendingUp,
  MapPinned,
  XCircle,
  AlertTriangle,
  Loader2,
  X,
  Edit2
} from 'lucide-react';
import { subscribeToMyTrips, updateTrip } from '../services/database';

interface MyTripsProps {
  user: User;
}

const MyTrips: React.FC<MyTripsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedTripForCancel, setSelectedTripForCancel] = useState<Trip | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    console.log("Subscribing to trips for user:", user.id);
    const unsubscribe = subscribeToMyTrips(user.id, (fetchedTrips) => {
      console.log("Fetched trips:", fetchedTrips);
      setTrips(fetchedTrips);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.id]);

  // تصفية الرحلات بحسب التبويب النشط
  const filteredTrips = trips.filter(trip => {
    // في الوضع الحالي، كل رحلات Firebase نشطة ما لم تكن منتهية
    if (activeTab === 'upcoming') {
      return trip.status !== 'DELIVERED'; 
    } else {
      return trip.status === 'DELIVERED';
    }
  });

  const openCancelModal = (e: React.MouseEvent, trip: Trip) => {
    e.stopPropagation();
    setSelectedTripForCancel(trip);
    setIsCancelling(true);
    setCancellationReason('');
  };

  const handleConfirmCancel = async () => {
    if (!selectedTripForCancel) return;
    setIsSubmitLoading(true);
    try {
      await updateTrip(selectedTripForCancel.id, { 
        status: 'CANCELLED',
        cancellationReason: cancellationReason 
      });
      setIsCancelling(false);
      setSelectedTripForCancel(null);
    } catch (error) {
      alert('حدث خطأ أثناء إلغاء الرحلة.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
        <p className="font-bold text-gray-500">جاري تحميل رحلاتك...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-800 bg-gray-50/50">
            <ArrowRight size={22} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900">رحلاتي</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">إدارة رحلاتك المسجلة</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100/60 p-1.5 rounded-[2rem] flex items-center shadow-inner">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-black transition-all duration-300 ${
            activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
          }`}
        >
          <TrendingUp size={16} />
          القادمة
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-black transition-all duration-300 ${
            activeTab === 'past' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'
          }`}
        >
          <CheckCircle2 size={16} />
          السابقة
        </button>
      </div>
      
      <div className="space-y-5">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div 
              key={trip.id} 
              onClick={() => navigate(`/trip/${trip.id}`)}
              className={`group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${trip.status === 'CANCELLED' ? 'opacity-60' : ''}`}
            >
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">التاريخ والوقت</div>
                    <div className="text-sm font-black text-gray-800">{trip.date} • {trip.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {trip.status === 'ACTIVE' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit-trip/${trip.id}`); }}
                      className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black border ${
                    trip.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 
                    trip.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {trip.status === 'ACTIVE' ? 'نشطة' : trip.status === 'CANCELLED' ? 'ملغاة' : 'منتهية'}
                  </div>
                </div>
              </div>

              <div className="px-8 py-4">
                <div className="relative pr-6 space-y-4 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-blue-50 before:border-r before:border-dashed before:border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm shrink-0"></div>
                    <div className="font-black text-gray-800 text-sm">{trip.fromCity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm shrink-0"></div>
                    <div className="font-black text-gray-800 text-sm">{trip.toCity}</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-xs font-black text-gray-600">{trip.seatsBooked} / {trip.seatsAvailable}</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-black text-blue-600 leading-none">{trip.price} <span className="text-[10px]">ر.س</span></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <MapPinned size={40} className="text-gray-200 mb-4" />
            <h3 className="font-black text-gray-400 text-sm">لا توجد رحلات حالياً</h3>
            <button 
              onClick={() => navigate('/add-trip')}
              className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs"
            >
              أنشئ رحلتك الأولى
            </button>
          </div>
        )}
      </div>

      {isCancelling && selectedTripForCancel && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <button onClick={() => setIsCancelling(false)} className="p-2 text-gray-300">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-2xl font-black text-gray-800">إلغاء الرحلة؟</h3>
            <textarea 
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="سبب الإلغاء (اختياري)..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold h-24 outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsCancelling(false)} className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm">تراجع</button>
              <button onClick={handleConfirmCancel} className="py-4 bg-red-600 text-white rounded-2xl font-black text-sm">تأكيد الإلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
