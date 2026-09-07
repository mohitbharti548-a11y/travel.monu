/**
 * Google Firebase Configuration for The Himachal Nomad (travel-monu)
 * Uses Vite environment variables with automatic fallback to live credentials
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1lb_L3BW1Tj6_4y_tOCgIToXDoMD_Vuc",
  authDomain: "travel-monu.firebaseapp.com",
  projectId: "travel-monu",
  storageBucket: "travel-monu.firebasestorage.app",
  messagingSenderId: "731219330063",
  appId: "1:731219330063:web:fcff5678086c4363060f7a",
  measurementId: "G-D3KGFHFGGG",
  vapidKey: "BBU26HGALDvv33Cy6eFk3EBA4FGDZJ142ij48dSuGh2VmV8wlXCJZFLKxVIOseiU5nys7GCnXdc0996C0yRaVQ"
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "AIzaSyDummyKeyReplaceWithYours" &&
    firebaseConfig.apiKey.length > 20
  );
};
