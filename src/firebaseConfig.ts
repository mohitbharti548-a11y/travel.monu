/**
 * Google Firebase Configuration for The Himachal Nomad
 * Phone Authentication and SMS OTP Delivery
 */

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyReplaceWithYours",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "himachal-nomad.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "himachal-nomad",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "himachal-nomad.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    metaEnv.VITE_FIREBASE_API_KEY && 
    metaEnv.VITE_FIREBASE_API_KEY !== "AIzaSyDummyKeyReplaceWithYours"
  );
};
