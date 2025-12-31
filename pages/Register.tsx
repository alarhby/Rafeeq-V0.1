import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole, VerificationStatus } from '../types';
import { Phone, Lock, User as UserIcon, ArrowRight, Mail, Loader2, AlertCircle } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.PASSENGER,
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.name || !formData.phone) {
        setError('يرجى تعبئة جميع الحقول');
        return;
      }
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      // محاكاة عملية التسجيل محلياً
      setTimeout(() => {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          isVerified: false,
          verificationStatus: VerificationStatus.NONE,
          avatar: ''
        };

        // حفظ المستخدم في LocalStorage (اختياري هنا، سيتم حفظه عند تسجيل الدخول في App)
        // localStorage.setItem('rafiq_user', JSON.stringify(newUser));

        onRegister(newUser);
        setLoading(false);
      }, 1000);

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError('حدث خطأ أثناء إنشاء الحساب');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">إنشاء حساب جديد</h1>
      <p className="text-gray-500 text-center mb-8">انضم إلى مجتمع رفيق</p>
      
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <div className="relative">
                <UserIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="محمد علي"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+966xxxxxxxxx"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحساب</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.PASSENGER})}
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition ${formData.role === UserRole.PASSENGER ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                >
                  مسافر
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.DRIVER})}
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition ${formData.role === UserRole.DRIVER ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                >
                  سائق
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              التالي
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني (اختياري)</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'إنشاء الحساب'}
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">لديك حساب بالفعل؟ </span>
        <Link to="/login" className="text-blue-600 font-bold hover:underline">تسجيل الدخول</Link>
      </div>
    </div>
  );
};

export default Register;