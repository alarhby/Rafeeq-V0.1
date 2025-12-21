
import React from 'react';
import { User, UserRole, VerificationStatus } from '../types';
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
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
  mode: UserRole;
  setMode: (mode: UserRole) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, mode, setMode }) => {
  const navigate = useNavigate();

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

          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-black text-gray-800">الرحلات النشطة الآن</h3>
              <Link to="/search" className="text-sm text-blue-600 font-black">عرض الكل</Link>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/trip/active-${i}`)}
                  className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-blue-100 transition"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="Driver" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-gray-800">سالم العولقي</h4>
                      <span className="text-blue-600 font-black text-lg">150 <span className="text-[10px]">ر.س</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-bold">
                      <MapPin size={12} className="text-blue-500" />
                      <span>جدة ← صنعاء</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 font-black uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock size={12} /> غداً 8:00 ص</span>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">3 مقاعد شاغرة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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
              <div className="text-green-600 font-black text-2xl">12</div>
              <div className="text-[10px] text-gray-400 font-black">رحلة مكتملة</div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <div className="text-amber-500 font-black text-2xl">4.9</div>
              <div className="text-[10px] text-gray-400 font-black">التقييم</div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <div className="text-blue-600 font-black text-2xl">2.5k</div>
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
