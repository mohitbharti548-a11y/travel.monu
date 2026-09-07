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

async function fastFetch(url: string, options: RequestInit = {}, timeoutMs = 1200): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Expected JSON from ${url}, received ${contentType || 'unknown content type'}`);
    }
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
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
      const res = await fastFetch('/api/custom-requests');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline fallback
    }
    return [];
  },

  async postCustomRequest(req: CustomTripRequest): Promise<CustomTripRequest> {
    try {
      const res = await fastFetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        const data = await res.json();
        return data.request || req;
      }
    } catch (e) {
      // offline
    }
    return req;
  },

  async approveCustomRequest(requestId: string, price: number, schedule: any[], notes: string): Promise<boolean> {
    try {
      const res = await fastFetch(`/api/custom-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, schedule, notes })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 2. Bookings
  async fetchBookings(): Promise<BookingItem[]> {
    try {
      const res = await fastFetch('/api/bookings');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
    }
    return [];
  },

  async postBooking(booking: BookingItem): Promise<BookingItem> {
    try {
      const res = await fastFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        const data = await res.json();
        return data.booking || booking;
      }
    } catch (e) {
      // offline
    }
    return booking;
  },

  // 3. Dynamic Pricing Rules
  async fetchPricingRules(): Promise<PricingRules | null> {
    try {
      const res = await fastFetch('/api/pricing-rules');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
    }
    return null;
  },

  async savePricingRules(rules: PricingRules): Promise<boolean> {
    try {
      const res = await fastFetch('/api/pricing-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 4. Road Alert
  async fetchRoadAlert(): Promise<string | null> {
    try {
      const res = await fastFetch('/api/admin/alert');
      if (res.ok) {
        const data = await res.json();
        return data.roadAlert || null;
      }
    } catch (e) {
      // offline
    }
    return null;
  },

  async saveRoadAlert(roadAlert: string): Promise<boolean> {
    try {
      const res = await fastFetch('/api/admin/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadAlert })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 5. Packages
  async fetchPackages(): Promise<TourPackage[]> {
    try {
      const res = await fastFetch('/api/packages');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
    }
    return [];
  },

  async savePackages(packages: TourPackage[]): Promise<boolean> {
    try {
      const res = await fastFetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packages)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 6. Stays
  async fetchStays(): Promise<Stay[]> {
    try {
      const res = await fastFetch('/api/stays');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
    }
    return [];
  },

  async saveStays(stays: Stay[]): Promise<boolean> {
    try {
      const res = await fastFetch('/api/stays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stays)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 7. Guides
  async fetchGuides(): Promise<LocalGuide[]> {
    try {
      const res = await fastFetch('/api/guides');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
    }
    return [];
  },

  async saveGuides(guides: LocalGuide[]): Promise<boolean> {
    try {
      const res = await fastFetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guides)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 8. Destinations
  async fetchDestinations(): Promise<Destination[]> {
    try {
      const res = await fastFetch('/api/destinations');
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
    }
    return [];
  },

  async saveDestinations(destinations: Destination[]): Promise<boolean> {
    try {
      const res = await fastFetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinations)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 9. Razorpay Gateway Gateway
  async createRazorpayOrder(amount: number, destination: string) {
    try {
      const res = await fastFetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, destination })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // offline
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
