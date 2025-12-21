
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shipment } from '../types';
import { 
  ArrowRight, 
  Package, 
  MapPin, 
  Weight, 
  Calendar, 
  Sparkles, 
  Camera, 
  X, 
  ChevronLeft,
  User as UserIcon,
  Phone,
  Printer,
  CheckCircle2,
  Barcode,
  Truck,
  MapPinned,
  Hash,
  ArrowLeft,
  Info,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { SHIPMENT_TYPES, COUNTRIES, CITIES } from '../constants';
import { generateShipmentDescription } from '../services/geminiService';

interface CreateShipmentProps {
  user: User;
}

const CreateShipment: React.FC<CreateShipmentProps> = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [finalShipment, setFinalShipment] = useState<Shipment | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: SHIPMENT_TYPES[0],
    weight: 1,
    quantity: 1,
    fromCountry: COUNTRIES[1], // Default Yemen
    fromCity: '',
    toCountry: COUNTRIES[0], // Default KSA
    toCity: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 3 - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      
      filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateAI = async () => {
    if (!formData.title) return;
    setLoadingAI(true);
    const desc = await generateShipmentDescription(
      formData.title, 
      formData.weight, 
      formData.type, 
      formData.quantity
    );
    setFormData({...formData, description: desc});
    setLoadingAI(false);
  };

  const generateTrackingNumber = () => {
    const prefix = "RFQ";
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${year}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingNo = generateTrackingNumber();
    const newShipment: Shipment = {
      ...formData,
      id: 's' + Date.now(),
      userId: user.id,
      trackingNumber: trackingNo,
      images,
      status: 'PENDING',
      offersCount: 0
    };
    
    const savedShipments = JSON.parse(localStorage.getItem('rafiq_shipments') || '[]');
    localStorage.setItem('rafiq_shipments', JSON.stringify([newShipment, ...savedShipments]));
    
    setFinalShipment(newShipment);
    setStep(5);
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 text-blue-600 font-black">
                <Package size={24} />
                <h3>بيانات الطرد</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2">عنوان الشحنة</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="مثال: كرتون أواني منزلية"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2">النوع</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                    >
                      {SHIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2">الوزن التقريبي (كجم)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value) || 1})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2">الصور (بحد أقصى 3)</label>
                  <div className="flex gap-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)} className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                      </div>
                    ))}
                    {images.length < 3 && (
                      <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 transition">
                        <Camera size={24} />
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={nextStep} disabled={!formData.title} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl disabled:opacity-50 active:scale-95 transition">التالي: المسار</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 text-blue-600 font-black">
                <MapPin size={24} />
                <h3>مسار الشحن</h3>
              </div>
              
              <div className="space-y-6">
                {/* From Section */}
                <div className="p-4 bg-blue-50/50 rounded-3xl border border-blue-100">
                  <span className="text-[10px] font-black text-blue-600 uppercase mb-2 block">من (المصدر)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={formData.fromCountry}
                      onChange={(e) => setFormData({...formData, fromCountry: e.target.value, fromCity: ''})}
                      className="p-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={formData.fromCity}
                      onChange={(e) => setFormData({...formData, fromCity: e.target.value})}
                      className="p-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none"
                    >
                      <option value="">اختر المدينة</option>
                      {CITIES[formData.fromCountry]?.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                  <div className="bg-white p-2 rounded-full shadow-md text-blue-600 border border-gray-100">
                    <Truck size={20} />
                  </div>
                </div>

                {/* To Section */}
                <div className="p-4 bg-green-50/50 rounded-3xl border border-green-100">
                  <span className="text-[10px] font-black text-green-600 uppercase mb-2 block">إلى (الوجهة)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={formData.toCountry}
                      onChange={(e) => setFormData({...formData, toCountry: e.target.value, toCity: ''})}
                      className="p-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={formData.toCity}
                      onChange={(e) => setFormData({...formData, toCity: e.target.value})}
                      className="p-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none"
                    >
                      <option value="">اختر المدينة</option>
                      {CITIES[formData.toCountry]?.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="bg-gray-100 text-gray-500 p-5 rounded-[2rem] font-black"><ArrowRight /></button>
              <button onClick={nextStep} disabled={!formData.fromCity || !formData.toCity} className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl disabled:opacity-50">التالي: المستلم</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 text-blue-600 font-black">
                <UserIcon size={24} />
                <h3>بيانات المستلم</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2">اسم المستلم الرباعي</label>
                  <div className="relative">
                    <UserIcon className="absolute right-4 top-4 text-gray-300" size={18} />
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                      placeholder="أدخل الاسم الكامل"
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2">رقم جوال المستلم</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-4 text-gray-300" size={18} />
                    <input
                      type="tel"
                      value={formData.recipientPhone}
                      onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                      placeholder="+966xxxxxxxxx"
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2">عنوان التسليم التفصيلي</label>
                  <div className="relative">
                    <MapPinned className="absolute right-4 top-4 text-gray-300" size={18} />
                    <textarea
                      value={formData.recipientAddress}
                      onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
                      placeholder="الحي، الشارع، المعلم القريب..."
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="bg-gray-100 text-gray-500 p-5 rounded-[2rem] font-black"><ArrowRight /></button>
              <button onClick={nextStep} disabled={!formData.recipientName || !formData.recipientPhone || !formData.recipientAddress} className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl">التالي: المراجعة</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-800">مراجعة الطلب</h3>
                <button 
                  onClick={handleGenerateAI}
                  disabled={loadingAI}
                  className="flex items-center gap-2 text-xs font-black text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100 transition disabled:opacity-50"
                >
                  {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  تحسين الوصف بالذكاء الاصطناعي
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-3xl">
                  {images[0] ? (
                    <img src={images[0]} className="w-20 h-20 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300"><ImageIcon /></div>
                  )}
                  <div>
                    <h4 className="font-black text-gray-800">{formData.title}</h4>
                    <p className="text-xs text-gray-400 font-bold">{formData.type} • {formData.weight} كجم</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-blue-600">
                      <MapPin size={10} />
                      {formData.fromCity} ← {formData.toCity}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500">وصف الشحنة للسائقين</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold h-32 resize-none"
                    placeholder="اكتب وصفاً ليراه السائقون..."
                  />
                </div>

                <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-3">
                  <Info className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                    سيتم نشر طلبك وتلقي عروض الأسعار من السائقين المتجهين إلى وجهتك. يمكنك قبول العرض الأنسب لك بعد مراجعة تقييم السائق.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="bg-gray-100 text-gray-500 p-5 rounded-[2rem] font-black"><ArrowRight /></button>
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl active:scale-95 transition">تأكيد ونشر الطلب</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            {/* Success Animation Area */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100 animate-bounce">
                <CheckCircle2 size={56} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">تم النشر بنجاح!</h2>
              <p className="text-gray-500 font-bold">طلبك الآن متاح لجميع السائقين المعتمدين.</p>
              
              {/* Shipment Card for Printing */}
              <div id="shipment-label" className="mt-10 w-full p-8 border-2 border-black rounded-[2rem] bg-white text-right font-bold print:m-0 print:border-none">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-black text-blue-600 print:text-black">رَفيق - RAFIQ</h1>
                  <Barcode size={48} className="print:w-24 h-auto" />
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">رقم التتبع</span>
                    <span className="text-xl font-black">{finalShipment?.trackingNumber}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">التاريخ</span>
                    <span className="text-xl font-black">{finalShipment?.date}</span>
                  </div>
                </div>

                <div className="border-y-2 border-gray-100 py-6 my-6 grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Truck size={18} />
                      <span className="text-xs uppercase">المصدر</span>
                    </div>
                    <div className="text-lg">{finalShipment?.fromCity}، {finalShipment?.fromCountry}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <MapPin size={18} />
                      <span className="text-xs uppercase">الوجهة</span>
                    </div>
                    <div className="text-lg">{finalShipment?.toCity}، {finalShipment?.toCountry}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">المستلم:</span>
                    <span className="text-lg">{finalShipment?.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">العنوان:</span>
                    <span className="text-sm text-left max-w-[200px]">{finalShipment?.recipientAddress}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center opacity-30">
                  <Hash size={40} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-10 no-print">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition"
                >
                  <Printer size={20} />
                  طباعة البوليصة
                </button>
                <button 
                  onClick={() => navigate('/shipments')}
                  className="flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition"
                >
                  <Package size={20} />
                  عرض شحناتي
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/')} 
              className="w-full text-gray-400 font-bold py-4 no-print"
            >
              العودة للرئيسية
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #shipment-label, #shipment-label * { visibility: visible; }
          #shipment-label { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {step < 5 && (
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white shadow-sm rounded-2xl text-gray-400 hover:text-gray-800 transition">
            <ArrowRight size={24} />
          </button>
          <div className="flex-1 flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600 shadow-sm shadow-blue-100' : 'bg-gray-100'}`}
              ></div>
            ))}
          </div>
          <span className="text-[10px] font-black text-gray-400">{step} / 4</span>
        </div>
      )}

      {renderStepContent()}
    </div>
  );
};

export default CreateShipment;
