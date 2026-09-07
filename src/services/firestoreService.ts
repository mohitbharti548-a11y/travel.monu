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
  BookingItem,
  ReelPost
} from '../types';

let db: Firestore | null = null;
let lastError: string | null = null;

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
  | 'bookings'
  | 'reels';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), timeoutMs))
  ]);
}

const MAX_CATALOG_BYTES = 700_000;

function byteLength(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).length;
}

function splitArrayIntoChunks<T>(items: T[]): T[][] {
  const chunks: T[][] = [];
  let current: T[] = [];

  for (const item of items) {
    const candidate = [...current, item];
    if (current.length > 0 && byteLength(candidate) > MAX_CATALOG_BYTES) {
      chunks.push(current);
      current = [item];
    } else {
      current = candidate;
    }
  }

  if (current.length > 0) chunks.push(current);
  return chunks;
}

export const firestoreService = {
  isAvailable(): boolean {
    return db !== null;
  },

  getLastError(): string | null {
    return lastError;
  },

  // Save entire catalog or collection to Cloud Firestore with ultra-fast timeout
  async saveCatalog(key: CatalogKey, data: any): Promise<boolean> {
    if (!db) {
      lastError = 'Firestore is not initialized.';
      return false;
    }
    try {
      const updatedAt = new Date().toISOString();
      const chunks = Array.isArray(data) && byteLength(data) > MAX_CATALOG_BYTES
        ? splitArrayIntoChunks(data)
        : null;
      const writes: Promise<unknown>[] = [];

      if (chunks) {
        writes.push(setDoc(doc(db, 'catalog_v1', `${key}_manifest`), {
          chunkCount: chunks.length,
          updatedAt
        }));
        chunks.forEach((chunk, index) => {
          writes.push(setDoc(doc(db, 'catalog_v1', `${key}_${index}`), {
            payload: chunk,
            updatedAt
          }));
        });
      } else {
        writes.push(setDoc(doc(db, 'catalog_v1', key), { payload: data, updatedAt }, { merge: true }));
      }

      const savePromise = Promise.all(writes)
        .then(() => true)
        .catch((err) => {
          lastError = err instanceof Error ? err.message : String(err);
          console.warn(`Firestore save error on ${key}:`, err);
          return false;
        });

      return await withTimeout(savePromise, 10000, false);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.warn(`Failed to save ${key} to Firestore:`, e);
      return false;
    }
  },

  // Load collection from Cloud Firestore with fast timeout
  async loadCatalog<T>(key: CatalogKey): Promise<T | null> {
    if (!db) return null;
    try {
      const loadPromise = getDoc(doc(db, 'catalog_v1', `${key}_manifest`))
        .then(async (manifest) => {
          if (manifest.exists() && typeof manifest.data().chunkCount === 'number') {
            const chunkCount = manifest.data().chunkCount as number;
            const snapshots = await Promise.all(
              Array.from({ length: chunkCount }, (_, index) => getDoc(doc(db!, 'catalog_v1', `${key}_${index}`)))
            );
            return snapshots.flatMap((snapshot) => {
              const payload = snapshot.data()?.payload;
              return Array.isArray(payload) ? payload : [];
            }) as T;
          }

          const snap = await getDoc(doc(db!, 'catalog_v1', key));
          if (snap.exists()) return (snap.data()?.payload as T) || null;
          return null;
        })
        .catch((err) => {
          lastError = err instanceof Error ? err.message : String(err);
          console.warn(`Firestore load error on ${key}:`, err);
          return null;
        });

      return await withTimeout(loadPromise, 10000, null);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.warn(`Failed to load ${key} from Firestore:`, e);
    }
    return null;
  },

  // Real-time listener for live updates across all devices
  subscribeToCatalog<T>(key: CatalogKey, callback: (data: T) => void) {
    if (!db) return () => {};
    try {
      const manifestRef = doc(db, 'catalog_v1', `${key}_manifest`);
      const unsub = onSnapshot(manifestRef, async (manifest) => {
        if (manifest.exists() && typeof manifest.data().chunkCount === 'number') {
          const chunkCount = manifest.data().chunkCount as number;
          const snapshots = await Promise.all(
            Array.from({ length: chunkCount }, (_, index) => getDoc(doc(db!, 'catalog_v1', `${key}_${index}`)))
          );
          callback(snapshots.flatMap((snapshot) => {
            const payload = snapshot.data()?.payload;
            return Array.isArray(payload) ? payload : [];
          }) as T);
          return;
        }

        const snap = await getDoc(doc(db!, 'catalog_v1', key));
        if (snap.exists() && snap.data()?.payload) {
          callback(snap.data().payload as T);
        }
      }, (err) => {
        lastError = err instanceof Error ? err.message : String(err);
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
    reels?: ReelPost[];
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
      if (catalog.reels) tasks.push(this.saveCatalog('reels', catalog.reels));

      const results = await withTimeout(Promise.all(tasks), 15000, []);
      return results.length === tasks.length && results.every(r => r === true);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.error('Failed to sync full catalog to Firestore cloud:', e);
      return false;
    }
  }
};
