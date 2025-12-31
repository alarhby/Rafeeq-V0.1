import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Shipment, UserRole } from '../types';
import { 
  ArrowRight, Package, MapPin, Star, MessageCircle, Truck, Box, TrendingDown, 
  DollarSign, Plus, Minus, Loader2, Weight, Hash, Calendar, ChevronLeft, 
  CheckCircle2, X, Gavel, Trophy, Users, BarChart3, ShieldCheck, Tag
} from 'lucide-react';
import { 
  subscribeToShipmentOffers, upsertOffer, acceptOffer, rejectOffer, 
  subscribeToShipmentDetails, getDriverOfferForShipment 
} from '../services/database';

interface ShipmentDetailsProps {
  user: User;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidNotes, setBidNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [myExistingOffer, setMyExistingOffer] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const unsubShipment = subscribeToShipmentDetails(id, (data) => {
      setShipment(data);
      setLoading(false);
    });

    const unsubOffers = subscribeToShipmentOffers(id, (fetchedOffers) => {
      setOffers(fetchedOffers);
    });

    const fetchMyOffer = async () => {
      if (user.role === UserRole.DRIVER) {
        const offer = await getDriverOfferForShipment(user.id, id);
        if (offer) {
          setMyExistingOffer(offer);
          setBidPrice(offer.price);
          setBidNotes(offer.notes || '');
        }
      }
    };
    fetchMyOffer();

