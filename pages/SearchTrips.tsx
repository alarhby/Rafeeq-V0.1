
import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES, CITIES } from '../constants';

const SearchTrips: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Filter States
  const [minRating, setMinRating] = useState<number | null>(null);
  const [vehicleType, setVehicleType] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

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
    count += vehicleType.length;
    count += amenities.length;
    setActiveFiltersCount(count);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setMinRating(null);
    setVehicleType([]);
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
    <div className="space-y-6 pb-20">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition bg-white shadow-sm">
          <ArrowRight size={24} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">البحث عن رحلة</h2>
      </div>
      
      {/* Quick Search Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
             <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
             <input
                type="text"
                placeholder="من: جدة، الرياض..."
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
          <div className="relative">
             <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
             <input
                type="text"
                placeholder="إلى: صنعاء، عدن..."
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
          <div className="relative">
             <Calendar className="absolute right-3 top-3 text-gray-400" size={18} />
             <input
                type="date"
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition">
           <Search size={20} />
           بحث عن رحلات
        </button>
      </div>

      {/* Results Controls */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-700">النتائج (12 رحلة)</h3>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border transition ${
            activeFiltersCount > 0 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'bg-white border-gray-100 text-gray-500'
          }`}
        >
           <Filter size={16} />
           تصفية المتقدمة
           {activeFiltersCount > 0 && (
             <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
               {activeFiltersCount}
             </span>
           )}
        </button>
      </div>

      {/* Trips Results List - Redesigned */}
      <div className="space-y-6">
         {[1, 2, 3, 4].map(i => (
           <div 
             key={i} 
             onClick={() => navigate(`/trip/t-${i}`)}
             className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer group"
           >
              {/* Prominent Image Section */}
              <div className="relative h-56 w-full bg-gray-100">
                <img 
                  src={`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600&h=400&seed=${i + 10}`} 
                  alt="Vehicle" 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                   <div className="flex flex-col items-end leading-tight">
                     <span className="font-black text-lg text-blue-600">180 <span className="text-[10px]">ر.س</span></span>
                     <span className="text-[9px] text-gray-400 font-bold">للمقعد</span>
                   </div>
                </div>

                {/* Car Model Chip */}
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10">
                  <Car size={14} />
                  تويوتا هايلاكس 2023
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                
                {/* Driver Info */}
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Driver" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-800 text-sm">{i === 1 ? 'محمد اليافعي' : i === 2 ? 'سالم العولقي' : 'ياسر القحطاني'}</h4>
                         <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                           <Star size={10} fill="currentColor" />
                           <span>4.9</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-1">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400" title="تكييف">
                        <Wind size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400" title="Wifi">
                        <Wifi size={14} />
                      </div>
                   </div>
                </div>

                {/* Route Timeline */}
                <div className="relative pr-4 border-r-2 border-dashed border-gray-100 space-y-6 mb-8">
                   <div className="relative">
                      <div className="absolute -right-[23px] top-1 w-4 h-4 rounded-full border-4 border-white bg-blue-600 shadow-sm"></div>
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-gray-800">مكة المكرمة</div>
                        <div className="text-xs text-gray-400 font-medium">08:00 ص</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">حي العزيزية - نقطة التجمع</div>
                   </div>
                   <div className="relative">
                      <div className="absolute -right-[23px] top-1 w-4 h-4 rounded-full border-4 border-white bg-green-500 shadow-sm"></div>
                      <div className="flex justify-between items-start">
                         <div className="font-bold text-gray-800">صنعاء</div>
                         <div className="text-xs text-gray-400 font-medium">10:00 م</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">شارع الستين - جولة الرويشان</div>
                   </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trip/t-${i}`);
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  احجز مقعدك الآن
                  <ChevronLeft size={18} />
                </button>
              </div>
           </div>
         ))}
      </div>

      {/* Advanced Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
               <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                 <X size={20} />
               </button>
               <h3 className="text-xl font-black text-gray-800">تصفية النتائج</h3>
               <button onClick={resetFilters} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                 إعادة ضبط
               </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              
              {/* Driver Rating Filter */}
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-800">تقييم السائق</label>
                <div className="flex gap-2">
                  {[4, 4.5, 4.8].map(rate => (
                    <button
                      key={rate}
                      onClick={() => setMinRating(rate)}
                      className={`flex-1 py-3 px-2 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-1 transition ${
                        minRating === rate ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'
                      }`}
                    >
                      <Star size={12} fill={minRating === rate ? "currentColor" : "none"} />
                      {rate}+ نجوم
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Type Filter */}
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-800">نوع المركبة</label>
                <div className="flex flex-wrap gap-2">
                  {vehicleOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter(vehicleType, setVehicleType, type)}
                      className={`py-2.5 px-5 rounded-2xl border-2 font-bold text-xs transition flex items-center gap-2 ${
                        vehicleType.includes(type) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'
                      }`}
                    >
                      <Car size={14} />
                      {type}
                      {vehicleType.includes(type) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-800">مميزات الرحلة</label>
                <div className="grid grid-cols-1 gap-3">
                  {amenityOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => toggleFilter(amenities, setAmenities, option.id)}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-between transition ${
                        amenities.includes(option.id) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          amenities.includes(option.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {option.icon}
                        </div>
                        <span className="font-bold text-sm">{option.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        amenities.includes(option.id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200'
                      }`}>
                        {amenities.includes(option.id) && <Check size={12} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Action */}
            <div className="p-8 bg-gray-50 rounded-t-[2.5rem]">
               <button 
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
               >
                 تطبيق الفلاتر
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTrips;
