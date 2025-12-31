import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, UserRole, Trip } from '../types';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  ShieldCheck, 
  Star, 
  MessageCircle, 
  Phone, 
  Info,
  ChevronLeft,
  Wind,
  Wifi,
  BatteryCharging,
  Briefcase,
  CheckCircle2,
  Clock,
  Heart,
  Minus,
  Plus,
  Box,
  Ticket,
  Loader2
} from 'lucide-react';
import { getTripDetails, toggleFavorite, isTripFavorite } from '../services/database';

interface TripDetailsProps {
  user: User;
}

const TripDetails: React.FC<TripDetailsProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const tripData = await getTripDetails(id);
      if (tripData) {
        // Mocking vehicle details if not in DB for better UI
        setTrip({
          ...tripData,
          driver: {
            name: (tripData as any).driverName || 'سائق رفيق الموثق',
            rating: 4.9,
            tripsCount: 124,
            joinedDate: '2023',
            avatar: `https://i.pravatar.cc/150?u=${tripData.driverId}`,
            isVerified: true
          },
          vehicle: {
            model: (tripData as any).vehicleModel || 'سيارة معتمدة',
            images: [
              'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
              'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200'
            ],
            features: [
              { icon: <Wind size={18} />, label: 'تكييف عالي البرودة' },
              { icon: <BatteryCharging size={18} />, label: 'شواحن USB' },
              { icon: <Briefcase size={18} />, label: 'صندوق عفش واسع' }
            ]
          }
        });

        const favStatus = await isTripFavorite(user.id, id);
        setIsFavorite(favStatus);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, user.id]);

  const handleToggleFavorite = async () => {
    if (!id || isFavLoading) return;
    setIsFavLoading(true);
    const newStatus = await toggleFavorite(user.id, id);
    setIsFavorite(newStatus);
    setIsFavLoading(false);
  };

  const handleBooking = () => {
    alert(`تم إرسال طلب حجز لـ ${selectedSeats} مقاعد. سيقوم السائق بالرد عليك قريباً.`);
    navigate('/');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
      <p className="font-black text-gray-400">جاري تحميل تفاصيل الرحلة...</p>
    </div>
  );

  if (!trip) return <div className="text-center py-20">الرحلة غير موجودة</div>;

  return (
    <div className="max-w-4xl mx-auto pb-32 -mt-6 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative h-80 md:h-[450px] w-full overflow-hidden bg-gray-900 shadow-2xl rounded-b-[3.5rem]">
        <img 
          src={trip.vehicle.images[activeImage]} 
          alt="Vehicle" 
          className="w-full h-full object-cover opacity-90 transition-all duration-1000 transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition active:scale-90"
          >
            <ArrowRight size={24} />
          </button>
          <button 
            onClick={handleToggleFavorite}
            disabled={isFavLoading}
            className={`p-3 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg transition active:scale-90 ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isFavLoading ? <Loader2 size={24} className="animate-spin" /> : <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />}
          </button>
        </div>

        <div className="absolute bottom-12 right-6 flex gap-2 z-20">
          {trip.vehicle.images.map((img: string, idx: number) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-blue-500 scale-110 shadow-lg' : 'border-white/40 opacity-60'}`}
            >
              <img src={img} className="w-full h-full object-cover" alt="Thumb" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-30 space-y-6">
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                <Car size={16} />
                <span>رحلة دولية مباشرة</span>
              </div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight">{trip.fromCity} ← {trip.toCity}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                  <Star size={16} fill="currentColor" />
                  <span>{trip.driver.rating}</span>
                </div>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-gray-400 text-xs font-bold">{trip.driver.tripsCount} رحلة مكتملة</span>
              </div>
            </div>
            <div className="bg-blue-600 text-white px-6 py-3 rounded-3xl text-center shadow-lg shadow-blue-100">
              <div className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">السعر للمقعد</div>
              <div className="text-2xl font-black">{trip.price} <span className="text-xs">ر.س</span></div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-[2.5rem] relative overflow-hidden mb-8">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-black uppercase mb-1">نقطة الانطلاق</div>
                  <div className="text-lg font-black text-gray-800">{trip.fromCity}</div>
                  <div className="text-xs text-blue-600 font-bold">{trip.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left md:text-right md:flex-row-reverse">
                <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-black uppercase mb-1">نقطة الوصول</div>
                  <div className="text-lg font-black text-gray-800">{trip.toCity}</div>
                  <div className="text-xs text-green-600 font-bold">{trip.date}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trip.vehicle.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="text-blue-600 mb-2">{feature.icon}</div>
                <span className="text-[10px] font-black text-gray-600 text-center">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Card */}
        {user.role === UserRole.PASSENGER && (
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">حجز مقاعدك</h3>
                <div className="text-right">
                  <div className="text-3xl font-black">{selectedSeats * trip.price} <span className="text-sm font-bold opacity-60">ر.س</span></div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 space-y-8">
                <div className="flex items-center justify-between bg-black/20 p-5 rounded-3xl border border-white/5">
                  <button 
                    onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
                    className="w-12 h-12 bg-white rounded-2xl text-blue-600 flex items-center justify-center font-black active:scale-90 shadow-lg"
                  >
                    <Minus size={24} />
                  </button>
                  <div className="text-center">
                    <div className="text-5xl font-black tracking-tighter">{selectedSeats}</div>
                    <div className="text-[10px] font-black opacity-40 uppercase tracking-widest">مقاعد محددة</div>
                  </div>
                  <button 
                    onClick={() => setSelectedSeats(Math.min(trip.seatsAvailable - trip.seatsBooked, selectedSeats + 1))}
                    className="w-12 h-12 bg-white rounded-2xl text-blue-600 flex items-center justify-center font-black active:scale-90 shadow-lg"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <button 
                  onClick={handleBooking}
                  className="w-full bg-white text-blue-700 py-6 rounded-[2.2rem] font-black text-xl shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
                >
                  تأكيد الحجز الآن
                  <ChevronLeft size={24} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;