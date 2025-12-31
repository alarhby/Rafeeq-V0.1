import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Phone, User as UserIcon, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { sendOTP, verifyOTP } from '../services/otpService';
import { loginWithPhone } from '../services/authService';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: UserRole.PASSENGER,
  });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone) {
      setError('يرجى تعبئة جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(formData.phone);
      setStep(2);
    } catch (err: any) {
      console.error("OTP Error:", err);
      setError(err.message || 'فشل إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOTP(formData.phone, otp);

      // If OTP verified, register/login the user
      const user = await loginWithPhone(formData.phone, formData.name);

      onRegister(user);
    } catch (err: any) {
      console.error("Verification Error:", err);
      setError(err.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
        {step === 1 ? 'إنشاء حساب جديد' : 'تأكيد رقم الجوال'}
      </h1>
      <p className="text-gray-500 text-center mb-8">
        {step === 1 ? 'انضم إلى مجتمع رفيق' : `تم إرسال رمز التحقق إلى ${formData.phone}`}
      </p>

      <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-4">
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966xxxxxxxxx"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  dir="ltr"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-left" dir="ltr">Format: +9665xxxxxxxx</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحساب</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: UserRole.PASSENGER })}
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition ${formData.role === UserRole.PASSENGER ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                >
                  مسافر
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: UserRole.DRIVER })}
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition ${formData.role === UserRole.DRIVER ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'}`}
                >
                  سائق
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>التالي <ArrowRight size={18} /></>}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز التحقق</label>
              <div className="relative">
                <ShieldCheck className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-center text-2xl tracking-widest"
                  maxLength={4}
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
                تغيير الرقم
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'تحقق وإنشاء الحساب'}
              </button>
            </div>

            <div className="text-center">
              <button type="button" onClick={handleSendOTP} className="text-sm text-blue-600 hover:underline">
                إعادة إرسال الرمز
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