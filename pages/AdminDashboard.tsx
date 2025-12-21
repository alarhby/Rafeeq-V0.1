
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, X, FileText, Car, User as UserIcon, ArrowRight } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'users' | 'support'>('vehicles');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowRight size={24} className="text-gray-800" />
            </button>
            <div className="flex items-center gap-3">
               <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                  <Shield size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-bold">لوحة الإدارة</h2>
                  <p className="text-sm text-gray-500">إدارة المستخدمين والطلبات</p>
               </div>
            </div>
         </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
         <button onClick={() => setActiveTab('vehicles')} className={`px-6 py-2 rounded-xl whitespace-nowrap font-bold transition ${activeTab === 'vehicles' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500'}`}>توثيق السيارات (3)</button>
         <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl whitespace-nowrap font-bold transition ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'}`}>المستخدمين</button>
         <button onClick={() => setActiveTab('support')} className={`px-6 py-2 rounded-xl whitespace-nowrap font-bold transition ${activeTab === 'support' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'}`}>الدعم الفني</button>
      </div>

      <div className="space-y-4">
         {activeTab === 'vehicles' && [1, 2, 3].map(i => (
           <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                       <UserIcon size={24} />
                    </div>
                    <div>
                       <h4 className="font-bold">ياسر القحطاني</h4>
                       <p className="text-xs text-gray-400">منذ 3 ساعات</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100"><Check size={20} /></button>
                    <button className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><X size={20} /></button>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Car size={14} /> تفاصيل السيارة</div>
                    <div className="text-sm font-bold">نيسان باترول - 2022</div>
                    <div className="text-xs text-blue-600">أ ب ج 5555</div>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                    <FileText size={20} className="text-gray-400 mr-2" />
                    <span className="text-sm font-bold text-gray-700">عرض المستندات</span>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
