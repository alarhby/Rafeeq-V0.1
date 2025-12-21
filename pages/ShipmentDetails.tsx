
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Shipment, ShipmentOffer } from '../types';
import { 
  ArrowRight, 
  Package, 
  MapPin, 
  Calendar, 
  Weight, 
  Tag, 
  Clock, 
  ChevronLeft, 
  MessageCircle, 
  Phone, 
  Star, 
  ShieldCheck, 
  CheckCircle2,
  Info,
  ImageIcon
} from 'lucide-react';

interface ShipmentDetailsProps {
  user: User;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // تحميل البيانات من localStorage
    const saved = JSON.parse(localStorage.getItem('rafiq_shipments') || '[]');
    const found = saved.find((s: Shipment) => s.id === id);
    
    // إذا لم تكن في localStorage، نبحث في البيانات الافتراضية (لأغراض العرض)
    if (!found) {
      const mockShipments: Shipment[] = [
        {
          id: 's1',
          userId: 'u2',
          trackingNumber: 'RFQ-MOCK-001',
          title: 'شنطة ملابس وهدايا',
          type: 'طرود كبيرة',
          weight: 15,
          quantity: 1,
          recipientName: 'صالح محمد',
          recipientPhone: '+967770000000',
          recipientAddress: 'صنعاء، حي حدة',
          fromCity: 'الرياض',
          toCity: 'صنعاء',
          date: '2024-05-30',
          status: 'PENDING',
          offersCount: 2,
          images: ['https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=1200'],
          description: 'شنطة سفر متوسطة الحجم، تحتوي على ملابس شخصية وبعض الهدايا المغلفة.'
        }
      ];
      setShipment(mockShipments.find(s => s.id === id) || null);
    } else {
      setShipment(found);
    }
  }, [id]);

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <Info size={40} />
        </div>
        <h2 className="text-xl font-black text-gray-800">عذراً، لم يتم العثور على الشحنة</h2>
        <button onClick={() => navigate('/shipments')} className="text-blue-600 font-bold">العودة للقائمة</button>
      </div>
    );
  }

  // عروض وهمية
  const mockOffers = [
    { id: 'o1', driverName: 'سالم العولقي', price: 120, rating: 4.8, trips: 45, time: 'منذ ساعة' },
    { id: 'o2', driverName: 'محمد اليافعي', price: 150, rating: 4.9, trips: 112, time: 'منذ ساعتين' }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24 -mt-6">
      {/* معرض الصور - Header Section */}
      <div className="relative h-80 md:h-[450px] w-full overflow-hidden bg-gray-900 shadow-2xl rounded-b-[3rem]">
        {shipment.images && shipment.images.length > 0 ? (
          <>
            <img 
              src={shipment.images[activeImage]} 
              alt="Shipment" 
              className="w-full h-full object-cover opacity-90 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gray-800">
            <ImageIcon size={80} strokeWidth={1} />
            <span className="font-bold mt-4">لا توجد صور لهذه الشحنة</span>
          </div>
        )}
        
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/15 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/30 transition shadow-lg"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {shipment.images && shipment.images.length > 1 && (
          <div className="absolute bottom-8 right-6 flex gap-2 z-20">
            {shipment.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-12 h-12 rounded-xl border-2 overflow-hidden transition ${activeImage === idx ? 'border-blue-500 scale-110 shadow-lg' : 'border-white/30 opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`view ${idx}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 -mt-10 relative z-30 space-y-6">
        {/* تفاصيل الشحنة الأساسية */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Package size={16} />
                <span>{shipment.type}</span>
              </div>
              <h1 className="text-3xl font-black text-gray-800">{shipment.title}</h1>
            </div>
            <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 border border-amber-100">
              <Weight size={18} />
              {shipment.weight} كجم
            </div>
          </div>

          {/* المسار */}
          <div className="bg-gray-50 p-6 rounded-[2rem] relative space-y-8 before:absolute before:right-10 before:top-10 before:bottom-10 before:w-[2px] before:bg-blue-100 before:dashed">
             <div className="flex items-center gap-6 relative">
                <div className="w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-sm shrink-0 z-10"></div>
                <div>
                   <div className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">نقطة الاستلام</div>
                   <div className="text-lg font-black text-gray-800">{shipment.fromCity}</div>
                </div>
             </div>
             <div className="flex items-center gap-6 relative">
                <div className="w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-sm shrink-0 z-10"></div>
                <div>
                   <div className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">نقطة التسليم</div>
                   <div className="text-lg font-black text-gray-800">{shipment.toCity}</div>
                </div>
             </div>
          </div>

          {/* الوصف */}
          {shipment.description && (
            <div className="mt-8">
              <h3 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                وصف الشحنة
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-5 rounded-2xl border border-gray-50">
                {shipment.description}
              </p>
            </div>
          )}
        </div>

        {/* قائمة العروض */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-black text-gray-800">العروض المقدمة ({shipment.offersCount})</h3>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
               <Clock size={14} />
               تحديث تلقائي
             </div>
          </div>

          <div className="space-y-4">
            {mockOffers.map((offer) => (
              <div key={offer.id} className="bg-white p-6 rounded-[2rem] shadow-md border border-gray-100 hover:border-blue-200 transition group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/100?u=${offer.id}`} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="Driver" />
                    <div>
                      <h4 className="font-black text-gray-800">{offer.driverName}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                        <Star size={10} fill="currentColor" />
                        <span>{offer.rating}</span>
                        <span className="text-gray-300 font-medium mr-1">({offer.trips} رحلة)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-blue-600">{offer.price} <span className="text-xs text-gray-400 font-bold">ر.س</span></div>
                    <div className="text-[10px] text-gray-400 font-bold">{offer.time}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('سيتم تحويلك للدردشة مع السائق قريباً')}
                    className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                  >
                    <MessageCircle size={16} /> دردشة
                  </button>
                  <button 
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
                  >
                    قبول العرض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
