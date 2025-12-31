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
  X,
  CheckCircle2,
  Truck,
  Loader2,
  AlertCircle,
  Plus,
  Ruler,
  Info,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { SHIPMENT_TYPES, COUNTRIES, CITIES } from '../constants';
import { generateShipmentDescription } from '../services/geminiService';
import { createShipment, uploadImage } from '../services/database';

interface CreateShipmentProps {
  user: User;
}

interface ImageUpload {
  id: string;
  url: string;
  isUploading: boolean;
  name: string;
}

const CreateShipment: React.FC<CreateShipmentProps> = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: SHIPMENT_TYPES[0],
    weight: 1,
    quantity: 1,
    fromCountry: COUNTRIES[1], // الافتراضي اليمن
    fromCity: '',
    senderAddress: '',
    toCountry: COUNTRIES[0], // الافتراضي السعودية
    toCity: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    length: '',
    width: '',
    height: ''
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUploads: ImageUpload[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = Math.random().toString(36).substr(2, 9);
      try {
        const compressedBase64 = await compressImage(file);
        newUploads.push({ id, url: compressedBase64, isUploading: false, name: file.name });
      } catch (err) {
        console.error(err);
      }
    }
    setImageUploads(prev => [...prev, ...newUploads]);
  };

  const removeImage = (id: string) => {
    setImageUploads(prev => prev.filter(img => img.id !== id));
  };

  const generateDescription = async () => {
    if (!formData.title) return;
    setLoadingAI(true);
    try {
      const desc = await generateShipmentDescription(
        formData.title,
        formData.weight,
        formData.type,
        formData.quantity
      );
      setFormData({ ...formData, description: desc });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const [createdShipmentId, setCreatedShipmentId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newTrackingNumber = 'RF-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setTrackingNumber(newTrackingNumber);

      const dimensions = (formData.length && formData.width && formData.height) ? {
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height)
      } : undefined;

      const shipmentData = {
        title: formData.title,
        type: formData.type,
        weight: Number(formData.weight),
        quantity: Number(formData.quantity),
        fromCountry: formData.fromCountry,
        fromCity: formData.fromCity,
        senderAddress: formData.senderAddress,
        toCountry: formData.toCountry,
        toCity: formData.toCity,
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        recipientAddress: formData.recipientAddress,
        date: formData.date,
        description: formData.description,
        dimensions,
        userId: user.id,
        trackingNumber: newTrackingNumber,
        images: [] as string[],
      };

      // 1. رفع الصور إلى Firebase Storage
      const uploadedImageUrls = [];
      for (const img of imageUploads) {
        if (img.url.startsWith('data:')) {
          const blob = await (await fetch(img.url)).blob();
          const fileName = `shipments/${user.id}/${Date.now()}-${img.id}.jpg`;
          const downloadUrl = await uploadImage(fileName, blob);
          uploadedImageUrls.push(downloadUrl);
        } else {
          uploadedImageUrls.push(img.url);
        }
      }
      shipmentData.images = uploadedImageUrls;

      const result = await createShipment(shipmentData);
      setCreatedShipmentId(result.id);
      setStep(6); // Success screen
    } catch (err: any) {
      console.error(err);
      setError(`حدث خطأ: ${err.message || "فشل حفظ الشحنة"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-black text-gray-800">بيانات الشحنة الأساسية</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">ماذا تريد أن تشحن؟</label>
                <input
                  type="text"
                  placeholder="مثال: طرد ملابس، أوراق رسمية، قطع غيار"
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">نوع الشحنة</label>
                  <select
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {SHIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">الوزن التقريبي (كجم)</label>
                  <div className="relative">
                    <Weight className="absolute right-4 top-4 text-gray-300" size={18} />
                    <input
                      type="number"
                      className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">الكمية / العدد</label>
                <input
                  type="number"
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
            </div>
            <button
              disabled={!formData.title}
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              التالي: تفاصيل الموقع
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-black text-gray-800">بيانات الإرسال والاستلام</h2>

            <div className="space-y-6">
              {/* المصدر */}
              <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-black text-sm mb-2">
                  <MapPin size={18} />
                  بيانات المرسل (المصدر)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                    value={formData.fromCountry}
                    onChange={(e) => setFormData({ ...formData, fromCountry: e.target.value, fromCity: '' })}
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                    value={formData.fromCity}
                    onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                  >
                    <option value="">اختر مدينة</option>
                    {CITIES[formData.fromCountry].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="عنوان المرسل بالتفصيل (مثال: حي الروضة، شارع العام)"
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.senderAddress}
                  onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                />
              </div>

              {/* الوجهة */}
              <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 space-y-4">
                <div className="flex items-center gap-2 text-green-600 font-black text-sm mb-2">
                  <Truck size={18} />
                  بيانات المستلم (الوجهة)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                    value={formData.toCountry}
                    onChange={(e) => setFormData({ ...formData, toCountry: e.target.value, toCity: '' })}
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                    value={formData.toCity}
                    onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                  >
                    <option value="">اختر مدينة</option>
                    {CITIES[formData.toCountry].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="اسم المستلم"
                    className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs outline-none"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="رقم جوال المستلم"
                    className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs outline-none"
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  placeholder="عنوان المستلم بالتفصيل"
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs outline-none"
                  value={formData.recipientAddress}
                  onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">رجوع</button>
              <button
                disabled={!formData.fromCity || !formData.toCity || !formData.senderAddress}
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg"
              >
                التالي: الأبعاد والموعد
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-black text-gray-800">الأبعاد والموعد</h2>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 space-y-6">
              <div className="flex items-center gap-2 text-gray-800 font-black text-sm">
                <Ruler size={18} className="text-blue-600" />
                أبعاد الشحنة (اختياري - سم)
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1">الطول</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none text-center"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1">العرض</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none text-center"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1">الارتفاع</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none text-center"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-black text-sm">
                <Calendar size={18} className="text-blue-600" />
                تاريخ الجاهزية للشحن
              </div>
              <input
                type="date"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">رجوع</button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg"
              >
                التالي: الصور والوصف
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-black text-gray-800">الصور والوصف</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {imageUploads.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm">
                    <img src={img.url} className="w-full h-full object-cover" alt="Shipment" />
                    <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X size={14} /></button>
                  </div>
                ))}
                {imageUploads.length < 5 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition"
                  >
                    <Plus size={24} />
                    <span className="text-[10px] font-bold mt-1">إضافة صور</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" />
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-gray-800">وصف الشحنة</label>
                  <button
                    onClick={generateDescription}
                    disabled={loadingAI}
                    className="text-[10px] font-black text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                  >
                    {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    وصف ذكي (Gemini AI)
                  </button>
                </div>
                <textarea
                  placeholder="اكتب وصفاً تفصيلياً أو استخدم الذكاء الاصطناعي..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 resize-none outline-none font-bold"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black">رجوع</button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg"
              >
                مراجعة الطلب
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-black text-gray-800">مراجعة وتأكيد البيانات</h2>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-800">{formData.title}</h3>
                    <p className="text-xs text-gray-400 font-bold">{formData.type} • {formData.weight} كجم</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><MapPin size={16} /></div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-black">المصدر</div>
                      <div className="text-sm font-black text-gray-800">{formData.fromCity}</div>
                      <div className="text-[10px] text-gray-500 font-bold mt-0.5">{formData.senderAddress}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0"><Truck size={16} /></div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-black">الوجهة</div>
                      <div className="text-sm font-black text-gray-800">{formData.toCity}</div>
                      <div className="text-[10px] text-gray-500 font-bold mt-0.5">{formData.recipientAddress}</div>
                    </div>
                  </div>
                </div>

                {(formData.length || formData.width || formData.height) && (
                  <div className="p-4 bg-gray-50 rounded-2xl flex justify-around text-center border border-gray-100">
                    <div>
                      <div className="text-[9px] text-gray-400 font-black">الطول</div>
                      <div className="text-sm font-black text-gray-700">{formData.length || '0'} سم</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-400 font-black">العرض</div>
                      <div className="text-sm font-black text-gray-700">{formData.width || '0'} سم</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-400 font-black">الارتفاع</div>
                      <div className="text-sm font-black text-gray-700">{formData.height || '0'} سم</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-bold border border-red-100">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
              تأكيد ونشر الطلب
            </button>
            <button onClick={() => setStep(4)} className="w-full py-4 text-gray-400 font-bold text-sm">رجوع للتعديل</button>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">تم النشر بنجاح!</h2>
            <div className="bg-blue-50 px-6 py-4 rounded-2xl mb-6 text-center border border-blue-100">
              <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">رقم التتبع</span>
              <span className="text-2xl font-black text-blue-700">{trackingNumber}</span>
            </div>
            <p className="text-gray-500 text-center font-bold px-4 mb-10 leading-relaxed">سيقوم السائقون بتقديم عروض أسعار لنقل شحنتك قريباً. سيصلك إشعار عند كل عرض جديد.</p>

            <div className="flex flex-col w-full gap-3 px-6">
              <button
                onClick={() => navigate(`/shipment/${createdShipmentId}`)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                عرض تفاصيل الشحنة
              </button>
              <button
                onClick={() => navigate('/shipments')}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-black"
              >
                العودة لشحناتي
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-24">
      {step < 6 && (
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2.5 bg-white shadow-sm rounded-2xl text-gray-800 hover:bg-gray-50 transition">
            <ArrowRight size={22} />
          </button>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300 shadow-sm" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>
          <span className="text-[10px] font-black text-gray-400">الخطوة {step}</span>
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default CreateShipment;