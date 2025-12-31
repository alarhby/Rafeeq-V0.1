
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Notification } from '../types';
import { 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Package, 
  Clock,
  ChevronLeft,
  Trash2,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { subscribeToMyNotifications, markNotificationAsRead } from '../services/database';

interface NotificationsProps {
  user: User;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMyNotifications(user.id, (fetchedNotifs) => {
      setNotifications(fetchedNotifs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
    }
    
    if (notif.relatedId) {
      navigate(`/shipment/${notif.relatedId}`);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    return date.toLocaleDateString('ar-SA');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'OFFER_RECEIVED': return <Package className="text-blue-500" size={20} />;
      case 'OFFER_ACCEPTED': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'OFFER_REJECTED': return <XCircle className="text-red-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-800 bg-gray-50/50">
          <ArrowRight size={22} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900">الإشعارات</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">تنبيهات فورية لنشاطاتك</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
            <p className="font-bold text-gray-400">جاري تحميل التنبيهات...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-5 rounded-[2rem] shadow-sm border transition-all cursor-pointer flex items-start gap-4 relative overflow-hidden group ${
                notif.read ? 'bg-white border-gray-100' : 'bg-blue-50/30 border-blue-100 ring-1 ring-blue-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notif.read ? 'bg-gray-50' : 'bg-white shadow-sm'
              }`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-black truncate ${notif.read ? 'text-gray-700' : 'text-blue-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap mr-2">
                    {getTimeAgo(notif.createdAt)}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed font-bold ${notif.read ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              
              <div className="absolute -left-10 group-hover:left-4 transition-all duration-300">
                <div className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:text-red-500">
                  <ChevronLeft size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center px-6">
            <Bell size={64} className="text-gray-100 mb-6" />
            <h3 className="text-xl font-black text-gray-400 mb-2">لا توجد إشعارات</h3>
            <p className="text-sm text-gray-400 font-bold max-w-xs leading-relaxed">
              ستظهر هنا التنبيهات المتعلقة بحجوزاتك وعروض أسعار الشحنات.
            </p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <button className="w-full py-4 text-xs font-black text-gray-400 hover:text-blue-600 transition">
          مسح كافة الإشعارات
        </button>
      )}
    </div>
  );
};

export default Notifications;
