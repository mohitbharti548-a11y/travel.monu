import { 
  Destination, 
  TourPackage, 
  Stay, 
  LocalGuide, 
  BookingItem, 
  CustomTripRequest 
} from '../types';
import { 
  DESTINATIONS, 
  TOUR_PACKAGES, 
  CURATED_STAYS, 
  LOCAL_GUIDES, 
} from '../data/mockData';

const STORAGE_KEYS = {
  DESTINATIONS: 'hn_destinations_v5',
  PACKAGES: 'hn_packages_v5',
  STAYS: 'hn_stays_v5',
  GUIDES: 'hn_guides_v5',
  BOOKINGS: 'hn_bookings_v4',
  CUSTOM_REQUESTS: 'hn_custom_requests_v4',
  ROAD_ALERT: 'hn_road_alert_v4'
};

export const storageService = {
  // Destinations
  loadDestinations(): Destination[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
      if (!data) return [];
      const parsed: Destination[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  },
  saveDestinations(list: Destination[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist destinations to localStorage', e);
    }
  },

  // Packages
  loadPackages(): TourPackage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  savePackages(list: TourPackage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist packages to localStorage', e);
    }
  },

  // Stays
  loadStays(): Stay[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAYS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveStays(list: Stay[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAYS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist stays to localStorage', e);
    }
  },

  // Guides (No Contact Info Stored)
  loadGuides(): LocalGuide[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GUIDES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveGuides(list: LocalGuide[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist guides to localStorage', e);
    }
  },

  // Bookings
  loadBookings(): BookingItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveBookings(list: BookingItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist bookings to localStorage', e);
    }
  },

  // Custom Requests
  loadCustomRequests(): CustomTripRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveCustomRequests(list: CustomTripRequest[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_REQUESTS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist custom requests to localStorage', e);
    }
  },

  // Road Alert
  loadRoadAlert(): string {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROAD_ALERT);
      return data || 'Live Road Update: Atal Tunnel & Kunzum Pass Open (Dry & Clear)';
    } catch {
      return 'Live Road Update: Atal Tunnel & Kunzum Pass Open (Dry & Clear)';
    }
  },
  saveRoadAlert(alert: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.ROAD_ALERT, alert);
    } catch (e) {
      console.warn('Failed to persist road alert to localStorage', e);
    }
  },

  // Dynamic Pricing Rules
  loadPricingRules() {
    try {
      const data = localStorage.getItem('hn_pricing_rules_v4');
      return data ? JSON.parse(data) : {
        globalMultiplierPercent: 0,
        packageModifierPercent: 0,
        stayModifierPercent: 0,
        transitModifierPercent: 0,
        fuelSurchargePercent: 0,
        seasonPreset: 'normal',
        defaultUpiVpa: 'rajeshnov1988@okhdfcbank',
        isDynamicPricingActive: true,
        updatedAt: new Date().toISOString()
      };
    } catch {
      return {
        globalMultiplierPercent: 0,
        packageModifierPercent: 0,
        stayModifierPercent: 0,
        transitModifierPercent: 0,
        fuelSurchargePercent: 0,
        seasonPreset: 'normal',
        defaultUpiVpa: 'rajeshnov1988@okhdfcbank',
        isDynamicPricingActive: true,
        updatedAt: new Date().toISOString()
      };
    }
  },
  savePricingRules(rules: any) {
    try {
      localStorage.setItem('hn_pricing_rules_v4', JSON.stringify(rules));
    } catch (e) {
      console.warn('Failed to persist pricing rules', e);
    }
  },

  // Promo Codes (Placeholder/Config ready for future discount campaigns)
  loadPromoCodes() {
    try {
      const data = localStorage.getItem('hn_promo_codes_v4');
      return data ? JSON.parse(data) : [
        {
          id: 'promo-1',
          code: 'MONU10',
          discountPercent: 10,
          minTravelers: 2,
          maxUses: 100,
          usedCount: 14,
          validUntil: '2026-12-31',
          isActive: true,
          applicableCategory: 'all'
        },
        {
          id: 'promo-2',
          code: 'SPITI2026',
          discountPercent: 15,
          minTravelers: 4,
          maxUses: 50,
          usedCount: 8,
          validUntil: '2026-10-31',
          isActive: true,
          applicableCategory: 'package'
        }
      ];
    } catch {
      return [];
    }
  },
  savePromoCodes(codes: any[]) {
    try {
      localStorage.setItem('hn_promo_codes_v4', JSON.stringify(codes));
    } catch (e) {
      console.warn('Failed to persist promo codes', e);
    }
  }
};

