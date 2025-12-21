import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole, VerificationStatus } from '../types';
import { MOCK_USERS } from '../constants';
import { Phone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // محاكاة تأخير الشبكة
    setTimeout(() => {
      // 1. محاولة تسجيل الدخول التجريبي (Mock)
      const mockUser = MOCK_USERS.find(u => u.phone === phone);
      if (mockUser) {
         onLogin(mockUser as User);
         setLoading(false);
         return;
      }

      // 2. محاكاة تسجيل الدخول لأي مستخدم آخر (Demo)
      if (phone.length >= 10 && password.length >= 6) {
        const demoUser: User = {
          id: 'demo-' + Date.now(),
          name: 'مستخدم تجريبي',
          phone: phone,
          role: UserRole.PASSENGER,
          isVerified: false,
          verificationStatus: VerificationStatus.NONE
        };
        onLogin(demoUser);
        setLoading(false);
        return;
      }

      // فشل الدخول
      setError('بيانات الدخول غير صحيحة. جرب الأزرار بالأسفل للحسابات التجريبية.');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">رَفيق</h1>
      <p className="text-gray-500 text-center mb-8">سافر أو اشحن طرودك بسهولة بين المملكة واليمن</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
          <div className="relative">
            <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966xxxxxxxxx"
              className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : (
            <>
              تسجيل الدخول
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">ليس لديك حساب؟ </span>
        <Link to="/register" className="text-blue-600 font-bold hover:underline">سجل الآن</Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center">أو سجل دخولك عبر حسابات تجريبية:</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setPhone('+966501234567'); setPassword('123456'); }} className="text-xs bg-gray-100 p-2 rounded hover:bg-gray-200 font-bold text-gray-600">سائق تجريبي</button>
          <button onClick={() => { setPhone('+967771234567'); setPassword('123456'); }} className="text-xs bg-gray-100 p-2 rounded hover:bg-gray-200 font-bold text-gray-600">مسافر تجريبي</button>
        </div>
      </div>
    </div>
  );
};

export default Login;