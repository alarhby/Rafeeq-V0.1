import React, { useState, useEffect } from 'react';
import { User, UserRole, VerificationStatus, Trip, Shipment } from '../types';
import { 
  Search, 
  Package, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Clock, 
  ChevronLeft, 
  CheckCircle, 
  Loader2,
  Car,
  User as UserIcon,
  Bell,
  Ticket,
  ArrowLeft,
  Heart,
  CalendarDays
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  subscribeToMyLastShipment,
  subscribeToMyLastBooking,
  subscribeToMyFavorites
} from '../services/database';

interface DashboardProps {
  user: User;
  mode: UserRole;
  setMode: (mode: UserRole) => void;
}

const Countdown: React.FC<{ targetDate: string, targetTime: string }> = ({ targetDate, targetTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(`${targetDate}T${targetTime}`).getTime();
      const diff = target - now;

      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000 * 60);

    setTimeLeft(calculate());
    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return (
    <div className="flex gap-2">
      <div className="bg-white/10 px-2 py-1 rounded-lg text-center min-w-[40px]">
        <div className="text-sm font-black">{timeLeft.days}</div>
        <div className="text-[8px] opacity-60 uppercase font-black">يوم</div>
      </div>
      <div className="bg-white/10 px-2 py-1 rounded-lg text-center min-w-[40px]">
        <div className="text-sm font-black">{timeLeft.hours}</div>
        <div className="text-[8px] opacity-60 uppercase font-black">ساعة</div>
      </div>
      <div className="bg-white/10 px-2 py-1 rounded-lg text-center min-w-[40px]">
        <div className="text-sm font-black">{timeLeft.minutes}</div>
        <div className="text-[8px] opacity-60 uppercase font-black">دقيقة</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, mode, setMode }) => {
  const navigate = useNavigate();
  const [lastShipment, setLastShipment] = useState<Shipment | null>(null);
  const [lastBooking, setLastBooking] = useState<any | null>(null);
  const [favoriteTrips, setFavoriteTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. جلب آخر شحنة للمستخدم
    const unsubShipment = subscribeToMyLastShipment(user.id, (shipment) => {
      setLastShipment(shipment);
    });

    // 2. جلب آخر حجز للمستخدم
    const unsubBooking = subscribeToMyLastBooking(user.id, (booking) => {
      setLastBooking(booking);
      setLoading(false);
    });

    // 3. جلب المفضلات
    const unsubFavs = subscribeToMyFavorites(user.id, (trips) => {
      setFavoriteTrips(trips);
    });

    return () => {
      unsubShipment();
      unsubBooking();
      unsubFavs();
    };
  }, [user.id]);

  return (
    <div className="space-y-6">
      {/* Mode Switcher Banner (Visible only for Drivers) */}
      {user.role === UserRole.DRIVER && (
        <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex-1 flex p-1 bg-gray-50 rounded-full relative">
            <button
              onClick={() => setMode(UserRole.PASSENGER)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-black transition-all z-10 ${
                mode === UserRole.PASSENGER ? 'text-blue-600 bg-white shadow-md' : 'text-gray-400'
              }`}
            >
              <UserIcon size={18} />
              وضع المسافر
            </button>
            <button
              onClick={() => setMode(UserRole.DRIVER)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-black transition-all z-10 ${
                mode === UserRole.DRIVER ? 'text-green-600 bg-white shadow-md' : 'text-gray-400'
              }`}
            >
              <Car size={18} />
              وضع السائق
            </button>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <section className={`p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden relative transition-all duration-500 ${
        mode === UserRole.DRIVER ? 'bg-gradient-to-br from-green-600 to-emerald-700' : 'bg-gradient-to-br from-blue-600 to-indigo-700'
      }`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black">مرحباً، {user.name}</h2>
            {user.verificationStatus === VerificationStatus.VERIFIED && (
              <div className="bg-white/20 backdrop-blur-md p-1 rounded-lg">
                <CheckCircle size={16} className="text-white" />
              </div>
            )}
          </div>
          <p className="opacity-90 text-sm font-medium">
            {mode === UserRole.DRIVER 
              ? 'أهلاً بك كشريك سائق، تصفح طلبات الشحن والركاب.' 
              : 'إلى أين تريد الذهاب اليوم؟ رفيقك في كل رحلة.'}
          </p>
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {mode === UserRole.PASSENGER ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Active Booking Section (Primary) */}
          {lastBooking && lastBooking.tripDetails ? (
            <section className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-black text-gray-800">رحلتك القادمة</h3>
                  <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-black">حجز مؤكد</span>
               </div>
               <div 
                 onClick={() => navigate(`/trip/${lastBooking.tripId}`)}
                 className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden cursor-pointer group transition-transform active:scale-95"
               >
                 <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                             <MapPin size={24} />
                          </div>
                          <div>
                             <div className="text-xs font-black text-blue-200">مسار الرحلة</div>
                             <div className="text-lg font-black leading-none mt-1">{lastBooking.tripDetails.fromCity} ← {lastBooking.tripDetails.toCity}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 text-xs font-bold opacity-80">
                          <span className="flex items-center gap-1"><CalendarDays size={14}/> {lastBooking.tripDetails.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {lastBooking.tripDetails.time}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col justify-end items-start md:items-end border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6">
                       <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">الوقت المتبقي للانطلاق</div>
                       <Countdown targetDate={lastBooking.tripDetails.date} targetTime={lastBooking.tripDetails.time} />
                    </div>
                 </div>
                 
                 {/* Ticket Notch effect */}
                 <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2"></div>
                 <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2"></div>
               </div>
            </section>
          ) : favoriteTrips.length > 0 ? (
            /* Favorites Section (Shown if no active booking) */
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-gray-800">رحلاتك المفضلة</h3>
                <Link to="/search" className="text-xs text-blue-600 font-black">المزيد</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 {favoriteTrips.map((trip) => (
                   <div 
                     key={trip.id}
                     onClick={() => navigate(`/trip/${trip.id}`)}
                     className="min-w-[240px] bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm shrink-0 cursor-pointer hover:border-blue-200 transition"
                   >
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                          <Heart size={18} fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="text-[10px] text-gray-400 font-black uppercase truncate">{trip.fromCity} ← {trip.toCity}</div>
                           <div className="text-sm font-black text-gray-800 truncate">{trip.date}</div>
                        </div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="text-blue-600 font-black text-sm">{trip.price} ر.س</div>
                        <div className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-1 rounded-lg">عرض التفاصيل</div>
                     </div>
                   </div>
                 ))}
              </div>
            </section>
          ) : null}

          {/* Shipment Card (Activity) */}
          {lastShipment && (
            <section className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-black text-gray-800">آخر شحنة</h3>
               </div>
               <div 
                  onClick={() => navigate(`/shipment/${lastShipment.id}`)}
                  className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-blue-100 transition"
               >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                     <Package size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between">
                        <h4 className="font-black text-gray-800 text-sm truncate">{lastShipment.title}</h4>
                        {lastShipment.offersCount > 0 && (
                          <span className="bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                            {lastShipment.offersCount} عروض
                          </span>
                        )}
                     </div>
                     <p className="text-[10px] text-gray-400 font-bold mt-1">إلى {lastShipment.toCity}</p>
                  </div>
                  <ArrowLeft size={16} className="text-gray-300" />
               </div>
            </section>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Link to="/search" className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-200 transition group">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Search size={24} />
              </div>
              <h3 className="font-black text-gray-800">حجز رحلة</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1">ابحث عن مقعد في رحلة متجهة لوجهتك</p>
            </Link>
            <Link to="/create-shipment" className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-200 transition group">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Package size={24} />
              </div>
              <h3 className="font-black text-gray-800">إرسال طرد</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1">اشحن أماناتك مع سائقين موثوقين</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Driver Status Card */}
          <div className={`p-6 rounded-[2rem] border transition-all ${
            user.verificationStatus === VerificationStatus.VERIFIED ? 'bg-green-50 border-green-100' :
            user.verificationStatus === VerificationStatus.PENDING ? 'bg-blue-50 border-blue-100' :
            user.verificationStatus === VerificationStatus.REJECTED ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                user.verificationStatus === VerificationStatus.VERIFIED ? 'bg-green-100 text-green-600' :
                user.verificationStatus === VerificationStatus.PENDING ? 'bg-blue-100 text-blue-600' : 'bg-white text-amber-500 shadow-sm'
              }`}>
                {user.verificationStatus === VerificationStatus.VERIFIED && <CheckCircle size={24} />}
                {user.verificationStatus === VerificationStatus.PENDING && <Loader2 size={24} className="animate-spin" />}
                {(user.verificationStatus === VerificationStatus.NONE || user.verificationStatus === VerificationStatus.REJECTED) && <Shield size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-gray-800 mb-1">
                  {user.verificationStatus === VerificationStatus.VERIFIED ? 'حساب موثق بالكامل' :
                   user.verificationStatus === VerificationStatus.PENDING ? 'قيد مراجعة الوثائق' :
                   user.verificationStatus === VerificationStatus.REJECTED ? 'تم رفض طلب التوثيق' : 'ابدأ توثيق حسابك'}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-bold">
                  {user.verificationStatus === VerificationStatus.VERIFIED ? 'يمكنك الآن استقبال الركاب وطلبات الشحن بكل ثقة.' :
                   user.verificationStatus === VerificationStatus.PENDING ? 'نحن نقوم بمراجعة هويتك ووثائق مركبتك، سيصلك إشعار قريباً.' :
                   user.verificationStatus === VerificationStatus.REJECTED ? 'يرجى مراجعة سبب الرفض وإعادة رفع الوثائق المطلوبة.' : 'يجب عليك رفع الهوية ورخصة القيادة لتتمكن من إضافة رحلات جديدة.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <div className="text-green-600 font-black text-2xl">0</div>
              <div className="text-[10px] text-gray-400 font-black">رحلة مكتملة</div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <div className="text-amber-500 font-black text-2xl">--</div>
              <div className="text-[10px] text-gray-400 font-black">التقييم</div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <div className="text-blue-600 font-black text-2xl">0</div>
              <div className="text-[10px] text-gray-400 font-black">الأرباح (ر.س)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/add-trip" className={`bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between transition group ${user.verificationStatus !== VerificationStatus.VERIFIED ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-500'}`}>
              <div>
                <h3 className="font-black text-gray-800">إنشاء رحلة جديدة</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1">اعرض مقاعدك الشاغرة للمسافرين</p>
              </div>
              <TrendingUp className="text-green-500 group-hover:scale-110 transition" />
            </Link>
            <Link to="/shipments" className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-green-500 transition group">
              <div>
                <h3 className="font-black text-gray-800">طلبات الشحن</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1">تصفح الشحنات المتاحة لنقلها</p>
              </div>
              <Package className="text-green-500 group-hover:scale-110 transition" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;