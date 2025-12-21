import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تعريف واجهة Trusted Types لإصلاح أخطاء TypeScript
declare global {
  interface Window {
    trustedTypes?: {
      defaultPolicy?: {
        createHTML: (html: string) => string;
      };
    };
  }
}

console.log("Rafiq App: Starting initialization...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Could not find root element with id 'root'.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Rafiq App: Render successful.");
  } catch (error) {
    console.error("Rafiq App: Rendering failed", error);
    
    const errorHtml = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2 style="color: #e11d48;">حدث خطأ أثناء تحميل التطبيق</h2>
        <p>يرجى التحقق من اتصال الإنترنت أو تحديث الصفحة.</p>
        <p style="font-size: 12px; color: gray;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">إعادة المحاولة</button>
      </div>
    `;

    // استخدام Trusted Types بشكل آمن إذا كانت متوفرة
    if (window.trustedTypes && window.trustedTypes.defaultPolicy) {
      rootElement.innerHTML = window.trustedTypes.defaultPolicy.createHTML(errorHtml) as unknown as string;
    } else {
      rootElement.innerHTML = errorHtml;
    }
  }
}