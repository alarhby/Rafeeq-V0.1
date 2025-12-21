import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Heart
} from 'lucide-react';

const TripDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // بيانات افتراضية للرحلة (Mock Data)
  const trip = {
    id: id,
    driver: {
      name: 'عبدالرحمن باوزير',
      rating: 4.9,
      tripsCount: 184,
      joinedDate: 'يناير 2023',
      avatar: 'https://i.pravatar.cc/150?u=abdu',
      isVerified: true
    },
    vehicle: {
      model: 'تويوتا هايلاكس 2023',
      type: 'عائلية (SUV)',
      color: 'أبيض لؤلؤي',
      plate: 'أ ب ج 1234',
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200'
      ],
      features: [
        { icon: <Wind size={18} />, label: 'تكييف عالي البرودة' },
        { icon: <BatteryCharging size={18} />, label: 'شواحن USB' },
        { icon: <Briefcase size={18} />, label: 'صندوق عفش واسع' },
        { icon: <Wifi size={18} />, label: 'إنترنت واي فاي' }
      ]
    },
    route: {
      from: 'جدة - حي العزيزية (نقطة تجمع)',
      fromTime: '07:30 ص',
      to: 'صنعاء - جولة الرويشان',
      toTime: '09:00 م (متوقع)',
      date: 'الخميس، 25 مايو 2024'
    },
    pricePerSeat: 180,
    availableSeats: 4,
    notes: 'الرحلة ستكون مريحة وبها توقفات كافية للاستراحة والصلاة. نرجو من الجميع الالتزام بموعد التجمع. ممنوع التدخين داخل السيارة.'
  };

  const handleBooking = () => {
    alert(`تم إرسال طلب حجز لـ ${selectedSeats} مقاعد. سيقوم السائق بالرد عليك قريباً.`);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 -mt-6">
      {/* معرض صور المركبة - Hero Section */}
      <div className="relative h-80 md:h-[450px] w-full overflow-hidden bg-gray-900 shadow-2xl">
        <img 
          src={trip.vehicle.images[activeImage]} 
          alt="Vehicle" 
          className="w-full h-full object-cover opacity-90 transition-all duration-1000 transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        
        {/* أزرار التحكم العلوية */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/15 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/30 transition shadow-lg"
          >
            <ArrowRight size={24} />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 backdrop-blur-xl rounded-2xl border border-white/20 transition shadow-lg ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/15 text-white'}`}
          >
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* مصغرات الصور ونوع السيارة */}
        <div className="absolute bottom-10 left-6 right-6 flex justify-between items-end z-20">
          <div className="flex gap-2">
            {trip.vehicle.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition ${activeImage === idx ? 'border-blue-500 scale-110 shadow-lg' : 'border-white/30 opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Vehicle view ${idx}`} />
              </button>
            ))}
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40">
            {trip.vehicle.model}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-30 space-y-6">
        {/* بطاقة مسار الرحلة */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Calendar size={16} />
                <span>{trip.route.date}</span>
              </div>
              <h1 className="text-3xl font-black text-gray-800">تفاصيل المسار</h1>
            </div>
            <div className="text-left">
              <span className="text-3xl font-black text-blue-600">{trip.pricePerSeat}</span>
              <span className="text-xs text-gray-400 font-bold block">ر.س / للمقعد</span>
            </div>
          </div>

          <div className="relative pr-8 space-y-12 before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-1 before:bg-blue-50 before:rounded-full">
            <div className="relative">
              <div className="absolute -right-[33px] top-1 w-6 h-6 rounded-full border-4 border-white bg-blue-600 shadow-md"></div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-black text-gray-800">{trip.route.from}</div>
                  <div className="text-sm text-gray-400 font-bold mt-1">نقطة الانطلاق</div>
                </div>
                <div className="text-blue-600 font-black text-lg bg-blue-50 px-4 py-2 rounded-2xl">
                  {trip.route.fromTime}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-[33px] top-1 w-6 h-6 rounded-full border-4 border-white bg-green-500 shadow-md"></div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-black text-gray-800">{trip.route.to}</div>
                  <div className="text-sm text-gray-400 font-bold mt-1">نقطة الوصول</div>
                </div>
                <div className="text-green-600 font-black text-lg bg-green-50 px-4 py-2 rounded-2xl">
                  {trip.route.toTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* بطاقة اختيار عدد المقاعد */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <div className="font-black text-gray-800">عدد الركاب</div>
              <div className="text-xs text-gray-400 font-bold italic">متاح {trip.availableSeats} مقاعد</div>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
              className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-2xl font-black hover:bg-blue-50 active:scale-90 transition"
            >-</button>
            <span className="text-2xl font-black text-gray-800 w-8 text-center">{selectedSeats}</span>
            <button 
              onClick={() => setSelectedSeats(Math.min(trip.availableSeats, selectedSeats + 1))}
              className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-2xl font-black hover:bg-blue-50 active:scale-90 transition"
            >+</button>
          </div>
        </div>

        {/* تفاصيل السائق ومميزات السيارة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* بطاقة السائق */}
          <div className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img src={trip.driver.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="Driver" />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-white">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800">{trip.driver.name}</h3>
                <div className="flex items-center gap-1 text-sm text-amber-500 font-black">
                  <Star size={14} fill="currentColor" />
                  <span>{trip.driver.rating}</span>
                  <span className="text-gray-400 font-bold mr-1">({trip.driver.tripsCount} رحلة)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-blue-50 text-blue-700 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition">
                <MessageCircle size={20} /> دردشة
              </button>
              <button className="flex-1 py-4 bg-green-50 text-green-700 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition">
                <Phone size={20} /> اتصال
              </button>
            </div>
          </div>

          {/* مميزات السيارة */}
          <div className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 font-black text-gray-800 mb-6">
              <Car size={20} className="text-blue-600" />
              <span>تجهيزات المركبة</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trip.vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-blue-600">{feature.icon}</span>
                  {feature.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ملاحظات الرحلة */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <Info size={20} className="text-blue-500" />
            تنبيهات السائق
          </h4>
          <div className="p-5 bg-blue-50/50 rounded-2xl text-sm text-gray-600 leading-relaxed border border-blue-50 font-medium">
            "{trip.notes}"
          </div>
        </div>

        {/* شارة الأمان */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-200">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
            <ShieldCheck size={48} />
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-xl font-black mb-2">رحلة آمنة وموثوقة</h4>
            <p className="text-xs opacity-90 leading-relaxed font-medium">
              نحن في "رفيق" نتحقق من جميع وثائق السائقين والمركبات قبل السماح لهم بنشر الرحلات. خصوصيتك وسلامتك هي أولويتنا القصوى في كل رحلة.
            </p>
          </div>
        </div>
      </div>

      {/* الشريط السفلي العائم للحجز */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-2xl border-t border-gray-100 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="hidden sm:block">
            <div className="text-xs text-gray-400 font-bold mb-1">الإجمالي لـ {selectedSeats} مقاعد</div>
            <div className="text-2xl font-black text-blue-600">{trip.pricePerSeat * selectedSeats} ر.س</div>
          </div>
          <button 
            onClick={handleBooking}
            className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-4 active:scale-[0.98]"
          >
            {selectedSeats === 1 ? 'حجز مقعد واحد' : `حجز ${selectedSeats} مقاعد`}
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;