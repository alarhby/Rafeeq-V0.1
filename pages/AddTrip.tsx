
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Plus,
  Minus,
  MessageCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { COUNTRIES, CITIES } from '../constants';
import { createTrip } from '../services/database';

interface AddTripProps {
  user: User;
}

const AddTrip: React.FC<AddTripProps> = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    fromCountry: COUNTRIES[0],
    fromCity: '',
    toCountry: COUNTRIES[1],
    toCity: '',
    date: '',
    time: '08:00',
    seats: 4,
    price: 150,
    notes: ''
  });

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const [createdTripId, setCreatedTripId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // إرسال البيانات إلى Firebase
      const result = await createTrip({
        ...formData,
        driverId: user.id,
        driverName: user.name,
        currency: 'SAR', // افتراضي
        status: 'ACTIVE'
      });

      setCreatedTripId(result.id);
      setStep(8); // شاشة النجاح
    } catch (error: any) {
      console.error("Failed to save trip:", error);
      alert(`حدث خطأ: ${error.message || "فشل حفظ الرحلة"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">من أين ستنطلق؟</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">الدولة</label>
                <div className="flex gap-2">
                  {COUNTRIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, fromCountry: c, fromCity: '' })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition ${formData.fromCountry === c ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 bg-white text-gray-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">المدينة</label>
                <select
                  className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-600 transition font-bold"
                  value={formData.fromCity}
                  onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                >
                  <option value="">اختر مدينة الانطلاق</option>
                  {CITIES[formData.fromCountry].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button
              disabled={!formData.fromCity}
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50"
            >
              استمرار
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">إلى أين تريد الذهاب؟</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">الدولة</label>
                <div className="flex gap-2">
                  {COUNTRIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, toCountry: c, toCity: '' })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition ${formData.toCountry === c ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 bg-white text-gray-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">المدينة</label>
                <select
                  className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-600 transition font-bold"
                  value={formData.toCity}
                  onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                >
                  <option value="">اختر مدينة الوصول</option>
                  {CITIES[formData.toCountry].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button
              disabled={!formData.toCity}
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50"
            >
              استمرار
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">متى ستسافر؟</h2>
            <div className="space-y-4">
              <div className="relative">
                <Calendar className="absolute right-4 top-4 text-gray-400" size={24} />
                <input
                  type="date"
                  className="w-full pr-14 pl-4 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-600 transition font-bold"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="relative">
                <Clock className="absolute right-4 top-4 text-gray-400" size={24} />
                <input
                  type="time"
                  className="w-full pr-14 pl-4 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-600 transition font-bold"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <button
              disabled={!formData.date}
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50"
            >
              استمرار
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">كم عدد الركاب؟</h2>
            <div className="flex items-center justify-between p-8 bg-white border-2 border-gray-100 rounded-3xl shadow-sm">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, seats: Math.max(1, formData.seats - 1) })}
                className="w-16 h-16 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition active:scale-90"
              >
                <Minus size={24} />
              </button>
              <span className="text-5xl font-black text-gray-800">{formData.seats}</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, seats: Math.min(8, formData.seats + 1) })}
                className="w-16 h-16 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition active:scale-90"
              >
                <Plus size={24} />
              </button>
            </div>
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
            >
              استمرار
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">حدد سعر المقعد الواحد</h2>
            <div className="relative">
              <div className="absolute right-4 top-4 text-3xl font-black text-gray-300">ر.س</div>
              <input
                type="number"
                className="w-full pr-20 pl-4 py-8 bg-white border-2 border-gray-100 rounded-3xl text-4xl font-black text-center outline-none focus:border-blue-600 transition shadow-sm"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              />
            </div>
            <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold shadow-sm">✓</div>
              <p className="text-sm text-green-800 font-bold">سعر رائع! ستجد ركاباً بسرعة بهذا السعر المقترح.</p>
            </div>
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
            >
              استمرار
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">هل تريد إضافة تفاصيل أخرى؟</h2>
            <div className="relative">
              <MessageCircle className="absolute right-4 top-4 text-gray-400" size={24} />
              <textarea
                className="w-full pr-14 pl-4 py-4 bg-white border-2 border-gray-100 rounded-2xl h-48 outline-none focus:border-blue-600 transition resize-none font-bold"
                placeholder="مثال: التدخين ممنوع، يوجد مكان للحقائب الكبيرة، التوقف متاح للصلاة..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
            >
              استمرار
            </button>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <h2 className="text-2xl font-bold text-gray-800">راجع رحلتك قبل النشر</h2>
            <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-sm"></div>
                    <div className="w-0.5 h-8 bg-gray-100"></div>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 bg-white shadow-sm"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-black text-gray-800">{formData.fromCity}</div>
                    <div className="text-lg font-black text-gray-800 mt-4">{formData.toCity}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-4 text-sm text-gray-500 font-bold">
                  <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Calendar size={14} /> {formData.date}</span>
                  <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Clock size={14} /> {formData.time}</span>
                  <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Users size={14} /> {formData.seats} مقاعد</span>
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-black"><DollarSign size={14} /> {formData.price} ر.س</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-[2rem] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
              نشر الرحلة الآن
            </button>
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">تم النشر بنجاح!</h2>
            <p className="text-gray-500 text-center font-bold px-4 mb-8">
              رحلتك الآن متاحة لآلاف المسافرين.
              {createdTripId && <span className="block mt-2 text-xs text-gray-400">رقم الرحلة: {createdTripId}</span>}
            </p>

            <div className="flex flex-col w-full gap-3 px-6">
              <button
                onClick={() => navigate(`/trip/${createdTripId}`)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                عرض تفاصيل الرحلة
              </button>
              <button
                onClick={() => navigate('/my-trips')}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-black"
              >
                العودة لرحلاتي
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto min-h-[80vh] flex flex-col pb-20">
      {/* Header */}
      {step < 8 && (
        <div className="flex items-center gap-4 mb-8">
          <button onClick={prevStep} className="p-2 hover:bg-white hover:shadow-md rounded-full transition bg-gray-50/50">
            <ArrowRight size={24} className="text-gray-800" />
          </button>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-black text-gray-400">{step} / {totalSteps}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {renderStep()}
      </div>
    </div>
  );
};

export default AddTrip;
