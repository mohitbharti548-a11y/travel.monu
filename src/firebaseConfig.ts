/**
 * Google Firebase Configuration for The Himachal Nomad (travel-monu)
 * Official Live Firebase Phone Authentication & SMS Delivery
 */

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyB1lb_L3BW1Tj6_4y_tOCgIToXDoMD_Vuc",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "travel-monu.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "travel-monu",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "travel-monu.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "731219330063",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:731219330063:web:fcff5678086c4363060f7a",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-D3KGFHFGGG"
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "AIzaSyDummyKeyReplaceWithYours"
  );
};
