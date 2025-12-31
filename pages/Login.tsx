import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { Phone, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { sendOTP, verifyOTP } from '../services/otpService';
import { loginWithPhone } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone) {
      setError('يرجى إدخال رقم الجوال');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phone);
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
      await verifyOTP(phone, otp);

      // If OTP verified, login the user
      // Note: If user doesn't exist, this will create a new one with default "New User" name
      const user = await loginWithPhone(phone);

      onLogin(user);
    } catch (err: any) {
      console.error("Verification Error:", err);
      setError(err.message || 'رمز التحقق غير صحيح/فشل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
        {step === 1 ? 'تسجيل الدخول' : 'تأكيد رقم الجوال'}
      </h1>
      <p className="text-gray-500 text-center mb-8">
        {step === 1 ? 'أدخل رقم جوالك للدخول' : `تم إرسال رمز التحقق إلى ${phone}`}
      </p>

      <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-right-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
            <div className="relative mb-4">
              <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966xxxxxxxxx"
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                dir="ltr"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mb-4 text-left" dir="ltr">Format: +9665xxxxxxxx</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  إرسال رمز التحقق
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز التحقق</label>
            <div className="relative mb-4">
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
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'دخول'}
              </button>
            </div>

            <div className="text-center mt-4">
              <button type="button" onClick={handleSendOTP} className="text-sm text-blue-600 hover:underline">
                إعادة إرسال الرمز
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">ليس لديك حساب؟ </span>
        <Link to="/register" className="text-blue-600 font-bold hover:underline">سجل الآن</Link>
      </div>
    </div>
  );
};

export default Login;