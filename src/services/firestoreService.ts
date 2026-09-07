import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  Firestore 
} from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from '../firebaseConfig';
import { 
  Destination, 
  TourPackage, 
  Stay, 
  LocalGuide, 
  PricingRules,
  CustomTripRequest,
  BookingItem 
} from '../types';

let db: Firestore | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn('Firebase Firestore initialization failed', e);
  }
}

export type CatalogKey = 
  | 'destinations' 
  | 'packages' 
  | 'stays' 
  | 'guides' 
  | 'pricing_rules' 
  | 'road_alert'
  | 'custom_requests'
  | 'bookings';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 3000, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), timeoutMs))
  ]);
}

export const firestoreService = {
  isAvailable(): boolean {
    return db !== null;
  },

  // Save entire catalog or collection to Cloud Firestore with ultra-fast timeout
  async saveCatalog(key: CatalogKey, data: any): Promise<boolean> {
    if (!db) return false;
    try {
      const docRef = doc(db, 'catalog_v1', key);
      const savePromise = setDoc(docRef, { payload: data, updatedAt: new Date().toISOString() }, { merge: true })
        .then(() => true)
        .catch((err) => {
          console.warn(`Firestore save error on ${key}:`, err);
          return false;
        });

      return await withTimeout(savePromise, 2500, true);
    } catch (e) {
      console.warn(`Failed to save ${key} to Firestore:`, e);
      return false;
    }
  },

  // Load collection from Cloud Firestore with fast timeout
  async loadCatalog<T>(key: CatalogKey): Promise<T | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'catalog_v1', key);
      const loadPromise = getDoc(docRef)
        .then((snap) => {
          if (snap.exists()) {
            const data = snap.data();
            return (data?.payload as T) || null;
          }
          return null;
        })
        .catch((err) => {
          console.warn(`Firestore load error on ${key}:`, err);
          return null;
        });

      return await withTimeout(loadPromise, 2500, null);
    } catch (e) {
      console.warn(`Failed to load ${key} from Firestore:`, e);
    }
    return null;
  },

  // Real-time listener for live updates across all devices
  subscribeToCatalog<T>(key: CatalogKey, callback: (data: T) => void) {
    if (!db) return () => {};
    try {
      const docRef = doc(db, 'catalog_v1', key);
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.payload) {
            callback(data.payload as T);
          }
        }
      }, (err) => {
        console.warn(`Firestore subscription error for ${key}:`, err);
      });
      return unsub;
    } catch {
      return () => {};
    }
  },

  // Push all local data from Admin laptop into Cloud Firestore (Instant parallel execution)
  async pushAllLocalToCloud(catalog: {
    destinations: Destination[];
    packages: TourPackage[];
    stays: Stay[];
    guides: LocalGuide[];
    pricingRules?: PricingRules;
    roadAlert?: string;
    customRequests?: CustomTripRequest[];
    bookings?: BookingItem[];
  }): Promise<boolean> {
    if (!db) return false;
    try {
      const tasks: Promise<boolean>[] = [
        this.saveCatalog('destinations', catalog.destinations),
        this.saveCatalog('packages', catalog.packages),
        this.saveCatalog('stays', catalog.stays),
        this.saveCatalog('guides', catalog.guides)
      ];
      if (catalog.pricingRules) tasks.push(this.saveCatalog('pricing_rules', catalog.pricingRules));
      if (catalog.roadAlert) tasks.push(this.saveCatalog('road_alert', catalog.roadAlert));
      if (catalog.customRequests) tasks.push(this.saveCatalog('custom_requests', catalog.customRequests));
      if (catalog.bookings) tasks.push(this.saveCatalog('bookings', catalog.bookings));

      const results = await withTimeout(Promise.all(tasks), 3000, [true, true, true, true]);
      return results.some(r => r === true);
    } catch (e) {
      console.error('Failed to sync full catalog to Firestore cloud:', e);
      return false;
    }
  }
};
