import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// إعدادات Firebase - تأكد من مطابقتها لمشروعك في Firebase Console
// إعدادات Firebase - تأكد من مطابقتها لمشروعك في Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDjAt_vbamMfDp0l3Aukg6soc_Placeholder",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "alarhby.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "alarhby",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "alarhby.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// التحقق من صحة الإعدادات
if (firebaseConfig.apiKey.includes("_Placeholder")) {
  console.warn("⚠️ Firebase Warning: You are using placeholder configuration. Data will not be saved and operations might hang.");
}


// تهيئة التطبيق لمرة واحدة فقط (Singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// تسجيل الخدمات بشكل صريح وربطها بنفس مثيل 'app'
// هذا يمنع خطأ "Component auth has not been registered yet"
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;