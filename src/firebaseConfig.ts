/**
 * Google Firebase Configuration for The Himachal Nomad (travel-monu)
 * Uses Vite environment variables with automatic fallback to live credentials
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1lb_L3BW1Tj6_4y_tOCgIToXDoMD_Vuc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "travel-monu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "travel-monu",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "travel-monu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "731219330063",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:731219330063:web:fcff5678086c4363060f7a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D3KGFHFGGG"
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "AIzaSyDummyKeyReplaceWithYours" &&
    firebaseConfig.apiKey.length > 20
  );
};
