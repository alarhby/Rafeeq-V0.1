
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Trip } from '../types';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Plus, 
  Minus, 
  MessageCircle,
  Save,
  Loader2,
  AlertTriangle,
  Tag,
  Info
} from 'lucide-react';
import { COUNTRIES, CITIES } from '../constants';
import { getTripDetails, updateTrip } from '../services/database';

interface EditTripProps {
  user: User;
}

const EditTrip: React.FC<EditTripProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalTripData, setOriginalTripData] = useState<Trip | null>(null);

  const [formData, setFormData] = useState({
    fromCountry: COUNTRIES[0],
    fromCity: '',
    toCountry: COUNTRIES[1],
    toCity: '',
    date: '',
    time: '',
    seatsAvailable: 4,
    price: 150,
    notes: ''
  });

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const trip = await getTripDetails(id);
        if (trip) {
          if (trip.driverId !== user.id) {
            alert('لا تملك صلاحية تعديل هذه الرحلة.');
            navigate('/my-trips');
            return;
          }
          setOriginalTripData(trip);
          setFormData({
            fromCountry: trip.fromCountry,
            fromCity: trip.fromCity,
            toCountry: trip.toCountry,
            toCity: trip.toCity,
            date: trip.date,
            time: trip.time,
            seatsAvailable: trip.seatsAvailable,
            price: trip.price,
            notes: trip.notes || ''
          });
        }
      } catch (err) {
        console.error("Fetch Trip Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, user.id, navigate]);

  const hasReservations = originalTripData && originalTripData.seatsBooked > 0;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !originalTripData) return;
    
    setIsSubmitting(true);
    try {
      const updates: Partial<Trip> = {};
      
      if (hasReservations) {
        // Limited editing: Price and Seats only
        updates.price = formData.price;
        updates.seatsAvailable = formData.seatsAvailable;
        
        // Special logic for reduced price display
        if (formData.price < originalTripData.price) {
          updates.originalPrice = originalTripData.price;
        } else if (formData.price >= (originalTripData.originalPrice || originalTripData.price)) {
          // If price is back to normal or higher, remove special price badge
          updates.originalPrice = undefined;
        }
      } else {
        // Full editing
        Object.assign(updates, formData);
      }

      await updateTrip(id, updates);
      alert('تم تحديث بيانات الرحلة بنجاح.');
      navigate('/my-trips');
    } catch (err) {
      console.error("Update Trip Error:", err);
      alert('حدث خطأ أثناء تحديث الرحلة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold text-gray-500">جاري تحميل بيانات الرحلة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-800 bg-gray-50/50">
          <ArrowRight size={22} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900">تعديل الرحلة</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            {hasReservations ? 'تعديل محدود لوجود حجوزات' : 'يمكنك تعديل كافة التفاصيل'}
          </p>
        </div>
      </div>

      {hasReservations && (
        <div className="p-5 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-amber-800 text-sm">تنبيه: رحلة محجوزة</h4>
            <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
              هذه الرحلة لديها <span className="text-red-600 font-black">{originalTripData?.seatsBooked} ركاب</span>. يمكنك فقط تعديل السعر وعدد المقاعد المتبقية لضمان استقرار مواعيد المسافرين الحاليين.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Step 1: Route (Read-only if has reservations) */}
        <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 ${hasReservations ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3 text-blue-600 font-black">
            <MapPin size={22} />
            <h3>المسار والوجهة</h3>
          </div>
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400">من (الدولة)</label>
                  <select
                    value={formData.fromCountry}
                    onChange={(e) => setFormData({...formData, fromCountry: e.target.value, fromCity: ''})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400">من (المدينة)</label>
                  <select
                    value={formData.fromCity}
                    onChange={(e) => setFormData({...formData, fromCity: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="">اختر مدينة</option>
                    {CITIES[formData.fromCountry]?.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400">إلى (الدولة)</label>
                  <select
                    value={formData.toCountry}
                    onChange={(e) => setFormData({...formData, toCountry: e.target.value, toCity: ''})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400">إلى (المدينة)</label>
                  <select
                    value={formData.toCity}
                    onChange={(e) => setFormData({...formData, toCity: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="">اختر مدينة</option>
                    {CITIES[formData.toCountry]?.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
             </div>
          </div>
        </div>

        {/* Date & Time (Read-only if has reservations) */}
        <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 ${hasReservations ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3 text-blue-600 font-black">
            <Calendar size={22} />
            <h3>الموعد</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black text-gray-400">التاريخ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-gray-400">الوقت</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none"
                />
             </div>
          </div>
        </div>

        {/* Price and Seats (Always editable) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-600 font-black">
              <DollarSign size={22} />
              <h3>التسعير والمقاعد</h3>
            </div>
            {hasReservations && (
              <span className="text-[9px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded-lg animate-pulse">متاح للتعديل</span>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-tighter">سعر المقعد الواحد</label>
              <div className="relative">
                <div className="absolute right-4 top-4 text-xl font-black text-gray-300">ر.س</div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                  className="w-full pr-16 pl-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-3xl text-3xl font-black text-center outline-none focus:border-blue-600 transition"
                />
              </div>
              {hasReservations && formData.price < (originalTripData?.price || 0) && (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                  <Tag size={14} className="animate-bounce" />
                  <span className="text-[10px] font-black">سيظهر للمسافرين كسعر مخفض (عرض خاص)</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-tighter text-center block">إجمالي المقاعد المتاحة للرحلة</label>
              <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-100 rounded-3xl">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, seatsAvailable: Math.max(originalTripData?.seatsBooked || 1, formData.seatsAvailable - 1)})}
                  className="w-12 h-12 rounded-2xl bg-white shadow-sm text-blue-600 flex items-center justify-center hover:bg-blue-50 transition active:scale-90"
                >
                  <Minus size={20} />
                </button>
                <div className="text-center">
                  <span className="text-4xl font-black text-gray-800">{formData.seatsAvailable}</span>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">مقعد كلي</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, seatsAvailable: Math.min(12, formData.seatsAvailable + 1)})}
                  className="w-12 h-12 rounded-2xl bg-white shadow-sm text-blue-600 flex items-center justify-center hover:bg-blue-50 transition active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>
              {hasReservations && (
                <p className="text-[10px] text-center text-gray-400 font-bold">
                  لا يمكنك تقليل المقاعد عن <span className="text-blue-600">{originalTripData?.seatsBooked}</span> وهو عدد الركاب المحجوزين حالياً.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notes (Read-only if has reservations) */}
        <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 ${hasReservations ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3 text-blue-600 font-black">
            <MessageCircle size={22} />
            <h3>ملاحظات السائق</h3>
          </div>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 resize-none outline-none font-bold"
            placeholder="أضف أي تفاصيل أخرى..."
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
            حفظ التغييرات
          </button>
        </div>
      </form>

      <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
        <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Info size={20} />
        </div>
        <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
          تذكر أن تعديل بيانات الرحلة يؤثر على اختيار المسافرين لك. في حال تغيير الموعد جذرياً، يفضل إلغاء الرحلة وإعادة جدولتها.
        </p>
      </div>
    </div>
  );
};

export default EditTrip;
