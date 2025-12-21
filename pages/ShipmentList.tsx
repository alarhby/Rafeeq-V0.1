import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Shipment, VerificationStatus } from '../types';
import { 
  Package, 
  MapPin, 
  Weight, 
  Search, 
  X, 
  DollarSign, 
  Clock, 
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  ImageIcon,
  Truck,
  Info,
  ChevronRight,
  Loader2,
  AlertCircle,
  Hash
} from 'lucide-react';

interface ShipmentListProps {
  user: User;
  mode: UserRole;
}

const ShipmentList: React.FC<ShipmentListProps> = ({ user, mode }) => {
  const navigate = useNavigate();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [offerPrice, setOfferPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // تحميل الشحنات من التخزين المحلي والبيانات الافتراضية
    const saved = JSON.parse(localStorage.getItem('rafiq_shipments') || '[]');
    const mockShipments: Shipment[] = [
      {
        id: 's1',
        userId: 'u2',
        trackingNumber: 'RFQ-2024-100201',
        recipientAddress: 'صنعاء، حي حدة، شارع صفر',
        title: 'شنطة ملابس وهدايا',
        type: 'طرود كبيرة',
        weight: 15,
        quantity: 1,
        recipientName: 'صالح محمد',
        recipientPhone: '+967770000000',
        fromCity: 'الرياض',
        toCity: 'صنعاء',
        date: '2024-05-30',
        status: 'PENDING',
        offersCount: 2,
        images: ['https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400'],
        description: 'شنطة سفر متوسطة الحجم، تحتوي على ملابس شخصية وبعض الهدايا المغلفة.'
      },
      {
        id: 's2',
        userId: 'u3',
        trackingNumber: 'RFQ-2024-100202',
        recipientAddress: 'عدن، المنصورة، بلوك 4',
        title: 'أوراق ومستندات جامعية',
        type: 'طرود صغيرة',
        weight: 1,
        quantity: 1,
        recipientName: 'ناصر علي',
        recipientPhone: '+967710000000',
        fromCity: 'جدة',
        toCity: 'عدن',
        date: '2024-05-28',
        status: 'PENDING',
        offersCount: 5,
        images: [],
        description: 'ملف يحتوي على شهادات جامعية أصلية، يحتاج عناية فائقة.'
      }
    ];
    
    const combined = [...saved];
    mockShipments.forEach(mock => {
      if (!combined.find(s => s.id === mock.id)) {
        combined.push(mock);
      }
    });
    
    setAllShipments(combined);
  }, []);

  const displayedShipments = mode === UserRole.PASSENGER 
    ? allShipments.filter(s => s.userId === user.id)
    : allShipments.filter(s => s.status === 'PENDING');

  const filteredShipments = displayedShipments.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.toCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMakeOffer = (e: React.MouseEvent, shipment: Shipment) => {
    e.stopPropagation();
    if (user.verificationStatus !== VerificationStatus.VERIFIED) {
      alert('يجب توثيق حسابك ومركبتك أولاً لتتمكن من تقديم عروض الأسعار.');
      return;
    }
    setSelectedShipment(shipment);
    setIsOfferModalOpen(true);
  };

  const submitOffer = () => {
    if (!offerPrice) return;
    
    // محاكاة إرسال العرض
    setIsOfferModalOpen(false);
    setIsSuccess(true);
    
    // تحديث عدد العروض محلياً (للعرض فقط)
    setAllShipments(prev => prev.map(s => 
      s.id === selectedShipment?.id ? { ...s, offersCount: s.offersCount + 1 } : s
    ));

    setTimeout(() => {
      setIsSuccess(false);
      setSelectedShipment(null);
      setOfferPrice('');
      setNotes('');
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition bg-white shadow-sm">
          <ArrowRight size={24} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === UserRole.PASSENGER ? 'شحناتي' : 'طلبات الشحن المتاحة'}
        </h2>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-4 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="ابحث عن شحنة، مدينة، أو مسار..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition font-bold"
        />
      </div>

      <div className="space-y-4">
        {filteredShipments.length > 0 ? (
          filteredShipments.map((shipment) => (
            <div 
              key={shipment.id}
              onClick={() => navigate(`/shipment/${shipment.id}`)}
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-200 transition cursor-pointer active:scale-[0.98] group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {shipment.images && shipment.images[0] ? (
                      <img src={shipment.images[0]} className="w-full h-full object-cover rounded-2xl" alt="Shipment" />
                    ) : (
                      <Package size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800">{shipment.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mt-1">
                      <Clock size={12} />
                      <span>{shipment.date}</span>
                      <span className="text-blue-500">• {shipment.type}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">
                  {shipment.offersCount} عروض
                </div>
              </div>

              <div className="flex items-center gap-4 py-3 border-y border-gray-50 my-4">
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-blue-600">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">من</div>
                    <div className="text-sm font-black text-gray-800">{shipment.fromCity}</div>
                  </div>
                </div>
                <ChevronLeft className="text-gray-200" size={16} />
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-green-600">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">إلى</div>
                    <div className="text-sm font-black text-gray-800">{shipment.toCity}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1">
                    <Weight size={14} className="text-blue-500" />
                    {shipment.weight} كجم
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash size={14} className="text-blue-500" />
                    {shipment.trackingNumber}
                  </div>
                </div>
                
                {mode === UserRole.DRIVER && (
                  <button 
                    onClick={(e) => handleMakeOffer(e, shipment)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
                  >
                    تقديم عرض سعر
                  </button>
                )}
                
                {mode === UserRole.PASSENGER && (
                  <div className="flex items-center gap-1 text-blue-600 text-xs font-black">
                    التفاصيل <ChevronLeft size={16} />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <Package size={64} className="text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">لا يوجد شحنات متاحة حالياً</p>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {isOfferModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] shadow-2xl p-8 animate-in slide-in-from-bottom-20 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-800">تقديم عرض نقل</h3>
              <button onClick={() => setIsOfferModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Package size={24} />
                </div>
                <div>
                  <div className="font-black text-gray-800">{selectedShipment.title}</div>
                  <div className="text-xs text-blue-600 font-bold">{selectedShipment.fromCity} ← {selectedShipment.toCity}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">سعر النقل (ر.س)</label>
                <div className="relative">
                  <DollarSign className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="أدخل المبلغ المقترح"
                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black text-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">ملاحظات إضافية (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: موعد تحركي هو غداً الفجر، سأقوم بالتغليف الإضافي..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-28 resize-none outline-none font-bold"
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl text-[11px] font-bold text-amber-700 border border-amber-100">
                <AlertCircle size={18} className="shrink-0" />
                <p>يتم خصم عمولة بسيطة من المبلغ عند قبول العرض وإتمام العملية. تأكد من تحديد سعر منافس.</p>
              </div>

              <button 
                onClick={submitOffer}
                disabled={!offerPrice}
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50"
              >
                إرسال العرض الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-500">
          <CheckCircle2 size={24} />
          <span className="font-black">تم إرسال عرضك بنجاح!</span>
        </div>
      )}
    </div>
  );
};

export default ShipmentList;