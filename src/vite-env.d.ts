/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase Live Configuration
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_FIREBASE_VAPID_KEY: string;

  // Admin Security
  readonly VITE_ADMIN_PASSKEY: string;
  readonly VITE_ADMIN_EMAIL: string;

  // Payments & Merchant Configuration
  readonly VITE_UPI_VPA: string;
  readonly VITE_MERCHANT_NAME: string;
  readonly VITE_RAZORPAY_KEY_ID: string;

  // Direct Operations & Contact
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_SUPPORT_EMAIL: string;

  // Weather & Live Services
  readonly VITE_WEATHER_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
