
import { VerificationStatus } from './types';

export const COUNTRIES = ['المملكة العربية السعودية', 'الجمهورية اليمنية'];

export const CITIES: Record<string, string[]> = {
  'المملكة العربية السعودية': ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'أبها', 'نجران', 'جيزان'],
  'الجمهورية اليمنية': ['صنعاء', 'عدن', 'تعز', 'المكلا', 'إب', 'ذمار', 'الحديدة', 'مأرب', 'سيئون']
};

export const SHIPMENT_TYPES = ['طرود صغيرة', 'أوراق ومستندات', 'شحنات كبيرة', 'أثاث', 'أجهزة إلكترونية'];

export const MOCK_USERS = [
  { id: '1', name: 'أحمد علي محمد', phone: '+966501234567', role: 'DRIVER', isVerified: true, verificationStatus: VerificationStatus.VERIFIED },
  { id: '2', name: 'سارة خالد', phone: '+967771234567', role: 'PASSENGER', isVerified: true, verificationStatus: VerificationStatus.VERIFIED },
  { id: 'admin', name: 'مدير النظام', phone: '+96600000000', role: 'ADMIN', isVerified: true, verificationStatus: VerificationStatus.VERIFIED }
];
