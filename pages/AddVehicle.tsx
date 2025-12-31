
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Vehicle } from '../types';
import { ArrowRight, Camera, Upload, CheckCircle2 as CheckCircle, ShieldCheck, AlertCircle, FileCheck, Info, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, createVehicle } from '../services/database';
import { VehicleStatus } from '../types';

interface AddVehicleProps {
  user: User;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editVehicle = location.state?.vehicle as Vehicle | undefined;

  const [step, setStep] = useState(editVehicle ? 2 : 1);
  const [formData, setFormData] = useState({
    make: editVehicle?.make || '',
    model: editVehicle?.model || '',
    year: editVehicle?.year || '',
    plateNumber: editVehicle?.plateNumber || '',
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedUrls, setUploadedUrls] = useState({
    front: editVehicle?.photos?.front || '',
    back: editVehicle?.photos?.back || '',
    side: editVehicle?.photos?.side || '',
    license: editVehicle?.documents?.license || '',
    registration: editVehicle?.documents?.registration || '',
    idCard: editVehicle?.documents?.idCard || ''
  });

  const handleUploadClick = (docKey: keyof typeof uploadedUrls) => {
    setUploadingDoc(docKey);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDoc) return;

    try {
      const path = `vehicles/${user.id}/${uploadingDoc}_${Date.now()}_${file.name}`;
      const url = await uploadImage(path, file);
      setUploadedUrls(prev => ({ ...prev, [uploadingDoc]: url }));
    } catch (err: any) {
      alert(`فشل رفع الملف: ${err.message}`);
    } finally {
      // Keep docKey for UI but clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const vehicleData = {
        driverId: user.id,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        plateNumber: formData.plateNumber,
        photos: {
          front: uploadedUrls.front,
          back: uploadedUrls.back,
          side: uploadedUrls.side
        },
        documents: {
          license: uploadedUrls.license,
          registration: uploadedUrls.registration,
          idCard: uploadedUrls.idCard
        }
      };

      await createVehicle(vehicleData);

      const message = editVehicle
        ? 'تم تحديث بيانات السيارة بنجاح.'
        : 'تم إرسال طلب إضافة السيارة ووثائق التوثيق بنجاح. سيتم مراجعة حسابك خلال 24 ساعة.';
      alert(message);
      navigate('/vehicles');
    } catch (err: any) {
      alert(`حدث خطأ أثناء الحفظ: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => step > 1 ? prevStep() : navigate('/vehicles')} className="p-2 hover:bg-gray-100 rounded-full bg-white shadow-sm">
          <ArrowRight size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {editVehicle ? 'تعديل بيانات السيارة' : 'إضافة سيارة وتوثيق حساب'}
          </h2>
          <p className="text-sm text-gray-500">
            {editVehicle ? 'تحديث معلومات مركبتك الحالية' : 'أكمل البيانات لتصبح سائقاً معتمداً'}
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm overflow-x-auto">
        {[
          { n: 1, label: 'شروط التوثيق' },
          { n: 2, label: 'بيانات المركبة' },
          { n: 3, label: 'صور المركبة' },
          { n: 4, label: 'رفع الوثائق' }
        ].map((s) => (
          <div key={s.n} className="flex-1 flex flex-col items-center gap-2 min-w-[60px]">
            <div className={`h-1.5 w-full rounded-full transition-all ${step >= s.n ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
            <span className={`text-[10px] font-bold text-center whitespace-nowrap ${step >= s.n ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center gap-3 text-blue-600 font-bold mb-2">
              <Info size={24} />
              <h3>قبل أن تبدأ: متطلبات التوثيق</h3>
            </div>

            <p className="text-gray-600 leading-relaxed font-medium">
              لضمان قبول طلبك وانضمامك كسائق في "رفيق" بسرعة، يرجى التأكد من تجهيز المستندات التالية وفق الشروط الموضحة.
            </p>

            <div className="space-y-4">
              <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><FileText size={18} /> المستندات المطلوبة</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-2 font-medium">
                  <li><b>الهوية الوطنية / الإقامة:</b> يجب أن تكون سارية المفعول مع صورة واضحة للوجهين.</li>
                  <li><b>رخصة القيادة:</b> سارية المفعول ومناسبة لنوع المركبة المسجلة.</li>
                  <li><b>استمارة السيارة:</b> وثيقة توضح ملكية المركبة أو تفويض قيادة مصدق.</li>
                </ul>
              </div>

              <div className="p-5 bg-green-50 rounded-3xl border border-green-100">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2"><ImageIcon size={18} /> صور المركبة</h4>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-2 font-medium">
                  <li>صور حديثة وواضحة (بدون فلاتر أو تعديل).</li>
                  <li>يجب أن تظهر لوحة المركبة بوضوح تام في الصور.</li>
                  <li>تصوير من زوايا متعددة (الأمام، الخلف، الجوانب).</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <div className="text-xs text-amber-800 font-bold leading-relaxed">
                  تنبيه: نقبل الملفات بصيغة (JPG, PNG, PDF) بحجم أقصى 5 ميجابايت. الصور المشوشة أو منتهية الصلاحية ستؤدي لرفض الطلب.
                </div>
              </div>
            </div>

            <button type="button" onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">
              قرأت الشروط، ابدأ التسجيل
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center gap-3 text-blue-600 font-bold mb-2">
              <ShieldCheck size={20} />
              <h3>معلومات المركبة الأساسية</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ماركة السيارة</label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="مثال: تويوتا، نيسان"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الموديل</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="كامري"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">السنة</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2023"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم اللوحة</label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="أ ب ج 1234"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition">رجوع</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">استمرار</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6 animate-in fade-in slide-in-from-left-4">
            <h3 className="font-bold text-xl text-gray-800">صور المركبة</h3>
            <p className="text-sm text-gray-500">يرجى رفع صور واضحة لسيارتك من الخارج كما هو موضح في الشروط</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'front' as const, label: 'الواجهة الأمامية' },
                { key: 'back' as const, label: 'الواجهة الخلفية' },
                { key: 'side' as const, label: 'الجانب الأيمن/الأيسر' }
              ].map(pic => (
                <div
                  key={pic.key}
                  onClick={() => handleUploadClick(pic.key)}
                  className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${uploadedUrls[pic.key] ? 'bg-green-50 border-green-500 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-400'}`}
                >
                  {uploadingDoc === pic.key && !uploadedUrls[pic.key] ? <Loader2 size={32} className="animate-spin" /> :
                    uploadedUrls[pic.key] ? <CheckCircle size={32} /> : <Camera size={32} />}
                  <span className="text-xs mt-2 font-bold">{pic.label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition">رجوع</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">استمرار</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center gap-3 text-orange-600 font-bold mb-2">
              <FileCheck size={24} />
              <h3>وثائق توثيق الهوية</h3>
            </div>
            <p className="text-sm text-gray-500 bg-orange-50 p-4 rounded-2xl border border-orange-100">
              يرجى رفع المستندات المطلوبة بوضوح. يتم تشفير هذه البيانات وتستخدم فقط لأغراض التحقق.
            </p>

            <div className="space-y-4">
              {[
                { key: 'idCard' as const, label: 'بطاقة الهوية / الإقامة', desc: 'صورة واضحة للوجهين' },
                { key: 'license' as const, label: 'رخصة القيادة', desc: 'يجب أن تكون سارية المفعول' },
                { key: 'registration' as const, label: 'استمارة السيارة', desc: 'توضح بيانات المالك والمركبة' }
              ].map(doc => (
                <div
                  key={doc.key}
                  onClick={() => handleUploadClick(doc.key)}
                  className={`p-5 rounded-2xl border-2 transition flex items-center justify-between cursor-pointer ${uploadedUrls[doc.key] ? 'bg-green-50 border-green-500' : 'bg-white border-gray-100 hover:border-blue-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${uploadedUrls[doc.key] ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {uploadingDoc === doc.key && !uploadedUrls[doc.key] ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{doc.label}</h4>
                      <p className="text-[10px] text-gray-500">{doc.desc}</p>
                    </div>
                  </div>
                  {uploadedUrls[doc.key] && <CheckCircle size={20} className="text-green-600" />}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 text-[11px] rounded-2xl border border-blue-100">
              <AlertCircle size={16} className="shrink-0" />
              <p>بإرسال هذه الوثائق، أنت تقر بصحة البيانات وتوافق على شروط "رفيق" الخاصة بالسائقين.</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition">رجوع</button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
                {editVehicle ? 'تحديث البيانات' : 'إرسال طلب التوثيق والمركبة'}
              </button>
            </div>
          </div>
        )}
      </form>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
      />
    </div>
  );
};

export default AddVehicle;