    return () => {
      unsubShipment();
      unsubOffers();
    };
  }, [id, user.id, user.role]);

  const isOwner = shipment && String(shipment.userId) === String(user.id);
  const isAccepted = shipment?.status === 'ACCEPTED';
  
  // حساب إحصائيات المزايدة (أقل سعر هو الأفضل في خدمات النقل)
  const lowestBid = offers.length > 0 ? Math.min(...offers.map(o => o.price)) : 0;
  const avgBid = offers.length > 0 ? Math.round(offers.reduce((acc, o) => acc + o.price, 0) / offers.length) : 0;

  // تعيين سعر مبدئي للمزايدة للسائق
  useEffect(() => {
    if (!myExistingOffer && lowestBid > 0) {
      setBidPrice(lowestBid - 5);
    } else if (!myExistingOffer && shipment) {
      setBidPrice(shipment.weight * 20); // سعر تقديري أولي
    }
  }, [lowestBid, shipment, myExistingOffer]);

  const handleAcceptOffer = async (offerId: string) => {
    if (!id || isActionLoading) return;
    if (window.confirm('هل تود قبول هذا العرض؟ سيتم تزويدك ببيانات التواصل مع السائق فوراً.')) {
      setIsActionLoading(offerId);
      try {
        await acceptOffer(id, offerId);
      } catch (err) {
        alert('حدث خطأ أثناء قبول العرض.');
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!id || isActionLoading) return;
    setIsActionLoading(offerId);
    try {
      await rejectOffer(offerId);
    } catch (err) {
      alert('حدث خطأ أثناء رفض العرض.');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleSubmitBid = async () => {
    if (!id || bidPrice <= 0) return;
    setIsSubmittingBid(true);
    try {
      await upsertOffer({
        shipmentId: id,
        driverId: user.id,
        driverName: user.name,
        price: bidPrice,
        notes: bidNotes,
        currency: 'SAR',
        status: 'PENDING'
      });
      setMyExistingOffer({ price: bidPrice, notes: bidNotes });
    } catch (err) {
      alert('حدث خطأ أثناء تقديم المزايدة.');
    } finally {
      setIsSubmittingBid(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
      <p className="font-bold text-gray-500">جاري تحميل لوحة المزايدة...</p>
    </div>
  );

  if (!shipment) return <div className="text-center py-20 text-gray-500 font-bold">الشحنة غير متوفرة حالياً</div>;

  return (
    <div className="max-w-4xl mx-auto pb-32 -mt-6 animate-in fade-in duration-700">
      {/* قسم عرض صور الشحنة */}
      <div className="relative h-72 md:h-[400px] w-full overflow-hidden bg-slate-900 rounded-b-[3.5rem] shadow-2xl">
        {shipment.images && shipment.images.length > 0 ? (
          <img src={shipment.images[activeImage]} className="w-full h-full object-cover opacity-80" alt="Shipment" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-800">
            <Box size={64} className="text-slate-600 mb-2" />
            <span className="font-bold opacity-50 text-sm">لا توجد صور متوفرة</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 right-6 p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition"
        >
          <ArrowRight size={24} />
        </button>

        {!isAccepted && (
          <div className="absolute top-8 left-6 bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black flex items-center gap-2 shadow-xl animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            مزايدة حية نشطة
          </div>
        )}
      </div>

      <div className="px-4 -mt-12 relative z-30 space-y-6">
        {/* ملخص الشحنة وإحصائيات المزايدة */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                <Package size={14} /> 
                <span>{shipment.type}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{shipment.title}</h1>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Hash size={12} /> {shipment.trackingNumber}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {shipment.date}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-center shadow-lg border-2 border-blue-500/20">
                <div className="text-[8px] font-black opacity-60 uppercase tracking-widest mb-1">أفضل سعر معروض (الأقل)</div>
                <div className="text-2xl font-black text-blue-400 leading-none">
                  {lowestBid > 0 ? lowestBid : '---'} <span className="text-xs">ر.س</span>
                </div>
              </div>
            </div>
          </div>

          {/* لوحة إحصائيات المنافسة */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex flex-col items-center">
              <Users size={18} className="text-blue-600 mb-1" />
              <div className="text-[9px] font-black text-blue-800/50 uppercase">المزايدين</div>
              <div className="text-lg font-black text-blue-900">{offers.length}</div>
            </div>
            <div className="bg-green-50/50 p-4 rounded-3xl border border-green-100 flex flex-col items-center">
              <Trophy size={18} className="text-green-600 mb-1" />
              <div className="text-[9px] font-black text-green-800/50 uppercase">أفضل وفر</div>
              <div className="text-lg font-black text-green-900">{lowestBid || '--'}</div>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100 flex flex-col items-center">
              <BarChart3 size={18} className="text-purple-600 mb-1" />
              <div className="text-[9px] font-black text-purple-800/50 uppercase">متوسط العروض</div>
              <div className="text-lg font-black text-purple-900">{avgBid || '--'}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600"><MapPin size={20}/></div>
                <div>
                   <div className="text-[9px] text-gray-400 font-black uppercase">المسار</div>
                   <div className="text-sm font-black text-slate-800">{shipment.fromCity} ← {shipment.toCity}</div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600"><Weight size={20}/></div>
                <div>
                   <div className="text-[9px] text-gray-400 font-black uppercase">الوزن</div>
                   <div className="text-sm font-black text-slate-800">{shipment.weight} كجم</div>
                </div>
             </div>
          </div>
        </div>

        {/* قسم المزايدة للسائقين */}
        {!isOwner && user.role === UserRole.DRIVER && !isAccepted && (
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                    <Gavel size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{myExistingOffer ? 'تحديث عرضك' : 'دخول المزايدة'}</h3>
                    <p className="text-[10px] font-bold text-slate-400">قدم أفضل سعر لرفع فرص قبولك</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 space-y-8">
                {myExistingOffer && (
                  <div className={`p-4 rounded-2xl flex items-center justify-between font-black text-xs border ${
                    myExistingOffer.price <= lowestBid ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  }`}>
                    <div className="flex items-center gap-2">
                      <TrendingDown size={14} />
                      {myExistingOffer.price <= lowestBid ? 'عرضك هو الأقل حالياً! حافظ على الصدارة.' : 'هناك من قدم سعراً أقل منك!'}
                    </div>
                    <span>{myExistingOffer.price} ر.س</span>
                  </div>
                )}

                <div className="flex items-center justify-between bg-black/40 p-6 rounded-3xl border border-white/5">
                  <button onClick={() => setBidPrice(Math.max(10, bidPrice - 10))} className="w-12 h-12 bg-white rounded-2xl text-slate-900 flex items-center justify-center active:scale-90 transition shadow-lg"><Minus size={24} /></button>
                  <div className="text-center">
                    <div className="text-5xl font-black tracking-tighter tabular-nums">{bidPrice}</div>
                    <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mt-1">ريال سعودي</div>
                  </div>
                  <button onClick={() => setBidPrice(bidPrice + 10)} className="w-12 h-12 bg-white rounded-2xl text-slate-900 flex items-center justify-center active:scale-90 transition shadow-lg"><Plus size={24} /></button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setBidPrice(Math.max(1, lowestBid > 0 ? lowestBid - 5 : bidPrice - 10))}
                     className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-white/10 transition"
                   >
                     نافس بأقل عرض (-5 ر.س)
                   </button>
                   <button 
                     onClick={() => setBidPrice(Math.round(avgBid > 0 ? avgBid * 0.9 : bidPrice))}
                     className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-white/10 transition"
                   >
                     السعر التنافسي الموصى به
                   </button>
                </div>

                <textarea 
                  value={bidNotes} 
                  onChange={(e) => setBidNotes(e.target.value)} 
                  placeholder="أضف ملاحظاتك للعميل (موعد الانطلاق، نوع التأمين، إلخ)..." 
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-sm font-medium outline-none focus:bg-white/10 transition min-h-[120px] placeholder:text-white/20"
                />

                <button 
                  onClick={handleSubmitBid} 
                  disabled={isSubmittingBid} 
                  className="w-full bg-blue-600 text-white py-6 rounded-[2.2rem] font-black text-xl shadow-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingBid ? <Loader2 size={24} className="animate-spin" /> : (myExistingOffer ? 'تحديث المزايدة' : 'تأكيد تقديم السعر')}
                </button>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* عرض ومقارنة العروض (للمالك والسائقين) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <BarChart3 size={24} className="text-blue-600" /> 
              لوحة مقارنة المزايدات
            </h3>
            {isAccepted && <span className="bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">تم التعميد بنجاح</span>}
          </div>

          <div className="space-y-4">
            {offers.length > 0 ? offers.map((offer, idx) => (
              <div 
                key={offer.id} 
                className={`bg-white p-7 rounded-[2.5rem] shadow-sm border transition-all duration-500 relative group hover:shadow-xl ${
                  offer.status === 'ACCEPTED' ? 'border-green-500 ring-4 ring-green-500/10' : 'border-slate-100'
                } ${offer.price === lowestBid && !isAccepted ? 'bg-blue-50/20 border-blue-200' : ''}`}
              >
                {/* أوسمة العروض المميزة */}
                {offer.price === lowestBid && !isAccepted && (
                   <div className="absolute top-0 left-0 bg-blue-600 text-white px-5 py-2 rounded-br-2xl text-[9px] font-black flex items-center gap-1.5 shadow-lg z-10">
                     <Tag size={12} /> العرض الأفضل حالياً
                   </div>
                )}
                {offer.status === 'ACCEPTED' && (
                   <div className="absolute top-0 left-0 bg-green-500 text-white px-5 py-2 rounded-br-2xl text-[9px] font-black flex items-center gap-1.5 shadow-lg z-10">
                     <CheckCircle2 size={12} /> العرض الفائز
                   </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                      <img src={`https://i.pravatar.cc/150?u=${offer.driverId}`} alt="Driver" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 flex items-center gap-2">
                        {offer.driverName}
                        {offer.status === 'ACCEPTED' && <ShieldCheck size={16} className="text-blue-600" />}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-black">
                          <Star size={12} fill="currentColor" /> <span>4.9</span>
                        </div>
                        <span className="text-slate-300 text-[8px] font-black uppercase tracking-widest">• عضو موثق</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المبلغ المعروض</div>
                    <div className="text-3xl font-black text-blue-600 tracking-tight leading-none">
                      {offer.price} <span className="text-xs text-slate-400">ر.س</span>
                    </div>
                  </div>
                </div>

                {offer.notes && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-xs text-slate-600">
                    "{offer.notes}"
                  </div>
                )}

                {/* شريط ذكاء المزايدة (يوضح مدى توفير العرض مقارنة بالمتوسط) */}
                {!isAccepted && (
                   <div className="mb-6 space-y-1.5">
                      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                         <span>قوة العرض</span>
                         <span>{Math.round(((avgBid - offer.price) / (avgBid || 1)) * 100)}% توفير إضافي</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${offer.price <= lowestBid ? 'bg-green-500' : 'bg-blue-400'}`} 
                           style={{ width: `${Math.min(100, (avgBid / (offer.price || 1)) * 50)}%` }}
                         ></div>
                      </div>
                   </div>
                )}

                <div className="flex gap-3">
                  {isOwner && !isAccepted && (
                    <>
                      <button 
                        disabled={!!isActionLoading}
                        onClick={() => handleAcceptOffer(offer.id)} 
                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isActionLoading === offer.id ? <Loader2 className="animate-spin" size={18} /> : (
                          <>
                            <CheckCircle2 size={18} />
                            قبول وتعاقد
                          </>
                        )}
                      </button>
                      <button 
                        disabled={!!isActionLoading}
                        onClick={() => handleRejectOffer(offer.id)} 
                        className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition disabled:opacity-50"
                      >
                        {isActionLoading === offer.id ? <Loader2 className="animate-spin" size={18} /> : <X size={20} />}
                      </button>
                    </>
                  )}
                  
                  {(offer.status === 'ACCEPTED' || offer.driverId === user.id) && (
                    <button 
                      onClick={() => alert('ميزة التواصل المباشر قيد التفعيل.')}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-xl"
                    >
                      <MessageCircle size={20} /> تواصل الآن
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 text-slate-300 font-bold">
                <Box size={48} className="mx-auto mb-4 opacity-10" />
                <p className="text-sm">لا توجد مزايدات حالياً، سيصلك إشعار فور تقديم السائقين لعروضهم.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;