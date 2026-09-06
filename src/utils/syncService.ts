import { 
  CustomTripRequest, 
  BookingItem, 
  TourPackage, 
  Stay, 
  LocalGuide, 
  Destination, 
  PricingRules,
  ReelPost 
} from '../types';

// Enterprise Cross-tab and Server Synchronization Pipeline
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('himachal_nomad_live_sync')
  : null;

export interface SyncMessage {
  type: 
    | 'CUSTOM_REQUEST_CREATED' 
    | 'CUSTOM_REQUEST_APPROVED' 
    | 'BOOKING_CONFIRMED' 
    | 'ROAD_ALERT_UPDATED'
    | 'PRICING_RULES_UPDATED'
    | 'PACKAGES_UPDATED'
    | 'STAYS_UPDATED'
    | 'GUIDES_UPDATED'
    | 'DESTINATIONS_UPDATED'
    | 'REELS_UPDATED'
    | 'DATA_UPDATED';
  payload: any;
  timestamp: string;
}

export const syncService = {
  // Broadcast an event to all open tabs / windows instantly
  broadcast(type: SyncMessage['type'], payload: any) {
    if (channel) {
      try {
        channel.postMessage({
          type,
          payload,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn('BroadcastChannel transmission error', e);
      }
    }
  },

  // Subscribe to live cross-tab sync events
  onMessage(callback: (msg: SyncMessage) => void) {
    if (!channel) return () => {};
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type) {
        callback(event.data);
      }
    };
    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
    };
  },

  // --- REST API SYNCHRONIZATION PIPELINES ---

  // 1. Custom Requests
  async fetchCustomRequests(): Promise<CustomTripRequest[]> {
    try {
      const res = await fetch('/api/custom-requests');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch custom requests from server', e);
    }
    return [];
  },

  async postCustomRequest(req: CustomTripRequest): Promise<CustomTripRequest> {
    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        const data = await res.json();
        return data.request || req;
      }
    } catch (e) {
      console.warn('Could not post custom request to server', e);
    }
    return req;
  },

  async approveCustomRequest(requestId: string, price: number, schedule: any[], notes: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/custom-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, schedule, notes })
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not send approval to server', e);
      return false;
    }
  },

  // 2. Bookings
  async fetchBookings(): Promise<BookingItem[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch bookings from server', e);
    }
    return [];
  },

  async postBooking(booking: BookingItem): Promise<BookingItem> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        const data = await res.json();
        return data.booking || booking;
      }
    } catch (e) {
      console.warn('Could not post booking to server', e);
    }
    return booking;
  },

  // 3. Dynamic Pricing Rules
  async fetchPricingRules(): Promise<PricingRules | null> {
    try {
      const res = await fetch('/api/pricing-rules');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch pricing rules from server', e);
    }
    return null;
  },

  async savePricingRules(rules: PricingRules): Promise<boolean> {
    try {
      const res = await fetch('/api/pricing-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules)
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not save pricing rules to server', e);
      return false;
    }
  },

  // 4. Road Alert
  async fetchRoadAlert(): Promise<string | null> {
    try {
      const res = await fetch('/api/admin/alert');
      if (res.ok) {
        const data = await res.json();
        return data.roadAlert || null;
      }
    } catch (e) {
      console.warn('Could not fetch road alert from server', e);
    }
    return null;
  },

  async saveRoadAlert(roadAlert: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadAlert })
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not save road alert to server', e);
      return false;
    }
  },

  // 5. Packages
  async fetchPackages(): Promise<TourPackage[]> {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch packages from server', e);
    }
    return [];
  },

  async savePackages(packages: TourPackage[]): Promise<boolean> {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packages)
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not sync packages to server', e);
      return false;
    }
  },

  // 6. Stays
  async fetchStays(): Promise<Stay[]> {
    try {
      const res = await fetch('/api/stays');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch stays from server', e);
    }
    return [];
  },

  async saveStays(stays: Stay[]): Promise<boolean> {
    try {
      const res = await fetch('/api/stays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stays)
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not sync stays to server', e);
      return false;
    }
  },

  // 7. Guides
  async fetchGuides(): Promise<LocalGuide[]> {
    try {
      const res = await fetch('/api/guides');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch guides from server', e);
    }
    return [];
  },

  async saveGuides(guides: LocalGuide[]): Promise<boolean> {
    try {
      const res = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guides)
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not sync guides to server', e);
      return false;
    }
  },

  // 8. Destinations
  async fetchDestinations(): Promise<Destination[]> {
    try {
      const res = await fetch('/api/destinations');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch destinations from server', e);
    }
    return [];
  },

  async saveDestinations(destinations: Destination[]): Promise<boolean> {
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinations)
      });
      return res.ok;
    } catch (e) {
      console.warn('Could not sync destinations to server', e);
      return false;
    }
  },

  // 9. Razorpay Gateway Gateway
  async createRazorpayOrder(amount: number, destination: string) {
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, destination })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Razorpay order creation fallback to simulated gateway', e);
    }
    return {
      success: true,
      orderId: `order_sim_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      key: 'rzp_test_HimachalNomadCreatorKey'
    };
  }
};
