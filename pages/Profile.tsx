import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, VerificationStatus } from '../types';
import {
  LogOut,
  ChevronLeft,
  Shield,
  Bell,
  HelpCircle,
  Globe,
  ArrowRight,
  ShieldCheck,
  Clock,
  Camera,
  Loader2,
  CheckCircle2 as CheckCircle
} from 'lucide-react';
import { uploadImage } from '../services/database';
import { updateUserProfile } from '../services/authService';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح');
      return;
    }

    setUploading(true);
    try {
      // 1. رفع الصورة إلى Firebase Storage
      const fileName = `avatars/${user.id}/${Date.now()}-${file.name}`;
      const downloadUrl = await uploadImage(fileName, file);

      // 2. تحديث بيانات المستخدم في Firestore
      await updateUserProfile(user.id, { avatar: downloadUrl });

      // 3. تحديث الحالة المحلية
      setCurrentAvatar(downloadUrl);

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert(`حدث خطأ أثناء رفع الصورة: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition bg-white shadow-sm">
          <ArrowRight size={24} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">حسابي</h2>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div
            onClick={handleAvatarClick}
            className={`w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 font-bold text-3xl border-4 border-white shadow-sm overflow-hidden cursor-pointer relative transition-transform active:scale-95 ${uploading ? 'opacity-50' : ''}`}
          >
            {currentAvatar ? (
              <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}

            {/* Loading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Loader2 className="text-white animate-spin" size={24} />
              </div>
            )}

            {/* Edit Hover Overlay */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </div>
            )}
          </div>

          {/* Verification Badge */}
          {user.verificationStatus === VerificationStatus.VERIFIED && (
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-xl border-2 border-white shadow-sm z-10">
              <ShieldCheck size={14} />
            </div>
          )}

          {/* Camera Button for easier trigger */}
          <button
            onClick={handleAvatarClick}
            className="absolute -top-1 -left-1 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-blue-600 transition"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-800">{user.name}</h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">{user.phone}</p>
          <div className="mt-2 flex gap-2">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
              {user.role === UserRole.DRIVER ? 'سائق' : 'مسافر'}
            </span>
            {user.verificationStatus === VerificationStatus.VERIFIED ? (
              <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> موثق
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                <Clock size={10} /> قيد التحقق
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-5 font-bold text-gray-800 border-b border-gray-50 flex items-center gap-2">
          <Shield size={18} className="text-blue-600" />
          إعدادات الحساب
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="text-sm font-bold text-gray-700">الأمان وكلمة المرور</span>
            <ChevronLeft size={18} className="text-gray-300" />
          </button>
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="text-sm font-bold text-gray-700">اللغة (العربية)</span>
            <Globe size={18} className="text-gray-300" />
          </button>
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="text-sm font-bold text-gray-700">الإشعارات</span>
            <Bell size={18} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-5 font-bold text-gray-800 border-b border-gray-50 flex items-center gap-2">
          <HelpCircle size={18} className="text-purple-600" />
          الدعم والسياسات
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="text-sm font-bold text-gray-700">مركز المساعدة</span>
            <ChevronLeft size={18} className="text-gray-300" />
          </button>
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <span className="text-sm font-bold text-gray-700">الشروط والأحكام</span>
            <ChevronLeft size={18} className="text-gray-300" />
          </button>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-white text-red-600 p-5 rounded-[2rem] font-black border border-red-50 hover:bg-red-50 transition flex items-center justify-center gap-2 shadow-sm"
      >
        <LogOut size={20} />
        تسجيل الخروج
      </button>
    </div>
  );
};

export default Profile;