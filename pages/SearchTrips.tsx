
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  User, 
  ChevronLeft, 
  ArrowRight, 
  X, 
  Star, 
  Car, 
  Wind, 
  Wifi, 
  Briefcase,
  Check,
  Clock,
  Loader2,
  MapPinned
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES, CITIES } from '../constants';
import { subscribeToAllActiveTrips } from '../services/database';
import { Trip } from '../types';

const SearchTrips: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  
  // Search States
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  // Filter States
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  // Fetch real data from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToAllActiveTrips((fetchedTrips) => {
      setTrips(fetchedTrips);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...trips];

    // Search Filtering
    if (fromQuery) {
      result = result.filter(t => t.fromCity.toLowerCase().includes(fromQuery.toLowerCase()));
    }
    if (toQuery) {
      result = result.filter(t => t.toCity.toLowerCase().includes(toQuery.toLowerCase()));
    }
    if (dateQuery) {
      result = result.filter(t => t.date === dateQuery);
    }

    // Advanced Filtering (Mocking amenities logic as it's usually in notes or features)
    if (minRating) {
      // In real app, we'd join with driver rating. Mocking for now.
      result = result.filter(t => Math.random() > 0.1); 
    }

    setFilteredTrips(result);
  }, [trips, fromQuery, toQuery, dateQuery, minRating, vehicleTypes, amenities]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const applyFilters = () => {
    let count = 0;
    if (minRating) count++;
    count += vehicleTypes.length;
    count += amenities.length;
    setActiveFiltersCount(count);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setMinRating(null);
    setVehicleTypes([]);
    setAmenities([]);
    setActiveFiltersCount(0);
  };

  const vehicleOptions = ['سيدان', 'عائلية (SUV)', 'باص صغير', 'باص كبير'];
  const amenityOptions = [
    { id: 'ac', label: 'تكييف ممتاز', icon: <Wind size={16} /> },
    { id: 'wifi', label: 'إنترنت واي فاي', icon: <Wifi size={16} /> },
    { id: 'luggage', label: 'مساحة حقائب', icon: <Briefcase size={16} /> }
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-800 bg-gray-50/50">
          <ArrowRight size={22} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900">البحث عن رحلة</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">سافر بأمان وسهولة</p>
        </div>
      </div>
      
      {/* Search Controls Card */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative group">
             <MapPin className="absolute right-4 top-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
             <input
                type="text"
                placeholder="منين بتنطلق؟"
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
             />
          </div>
          <div className="relative group">
             <MapPin className="absolute right-4 top-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
             <input
                type="text"
                placeholder="وين وجهتك؟"
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
             />
          </div>
          <div className="relative group">
             <Calendar className="absolute right-4 top-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
             <input
                type="date"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
             />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-black text-xs ${
              activeFiltersCount > 0 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-gray-100 text-gray-500'
            }`}
          >
             <Filter size={16} />
             تصفية متقدمة
             {activeFiltersCount > 0 && (
               <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                 {activeFiltersCount}
               </span>
             )}
          </button>
          <button 
            className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition active:scale-95"
          >
             <Search size={20} />
             بحث سريع
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="font-black text-gray-800 flex items-center gap-2">
          {loading ? 'جاري البحث...' : `النتائج المتاحة (${filteredTrips.length})`}
        </h3>
        {!loading && filteredTrips.length > 0 && (
          <span className="text-[10px] text-gray-400 font-bold">مرتبة حسب الأحدث</span>
        )}
      </div>

      {/* Trips Results List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-gray-50 shadow-sm">
            <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
            <p className="font-black text-gray-400">جاري جلب الرحلات الحية...</p>
          </div>
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div 
              key={trip.id} 
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer group"
            >
              {/* Prominent Image Section */}
              <div className="relative h-48 w-full bg-slate-900">
                <img 
                  src={`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800&seed=${trip.id}`} 
                  alt="Vehicle" 
                  className="w-full h-full object-cover transition duration-1000 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 left-4 bg-white px-5 py-2 rounded-2xl shadow-xl flex flex-col items-center">
                   <span className="font-black text-xl text-blue-600 leading-none">{trip.price}</span>
                   <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-1">ر.س / مقعد</span>
                </div>

                {/* Car Model & Seats Badge */}
                <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
                  <div className="bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 border border-white/10">
                    <Car size={14} />
                    {trip.notes?.includes('تويوتا') ? 'تويوتا هايلاكس 2023' : 'مركبة معتمدة'}
                  </div>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg">
                    {trip.seatsAvailable - trip.seatsBooked} مقاعد شاغرة
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-7">
                {/* Driver Info */}
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg overflow-hidden shrink-0">
                        <img src={`https://i.pravatar.cc/150?u=${trip.driverId}`} alt="Driver" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h4 className="font-black text-gray-800 text-sm">{(trip as any).driverName || 'سائق معتمد'}</h4>
                         <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="flex items-center gap-0.5 text-amber-500">
                               <Star size={12} fill="currentColor" />
                               <span className="text-[10px] font-black">4.9</span>
                            </div>
                            <span className="text-[8px] text-gray-300 font-bold">• عضو موثق</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-1.5">
                      <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100" title="تكييف">
                        <Wind size={16} />
                      </div>
                      <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100" title="Wifi">
                        <Wifi size={16} />
                      </div>
                   </div>
                </div>

                {/* Route Timeline */}
                <div className="relative pr-6 border-r-2 border-dashed border-slate-100 space-y-8 mb-8">
                   <div className="relative">
                      <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-600 shadow-sm"></div>
                      <div className="flex justify-between items-start">
                        <div className="font-black text-slate-800">{trip.fromCity}</div>
                        <div className="text-[10px] text-slate-400 font-black tracking-tight">{trip.time}</div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-bold">{trip.fromCountry}</div>
                   </div>
                   <div className="relative">
                      <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-green-500 shadow-sm"></div>
                      <div className="flex justify-between items-start">
                         <div className="font-black text-slate-800">{trip.toCity}</div>
                         <div className="text-[10px] text-green-600 font-black">رحلة مباشرة</div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-bold">{trip.date}</div>
                   </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trip/${trip.id}`);
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-3 active:scale-[0.97] group/btn"
                >
                  احجز مقعدك الآن
                  <ChevronLeft size={20} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center px-6">
            <MapPinned size={64} className="text-gray-100 mb-6" />
            <h3 className="text-xl font-black text-gray-400 mb-2">لا توجد رحلات مطابقة</h3>
            <p className="text-sm text-gray-400 font-bold max-w-xs leading-relaxed">جرّب تغيير معايير البحث أو تصفح كافة الرحلات المتاحة حالياً.</p>
            <button 
              onClick={() => {setFromQuery(''); setToQuery(''); setDateQuery('');}}
              className="mt-8 text-blue-600 font-black text-sm hover:underline"
            >
              عرض كافة الرحلات
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-gray-100 rounded-2xl text-gray-500 hover:bg-gray-200 transition">
                 <X size={20} />
               </button>
               <h3 className="text-xl font-black text-gray-800">تصفية النتائج</h3>
               <button onClick={resetFilters} className="text-sm font-black text-blue-600 hover:text-blue-800 transition">
                 إعادة ضبط
               </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto">
              {/* Driver Rating Filter */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">تقييم السائق</label>
                <div className="flex gap-3">
                   {[4, 4.5, 4.8].map(rating => (
                     <button
                       key={rating}
                       onClick={() => setMinRating(minRating === rating ? null : rating)}
                       className={`flex-1 py-3 rounded-2xl border-2 font-black text-xs transition ${minRating === rating ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                     >
                       {rating}+ نجوم
                     </button>
                   ))}
                </div>
              </div>

              {/* Vehicle Type Filter */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">نوع المركبة</label>
                <div className="grid grid-cols-2 gap-3">
                   {vehicleOptions.map(type => (
                     <button
                       key={type}
                       onClick={() => toggleFilter(vehicleTypes, setVehicleTypes, type)}
                       className={`py-3 px-4 rounded-2xl border-2 font-black text-xs text-right flex items-center justify-between transition ${vehicleTypes.includes(type) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                     >
                       {type}
                       {vehicleTypes.includes(type) && <Check size={16} />}
                     </button>
                   ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">المميزات والخدمات</label>
                <div className="space-y-2">
                   {amenityOptions.map(option => (
                     <button
                       key={option.id}
                       onClick={() => toggleFilter(amenities, setAmenities, option.id)}
                       className={`w-full py-4 px-6 rounded-2xl border-2 font-black text-sm flex items-center justify-between transition ${amenities.includes(option.id) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                     >
                       <div className="flex items-center gap-3">
                         {option.icon}
                         {option.label}
                       </div>
                       {amenities.includes(option.id) && <Check size={18} />}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-gray-50 border-t border-gray-100">
               <button 
                  onClick={applyFilters}
                  className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
               >
                 عرض النتائج
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTrips;
