import React, { useState, useEffect } from 'react';
import { 
  DestinationId, 
  Destination, 
  TourPackage, 
  ItineraryDay, 
  TransitOption, 
  BookingItem, 
  ReelPost, 
  Stay, 
  LocalGuide, 
  CustomTripRequest, 
  CustomTripDayPlan,
  UserProfile,
  PricingRules 
} from './types';
import { REEL_POSTS, DESTINATIONS } from './data/mockData';
import { storageService } from './utils/storageService';
import { syncService } from './utils/syncService';
import { firestoreService } from './services/firestoreService';
import { signOutTraveler } from './utils/firebaseAuth';
import { notificationEngine } from './services/notificationEngine';
import { enforceFrameIsolation } from './utils/securityGuard';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ParallaxBanner } from './components/ParallaxBanner';
import { DestinationHubs } from './components/DestinationHubs';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { HandpickedStaysSection } from './components/HandpickedStaysSection';
import { StayBookingModal } from './components/StayBookingModal';
import { CustomPackageBuilder } from './components/CustomPackageBuilder';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { PeakFeedReels } from './components/PeakFeedReels';
import { PostMemoryModal } from './components/PostMemoryModal';
import { LocalGuidesSection } from './components/LocalGuidesSection';
import { MiniReelFloatingCard } from './components/MiniReelFloatingCard';
import { FloatingAlertsWidget } from './components/FloatingAlertsWidget';
import { RefundPolicyModal } from './components/RefundPolicyModal';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { AdminPanelPage } from './components/AdminPanelPage';
import { MyBookingsModal } from './components/MyBookingsModal';
import { UserAuthModal } from './components/UserAuthModal';
import { Footer } from './components/Footer';

export function App() {
  // Enforce frame isolation & anti-clickjacking
  useEffect(() => {
    enforceFrameIsolation();
  }, []);

  // Routing State: 'user' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin' || window.location.hash === '#/admin') {
        return 'admin';
      }
    }
    return 'user';
  });

  // User Profile & Authentication State (Persistent via localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('hn_user_session_v4');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string>('');

  // Listen to browser URL changes
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#/admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('user');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    setCurrentRoute('admin');
    window.history.pushState({}, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToUser = () => {
    setCurrentRoute('user');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Application Data States (Enterprise Persistent via storageService, syncService & Cloud Firestore)
  const [destinations, setDestinations] = useState<Destination[]>(() => storageService.loadDestinations());
  const [packages, setPackages] = useState<TourPackage[]>(() => storageService.loadPackages());
  const [stays, setStays] = useState<Stay[]>(() => storageService.loadStays());
  const [guides, setGuides] = useState<LocalGuide[]>(() => storageService.loadGuides());
  const [reels, setReels] = useState<ReelPost[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomTripRequest[]>([]);
  const [roadAlert, setRoadAlert] = useState<string>(() => storageService.loadRoadAlert());
  const [pricingRules, setPricingRules] = useState<PricingRules>(() => storageService.loadPricingRules());

  const isLegacyDemoBooking = (booking: BookingItem) => (
    booking.id === 'bk-1092'
    || booking.bookingRef === 'HN-SPITI-9842'
    || booking.contactEmail === 'ramesh.traveler@example.com'
    || booking.primaryTraveler === 'Ramesh & Partner'
  );

  const removeLegacyDemoBooking = (list: BookingItem[]) => list.filter((booking) => !isLegacyDemoBooking(booking));

  const userEmail = (userProfile?.email || '').trim().toLowerCase();
  const userPhone = (userProfile?.phone || userProfile?.phoneNumber || '').replace(/\D/g, '');
  const userBookings = userProfile?.isLoggedIn
    ? bookings.filter((booking) => {
        const bookingEmail = (booking.contactEmail || '').trim().toLowerCase();
        const bookingPhone = (booking.contactPhone || '').replace(/\D/g, '');
        return (userEmail && bookingEmail === userEmail) || (userPhone && bookingPhone && bookingPhone.endsWith(userPhone.slice(-10)));
      })
    : [];
  const userCustomRequests = userProfile?.isLoggedIn
    ? customRequests.filter((request) => {
        const requestEmail = (request.travelerEmail || request.email || request.userEmail || '').trim().toLowerCase();
        const requestPhone = (request.travelerPhone || request.phone || request.userPhone || '').replace(/\D/g, '');
        return (userEmail && requestEmail === userEmail) || (userPhone && requestPhone && requestPhone.endsWith(userPhone.slice(-10)));
      })
    : [];

  // Automatic Persistence Synchronization to localStorage
  useEffect(() => { storageService.saveBookings(bookings); }, [bookings]);
  useEffect(() => { storageService.saveCustomRequests(customRequests); }, [customRequests]);
  useEffect(() => { storageService.saveRoadAlert(roadAlert); }, [roadAlert]);
  useEffect(() => { storageService.savePricingRules(pricingRules); }, [pricingRules]);

  useEffect(() => {
    if (!userProfile?.isLoggedIn || userCustomRequests.length === 0) return;

    const notifiedKey = 'hn_approved_requests_notified_v1';
    let notified: string[] = [];
    try {
      notified = JSON.parse(localStorage.getItem(notifiedKey) || '[]');
    } catch {
      notified = [];
    }

    const newlyApproved = userCustomRequests.filter((request) =>
      request.status === 'approved' && !notified.includes(request.id)
    );

    newlyApproved.forEach((request) => {
      notificationEngine.notifyCustomRequestApproved(request);
      notified.push(request.id);
    });

    if (newlyApproved.length > 0) {
      localStorage.setItem(notifiedKey, JSON.stringify(notified));
    }
  }, [userProfile, userCustomRequests]);

  // Initial Server & Cloud Firestore Synchronization
  useEffect(() => {
    // 1. Fetch initial Cloud Firestore Catalog (Instant Global Source of Truth)
    if (firestoreService.isAvailable()) {
      firestoreService.loadCatalog<Destination[]>('destinations').then(cloudDest => {
        if (cloudDest) setDestinations(cloudDest);
      });
      firestoreService.loadCatalog<TourPackage[]>('packages').then(cloudPkg => {
        if (cloudPkg) setPackages(cloudPkg);
      });
      firestoreService.loadCatalog<Stay[]>('stays').then(cloudStays => {
        if (cloudStays) setStays(cloudStays);
      });
      firestoreService.loadCatalog<LocalGuide[]>('guides').then(cloudGuides => {
        if (cloudGuides) setGuides(cloudGuides);
      });
      firestoreService.loadCatalog<PricingRules>('pricing_rules').then(cloudRules => {
        if (cloudRules) setPricingRules(cloudRules);
      });
      firestoreService.loadCatalog<string>('road_alert').then(cloudAlert => {
        if (cloudAlert) setRoadAlert(cloudAlert);
      });
      firestoreService.loadCatalog<CustomTripRequest[]>('custom_requests').then(cloudReqs => {
        if (cloudReqs && cloudReqs.length > 0) {
          setCustomRequests(prev => {
            const map = new Map<string, CustomTripRequest>();
            [...cloudReqs, ...prev].forEach(item => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
      });
      firestoreService.loadCatalog<BookingItem[]>('bookings').then(cloudBookings => {
        if (cloudBookings) {
          const cleanBookings = removeLegacyDemoBooking(cloudBookings);
          setBookings(prev => {
            const map = new Map<string, BookingItem>();
            [...cleanBookings, ...removeLegacyDemoBooking(prev)].forEach(b => map.set(b.id, b));
            return Array.from(map.values());
          });
          if (cleanBookings.length !== cloudBookings.length) {
            firestoreService.saveCatalog('bookings', cleanBookings);
          }
        }
      });
      firestoreService.loadCatalog<ReelPost[]>('reels').then(cloudReels => {
        if (cloudReels) setReels(cloudReels);
      });

      // 2. Real-time Live Cloud Subscriptions (Push Updates to all Devices Worldwide)
      const unsubDest = firestoreService.subscribeToCatalog<Destination[]>('destinations', (d) => {
        if (Array.isArray(d)) setDestinations(d);
      });
      const unsubPkg = firestoreService.subscribeToCatalog<TourPackage[]>('packages', (p) => {
        if (Array.isArray(p)) setPackages(p);
      });
      const unsubStays = firestoreService.subscribeToCatalog<Stay[]>('stays', (s) => {
        if (Array.isArray(s)) setStays(s);
      });
      const unsubGuides = firestoreService.subscribeToCatalog<LocalGuide[]>('guides', (g) => {
        if (Array.isArray(g)) setGuides(g);
      });
      const unsubPricing = firestoreService.subscribeToCatalog<PricingRules>('pricing_rules', (pr) => {
        if (pr) setPricingRules(pr);
      });
      const unsubRoad = firestoreService.subscribeToCatalog<string>('road_alert', (ra) => {
        if (ra) setRoadAlert(ra);
      });
      const unsubReels = firestoreService.subscribeToCatalog<ReelPost[]>('reels', (r) => {
        if (r) setReels(r);
      });
      const unsubRequests = firestoreService.subscribeToCatalog<CustomTripRequest[]>('custom_requests', (requests) => {
        if (Array.isArray(requests)) setCustomRequests(requests);
      });
      const unsubBookings = firestoreService.subscribeToCatalog<BookingItem[]>('bookings', (liveBookings) => {
        if (Array.isArray(liveBookings)) setBookings(removeLegacyDemoBooking(liveBookings));
      });

    }

    // Firestore is the catalog source for deployed builds. The legacy /api catalog
    // endpoints only exist in the local Node server and must not overwrite it.

    // Server-only endpoints remain available for bookings, requests, pricing, and alerts.
    syncService.fetchCustomRequests().then(serverList => {
      if (serverList && serverList.length > 0) {
        setCustomRequests(prev => {
          const map = new Map<string, CustomTripRequest>();
          [...serverList, ...prev].forEach(item => map.set(item.id, item));
          return Array.from(map.values());
        });
      }
    });

    syncService.fetchBookings().then(serverBookings => {
      if (serverBookings && serverBookings.length > 0) {
        setBookings(prev => {
          const map = new Map<string, BookingItem>();
          [...removeLegacyDemoBooking(serverBookings), ...removeLegacyDemoBooking(prev)].forEach(b => map.set(b.id, b));
          return Array.from(map.values());
        });
      }
    });

    syncService.fetchPricingRules().then(serverRules => {
      if (serverRules) {
        setPricingRules(serverRules);
        storageService.savePricingRules(serverRules);
      }
    });

    syncService.fetchRoadAlert().then(serverAlert => {
      if (serverAlert) {
        setRoadAlert(serverAlert);
        storageService.saveRoadAlert(serverAlert);
      }
    });

    // 4. Subscribe to live cross-tab & admin events
    const unsub = syncService.onMessage((msg) => {
      if (msg.type === 'CUSTOM_REQUEST_CREATED') {
        const newReq = msg.payload as CustomTripRequest;
        setCustomRequests(prev => {
          if (prev.some(r => r.id === newReq.id || r.requestRef === newReq.requestRef)) return prev;
          return [newReq, ...prev];
        });
      } else if (msg.type === 'CUSTOM_REQUEST_APPROVED') {
        const approvedReq = msg.payload as CustomTripRequest;
        setCustomRequests(prev => prev.map(r => (r.id === approvedReq.id || r.requestRef === approvedReq.requestRef) ? approvedReq : r));
      } else if (msg.type === 'BOOKING_CONFIRMED') {
        const newBooking = msg.payload as BookingItem;
        setBookings(prev => {
          if (prev.some(b => b.id === newBooking.id || b.bookingRef === newBooking.bookingRef)) return prev;
          return [newBooking, ...prev];
        });
      } else if (msg.type === 'ROAD_ALERT_UPDATED') {
        setRoadAlert(msg.payload);
      } else if (msg.type === 'PRICING_RULES_UPDATED') {
        setPricingRules(msg.payload);
      } else if (msg.type === 'PACKAGES_UPDATED') {
        setPackages(msg.payload);
      } else if (msg.type === 'STAYS_UPDATED') {
        setStays(msg.payload);
      } else if (msg.type === 'GUIDES_UPDATED') {
        setGuides(msg.payload);
      } else if (msg.type === 'DESTINATIONS_UPDATED') {
        setDestinations(msg.payload);
      }
    });

    return () => unsub();
  }, []);

  // Active paying custom request
  const [activePayingCustomReq, setActivePayingCustomReq] = useState<CustomTripRequest | null>(null);

  // Modal States
  const [selectedDestDetail, setSelectedDestDetail] = useState<Destination | null>(null);
  const [selectedBookingStay, setSelectedBookingStay] = useState<Stay | null>(null);
  const [isStayBookingOpen, setIsStayBookingOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState<boolean>(false);
  const [isPostMemoryOpen, setIsPostMemoryOpen] = useState<boolean>(false);
  const [selectedReelFromMini, setSelectedReelFromMini] = useState<ReelPost | null>(null);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutData, setCheckoutData] = useState<{
    itemType: 'package' | 'transit';
    title: string;
    destination: string;
    totalAmount: number;
    travelers: number;
    travelDate: string;
    customizedDays?: ItineraryDay[];
    packageItem?: TourPackage;
    transitItem?: TransitOption;
    customSchedule?: CustomTripDayPlan[];
  } | null>(null);

  // User Auth Actions with Pending Continuation Hook
  const [pendingAction, setPendingAction] = useState<((profile: UserProfile) => void) | null>(null);

  const handleOpenAuth = (prompt?: string, onCompleteAction?: (profile: UserProfile) => void) => {
    setAuthPromptMessage(prompt || 'Sign in with your mobile number to view and manage your passes.');
    if (onCompleteAction) {
      setPendingAction(() => onCompleteAction);
    } else {
      setPendingAction(null);
    }
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        action(profile);
      }, 100);
    }
  };

  const handleLogoutUser = () => {
    signOutTraveler();
    setUserProfile(null);
    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: 'Signed Out',
      message: 'You have signed out of your traveler profile.',
      priority: 'low'
    });
  };

  // Synchronize Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers for Destinations
  const handleOpenDestination = (destId: DestinationId) => {
    const dest = destinations.find(d => d.id === destId);
    if (dest) setSelectedDestDetail(dest);
  };

  const handleUpdateDestination = (updatedDest: Destination) => {
    setDestinations(prev => {
      const next = prev.map(d => d.id === updatedDest.id ? updatedDest : d);
      syncService.saveDestinations(next);
      firestoreService.saveCatalog('destinations', next);
      syncService.broadcast('DESTINATIONS_UPDATED', next);
      return next;
    });
  };

  const handleCreateDestination = (newDest: Destination) => {
    setDestinations(prev => {
      const next = [newDest, ...prev];
      syncService.saveDestinations(next);
      firestoreService.saveCatalog('destinations', next);
      syncService.broadcast('DESTINATIONS_UPDATED', next);
      return next;
    });
  };

  const handleDeleteDestination = (destId: string) => {
    setDestinations(prev => {
      const next = prev.filter(d => d.id !== destId);
      syncService.saveDestinations(next);
      firestoreService.saveCatalog('destinations', next);
      syncService.broadcast('DESTINATIONS_UPDATED', next);
      return next;
    });
  };

  const handleRestoreDefaultDestinations = () => {
    setDestinations(DESTINATIONS);
    syncService.saveDestinations(DESTINATIONS);
    firestoreService.saveCatalog('destinations', DESTINATIONS);
    syncService.broadcast('DESTINATIONS_UPDATED', DESTINATIONS);
    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: 'Sacred Hubs Catalog Restored',
      message: 'All 8 Himachal sacred destination hubs loaded into catalog and synced to cloud.',
      priority: 'normal'
    });
  };

  // Handlers for Packages
  const handleUpdatePackage = (updatedPkg: TourPackage) => {
    setPackages(prev => {
      const next = prev.map(p => p.id === updatedPkg.id ? updatedPkg : p);
      syncService.savePackages(next);
      firestoreService.saveCatalog('packages', next);
      syncService.broadcast('PACKAGES_UPDATED', next);
      return next;
    });
  };

  const handleCreatePackage = (newPkg: TourPackage) => {
    setPackages(prev => {
      const next = [newPkg, ...prev];
      syncService.savePackages(next);
      firestoreService.saveCatalog('packages', next);
      syncService.broadcast('PACKAGES_UPDATED', next);
      return next;
    });
  };

  const handleDeletePackage = (pkgId: string) => {
    setPackages(prev => {
      const next = prev.filter(p => p.id !== pkgId);
      syncService.savePackages(next);
      firestoreService.saveCatalog('packages', next);
      syncService.broadcast('PACKAGES_UPDATED', next);
      return next;
    });
  };

  // Handlers for Stays
  const handleUpdateStay = (updatedStay: Stay) => {
    setStays(prev => {
      const next = prev.map(s => s.id === updatedStay.id ? updatedStay : s);
      syncService.saveStays(next);
      firestoreService.saveCatalog('stays', next);
      syncService.broadcast('STAYS_UPDATED', next);
      return next;
    });
  };

  const handleCreateStay = (newStay: Stay) => {
    setStays(prev => {
      const next = [newStay, ...prev];
      syncService.saveStays(next);
      firestoreService.saveCatalog('stays', next);
      syncService.broadcast('STAYS_UPDATED', next);
      return next;
    });
  };

  const handleDeleteStay = (stayId: string) => {
    setStays(prev => {
      const next = prev.filter(s => s.id !== stayId);
      syncService.saveStays(next);
      firestoreService.saveCatalog('stays', next);
      syncService.broadcast('STAYS_UPDATED', next);
      return next;
    });
  };

  const handleToggleStay = (stayId: string) => {
    setStays(prev => {
      const next = prev.map(s => s.id === stayId ? { ...s, isHandpicked: !s.isHandpicked } : s);
      syncService.saveStays(next);
      firestoreService.saveCatalog('stays', next);
      syncService.broadcast('STAYS_UPDATED', next);
      return next;
    });
  };

  // Handlers for Guides (NO PERSONAL CONTACT DETAILS STORED)
  const handleUpdateGuide = (updatedGuide: LocalGuide) => {
    setGuides(prev => {
      const next = prev.map(g => g.id === updatedGuide.id ? updatedGuide : g);
      syncService.saveGuides(next);
      firestoreService.saveCatalog('guides', next);
      syncService.broadcast('GUIDES_UPDATED', next);
      return next;
    });
  };

  const handleCreateGuide = (newGuide: LocalGuide) => {
    setGuides(prev => {
      const next = [newGuide, ...prev];
      syncService.saveGuides(next);
      firestoreService.saveCatalog('guides', next);
      syncService.broadcast('GUIDES_UPDATED', next);
      return next;
    });
  };

  const handleDeleteGuide = (guideId: string) => {
    setGuides(prev => {
      const next = prev.filter(g => g.id !== guideId);
      syncService.saveGuides(next);
      firestoreService.saveCatalog('guides', next);
      syncService.broadcast('GUIDES_UPDATED', next);
      return next;
    });
  };

  const handleUpdateRoadAlert = (alertText: string) => {
    setRoadAlert(alertText);
    storageService.saveRoadAlert(alertText);
    syncService.saveRoadAlert(alertText);
    firestoreService.saveCatalog('road_alert', alertText);
    syncService.broadcast('ROAD_ALERT_UPDATED', alertText);
    notificationEngine.notifyRoadWeatherAlert('Broadcasted Road Advisory', alertText);
  };

  const handleHeroSearch = (params: { destination: string; date: string; travelers: number; category: string }) => {
    if (params.category === 'stays') {
      const elem = document.getElementById('homestays');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      const pkg = packages.find(p => p.destinationId === params.destination);
      if (pkg) {
        const elem = document.getElementById('custom-packages');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        const dest = destinations.find(d => d.id === params.destination);
        if (dest) setSelectedDestDetail(dest);
      }
    }
  };

  const handleCustomPackageCheckout = (details: {
    packageItem: TourPackage;
    customizedDays: ItineraryDay[];
    calculatedTotal: number;
    travelers: number;
    travelDate: string;
  }) => {
    const launchCheckout = () => {
      setActivePayingCustomReq(null);
      setCheckoutData({
        itemType: 'package',
        title: details.packageItem.title,
        destination: details.packageItem.destination,
        totalAmount: details.calculatedTotal,
        travelers: details.travelers,
        travelDate: details.travelDate,
        customizedDays: details.customizedDays,
        packageItem: details.packageItem
      });
      setIsCheckoutOpen(true);
    };

    if (!userProfile?.isLoggedIn) {
      handleOpenAuth("Please sign in with Google to secure your trip pass and link booking history.", launchCheckout);
      return;
    }
    launchCheckout();
  };

  // Submit new custom trip request from Traveler -> Syncs to Server & Admin Panel
  const handleSubmitCustomRequest = (reqData: Omit<CustomTripRequest, 'id' | 'requestRef' | 'status' | 'adminQuotedPrice' | 'adminCuratedSchedule' | 'submittedAt'>) => {
    const newRequest: CustomTripRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      requestRef: (reqData as any).requestRef || `REQ-HN-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending_review',
      adminQuotedPrice: 0,
      adminCuratedSchedule: [],
      submittedAt: new Date().toISOString().split('T')[0]
    };

    // 1. Update local state
    const nextReqs = [newRequest, ...customRequests];
    setCustomRequests(nextReqs);

    // 2. Post to Backend Server, Cloud Firestore & Broadcast to Admin Panel
    syncService.postCustomRequest(newRequest);
    firestoreService.saveCatalog('custom_requests', nextReqs);
    syncService.broadcast('CUSTOM_REQUEST_CREATED', newRequest);

    // 3. Dispatch Enterprise Notification Alert
    notificationEngine.notifyCustomRequestCreated(newRequest);
  };

  // Admin approves & curates day schedule and quote -> Syncs to Server & User
  const handleApproveCustomRequest = async (requestId: string, price: number, schedule: CustomTripDayPlan[], notes: string) => {
    let approvedReq: CustomTripRequest | null = null;
    const nextReqs = customRequests.map(req => {
      if (req.id === requestId) {
        approvedReq = {
          ...req,
          status: 'approved' as const,
          adminQuotedPrice: price,
          adminCuratedSchedule: schedule,
          adminNotes: notes,
          approvedAt: new Date().toISOString().split('T')[0]
        };
        return approvedReq;
      }
      return req;
    });
    setCustomRequests(nextReqs);

    if (approvedReq) {
      // 1. Post approval to Server, Cloud Firestore & Broadcast
      syncService.approveCustomRequest(requestId, price, schedule, notes);
      firestoreService.saveCatalog('custom_requests', nextReqs);
      syncService.broadcast('CUSTOM_REQUEST_APPROVED', approvedReq);

      const emailRequest = nextReqs.find((request) => request.id === requestId);
      if (!emailRequest) return;

      try {
        const emailResponse = await fetch('/api/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            travelerEmail: emailRequest.travelerEmail,
            travelerName: emailRequest.travelerName,
            requestRef: emailRequest.requestRef,
            price: emailRequest.adminQuotedPrice
          })
        });
        if (!emailResponse.ok) {
          console.warn('Approval email was not sent:', await emailResponse.text());
        }
      } catch (error) {
        console.warn('Approval email request failed:', error);
      }

      // 2. Dispatch Enterprise Notification Alert
      notificationEngine.notifyCustomRequestApproved(approvedReq);
    }
  };

  // Traveler clicks "Review & Pay for Approved Custom Trip"
  const handlePayCustomTrip = (request: CustomTripRequest) => {
    const launchCustomTripCheckout = () => {
      setActivePayingCustomReq(request);
      setCheckoutData({
        itemType: 'package',
        title: `Custom Bespoke Expedition (${request.days}D/${request.nights}N)`,
        destination: request.selectedSpots.join(' → '),
        totalAmount: request.adminQuotedPrice,
        travelers: request.travelers,
        travelDate: request.startDate,
        customSchedule: request.adminCuratedSchedule
      });
      setIsCheckoutOpen(true);
    };

    if (!userProfile?.isLoggedIn) {
      handleOpenAuth("Please sign in with Google to finalize and secure your custom trip.", launchCustomTripCheckout);
      return;
    }
    launchCustomTripCheckout();
  };

  // When payment is authorized and confirmed -> Syncs to Server & Dispatches PDF pass
  const handleBookingSuccess = (newBooking: BookingItem) => {
    if (activePayingCustomReq) {
      newBooking.customDaySchedule = activePayingCustomReq.adminCuratedSchedule;
      const nextCustomReqs = customRequests.map(req => {
        if (req.id === activePayingCustomReq.id) {
          return {
            ...req,
            status: 'paid_finalized' as const,
            paidAt: new Date().toISOString().split('T')[0],
            bookingRef: newBooking.bookingRef
          };
        }
        return req;
      });
      setCustomRequests(nextCustomReqs);
      firestoreService.saveCatalog('custom_requests', nextCustomReqs);
    }

    const nextBookings = [newBooking, ...bookings];
    setBookings(nextBookings);

    // 1. Post to Server, Cloud Firestore & Broadcast
    syncService.postBooking(newBooking);
    firestoreService.saveCatalog('bookings', nextBookings);
    syncService.broadcast('BOOKING_CONFIRMED', newBooking);

    // 2. Dispatch 3-Tier Enterprise Notification Suite
    notificationEngine.notifyPaymentReceived(newBooking.paidAmount, newBooking.bookingRef, newBooking.primaryTraveler);
    notificationEngine.notifyBookingConfirmed(newBooking);
    notificationEngine.notifyTicketGenerated(newBooking);
  };

  const handleCancelBooking = (bookingId: string) => {
    const nextBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b);
    setBookings(nextBookings);
    firestoreService.saveCatalog('bookings', nextBookings);
    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: 'Booking Cancelled',
      message: `Reservation ${bookingId} has been cancelled and credit note issued.`,
      priority: 'normal'
    });
    alert("Cancellation request registered. Your refund credit note has been initiated.");
  };

  const handlePostSubmitted = (newReel: Partial<ReelPost>) => {
    const created: ReelPost = {
      id: `reel-${Date.now()}`,
      authorName: newReel.authorName || 'Traveler',
      authorHandle: newReel.authorHandle || '@nomad',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isCreator: false,
      isVerifiedTraveler: true,
      videoUrl: newReel.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-snow-capped-mountains-41566-large.mp4',
      posterImage: newReel.posterImage || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
      caption: newReel.caption || 'Unbelievable morning in Himachal!',
      location: newReel.location || 'Himachal Pradesh',
      destinationId: newReel.destinationId || 'manali',
      likes: 1,
      commentsCount: 0,
      datePosted: 'Just now',
      audioTrack: 'Acoustic Pahadi Beats'
    };
    setReels(prev => {
      const next = [created, ...prev];
      firestoreService.saveCatalog('reels', next);
      return next;
    });

    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: 'New Memory Published',
      message: `${created.authorName} posted a new memory from ${created.location}.`,
      priority: 'low'
    });
  };

  // Handler to import entire catalog from JSON backup and sync everywhere
  const handleImportFullCatalog = (catalog: {
    destinations?: Destination[];
    packages?: TourPackage[];
    stays?: Stay[];
    guides?: LocalGuide[];
    pricingRules?: PricingRules;
    roadAlert?: string;
    customRequests?: CustomTripRequest[];
    bookings?: BookingItem[];
    reels?: ReelPost[];
  }) => {
    if (catalog.destinations && Array.isArray(catalog.destinations)) {
      setDestinations(catalog.destinations);
      storageService.saveDestinations(catalog.destinations);
    }
    if (catalog.packages && Array.isArray(catalog.packages)) {
      setPackages(catalog.packages);
      storageService.savePackages(catalog.packages);
    }
    if (catalog.stays && Array.isArray(catalog.stays)) {
      setStays(catalog.stays);
      storageService.saveStays(catalog.stays);
    }
    if (catalog.guides && Array.isArray(catalog.guides)) {
      setGuides(catalog.guides);
      storageService.saveGuides(catalog.guides);
    }
    if (catalog.pricingRules) {
      setPricingRules(catalog.pricingRules);
      storageService.savePricingRules(catalog.pricingRules);
    }
    if (catalog.roadAlert) {
      setRoadAlert(catalog.roadAlert);
      storageService.saveRoadAlert(catalog.roadAlert);
    }
    if (catalog.customRequests && Array.isArray(catalog.customRequests)) {
      setCustomRequests(catalog.customRequests);
      storageService.saveCustomRequests(catalog.customRequests);
    }
    if (catalog.bookings && Array.isArray(catalog.bookings)) {
      const cleanBookings = removeLegacyDemoBooking(catalog.bookings);
      setBookings(cleanBookings);
      storageService.saveBookings(cleanBookings);
    }
    if (catalog.reels && Array.isArray(catalog.reels)) {
      setReels(catalog.reels);
    }

    if (firestoreService.isAvailable()) {
      firestoreService.pushAllLocalToCloud({
        destinations: catalog.destinations || destinations,
        packages: catalog.packages || packages,
        stays: catalog.stays || stays,
        guides: catalog.guides || guides,
        pricingRules: catalog.pricingRules || pricingRules,
        roadAlert: catalog.roadAlert || roadAlert,
        customRequests: catalog.customRequests || customRequests,
        bookings: catalog.bookings ? removeLegacyDemoBooking(catalog.bookings) : removeLegacyDemoBooking(bookings),
        reels: catalog.reels || reels
      });
    }
  };

  // --- RENDER DEDICATED ADMIN PANEL PAGE IF ON /admin ---
  if (currentRoute === 'admin') {
    return (
      <AdminPanelPage
        destinations={destinations}
        onUpdateDestination={handleUpdateDestination}
        onCreateDestination={handleCreateDestination}
        onDeleteDestination={handleDeleteDestination}
        onRestoreDefaultDestinations={handleRestoreDefaultDestinations}
        packages={packages}
        onUpdatePackage={handleUpdatePackage}
        onCreatePackage={handleCreatePackage}
        onDeletePackage={handleDeletePackage}
        stays={stays}
        onUpdateStay={handleUpdateStay}
        onCreateStay={handleCreateStay}
        onDeleteStay={handleDeleteStay}
        onToggleStay={handleToggleStay}
        guides={guides}
        onUpdateGuide={handleUpdateGuide}
        onCreateGuide={handleCreateGuide}
        onDeleteGuide={handleDeleteGuide}
        reels={reels}
        onDeleteReel={(reelId) => {
          setReels(prev => {
            const next = prev.filter(r => r.id !== reelId);
            firestoreService.saveCatalog('reels', next);
            return next;
          });
        }}
        bookings={userBookings}
        customRequests={userCustomRequests}
        onApproveCustomRequest={handleApproveCustomRequest}
        onSyncRequests={(updatedList) => setCustomRequests(updatedList)}
        roadAlert={roadAlert}
        onUpdateRoadAlert={handleUpdateRoadAlert}
        onNavigateToUserPanel={navigateToUser}
        onImportFullCatalog={handleImportFullCatalog}
      />
    );
  }

  // --- RENDER USER TRAVELER PORTAL PAGE IF ON / ---
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-pine-600 selection:text-white">
      {/* GLOBAL FULL-PAGE CINEMATIC MOUNTAIN & VIDEO CANVAS */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Full-Bleed Drone Mountain Video Loop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=85"
          className="w-full h-full object-cover object-center filter brightness-[0.9] dark:brightness-[0.45] transition-all duration-1000"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-snow-capped-mountains-41566-large.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* High-Resolution Authentic Himachal Mountain Pass Fallback Visual */}
        <img
          src="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=85"
          alt="Himachal Snow Passes and Rohtang Valleys"
          className="w-full h-full object-cover object-center absolute inset-0 -z-10"
        />

        {/* Global Ambient Lighting Gradient Overlay with High Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white/95 dark:from-slate-950/80 dark:via-slate-950/90 dark:to-slate-950 transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-topo-pattern opacity-25"></div>
      </div>

      {/* Sticky Header with Logo, Notification Center, and Navigation */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenMyBookings={() => {
          if (!userProfile?.isLoggedIn) {
            handleOpenAuth("Sign in with Google to access your confirmed passes & custom itineraries.");
          } else {
            setIsMyBookingsOpen(true);
          }
        }}
        onOpenWeatherSecurity={() => setIsRefundModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenAdmin={navigateToAdmin}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userProfile={userProfile}
        onOpenAuth={() => handleOpenAuth()}
        onLogoutUser={handleLogoutUser}
        roadAlert={roadAlert}
      />

      {/* Floating Mini Reel Window on Bottom-Left Side */}
      <MiniReelFloatingCard
        reels={reels}
        onOpenFullReel={(reel) => setSelectedReelFromMini(reel)}
        onNavigateToCommunity={() => {
          const elem = document.getElementById('peak-feed');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Floating Live Road Advisory & Alerts Dispatch Center on Right Side */}
      <FloatingAlertsWidget
        roadAlert={roadAlert}
        onOpenBookings={() => {
          if (!userProfile?.isLoggedIn) {
            handleOpenAuth("Sign in with your phone number to access your confirmed passes & custom itineraries.");
          } else {
            setIsMyBookingsOpen(true);
          }
        }}
        onOpenWeatherSecurity={() => setIsRefundModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section with 3D Depth Typography and Search */}
        <HeroSection
          destinations={destinations}
          onSearch={handleHeroSearch}
          onSelectDestination={handleOpenDestination}
        />

        {/* 2. 7 Destination Hubs Showcase (Customizable from Admin) */}
        <DestinationHubs
          destinations={destinations}
          onSelectDestination={handleOpenDestination}
          onBookDirect={(destName) => {
            const dest = destinations.find(d => d.name === destName);
            if (dest) setSelectedDestDetail(dest);
          }}
        />

        {/* 2.5 Handpicked Homestays & Stays Section */}
        <HandpickedStaysSection
          stays={stays}
          activeProfile={userProfile}
          onBookStay={(stay) => {
            setSelectedBookingStay(stay);
            setIsStayBookingOpen(true);
          }}
          onOpenAuth={() => handleOpenAuth("Please log in with your phone number to book handpicked stays.")}
        />

        {/* 3. 3D Parallax Mountain Scroll Banner */}
        <ParallaxBanner
          onExplorePackages={() => {
            const elem = document.getElementById('custom-packages');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Interactive Timeline & Bespoke Trip Studio */}
        <CustomPackageBuilder
          packages={packages}
          pricingRules={pricingRules}
          onProceedToCheckout={handleCustomPackageCheckout}
          onSubmitCustomRequest={handleSubmitCustomRequest}
          userProfile={userProfile}
          onOpenAuth={handleOpenAuth}
        />

        {/* 5. The Peak Feed (Dedicated Community Feed Section) */}
        <PeakFeedReels
          reels={reels}
          onOpenUploadModal={() => setIsPostMemoryOpen(true)}
          onNavigateToDestination={handleOpenDestination}
          selectedReelFromMini={selectedReelFromMini}
        />

        {/* 6. Local Pahadi Guides Section (Dynamic from state) */}
        <LocalGuidesSection guides={guides} />
      </main>

      {/* Footer */}
      <Footer
        destinations={destinations}
        onSelectDestination={handleOpenDestination}
        onOpenWeatherSecurity={() => setIsRefundModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenWeatherIntelligence={() => setIsRefundModalOpen(true)}
        onOpenAdmin={navigateToAdmin}
      />

      {/* MODALS & DRAWERS */}

      {/* 0. Stay Only Booking Modal */}
      {selectedBookingStay && (
        <StayBookingModal
          stay={selectedBookingStay}
          isOpen={isStayBookingOpen}
          onClose={() => {
            setIsStayBookingOpen(false);
            setSelectedBookingStay(null);
          }}
          activeProfile={userProfile}
          onOpenAuth={() => handleOpenAuth("Please log in to submit your stay booking request.")}
          onBookingSubmitted={(submittedBooking) => {
            setCustomRequests(prev => [submittedBooking, ...prev]);
            notificationEngine.addNotification({
              type: 'system_broadcast',
              title: 'Homestay Request Submitted',
              message: `Booking request for ${selectedBookingStay.name} is awaiting host validation.`,
              priority: 'normal'
            });
          }}
        />
      )}

      {/* 1. Destination Deep-Dive Modal */}
      <DestinationDetailModal
        destination={selectedDestDetail}
        stays={stays}
        guides={guides}
        onClose={() => setSelectedDestDetail(null)}
        onBookTour={(destName) => {
          setSelectedDestDetail(null);
          const elem = document.getElementById('custom-packages');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />


      {/* 3. Seamless Slide-In Checkout Drawer with Nomad Code Step */}
      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setActivePayingCustomReq(null);
        }}
        checkoutData={checkoutData}
        onBookingSuccess={handleBookingSuccess}
        userProfile={userProfile}
      />

      {/* 4. Post Memory Upload Modal */}
      <PostMemoryModal
        destinations={destinations}
        isOpen={isPostMemoryOpen}
        onClose={() => setIsPostMemoryOpen(false)}
        onPostSubmitted={handlePostSubmitted}
      />

      {/* 5. Comprehensive Separate Refund Policy Modal */}
      <RefundPolicyModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
      />

      {/* 6. Terms & Conditions (Nomad Code) Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* 7. My Bookings / Custom Trip Requests & Boarding Passes Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        customRequests={customRequests}
        onCancelBooking={handleCancelBooking}
        onPayCustomTrip={handlePayCustomTrip}
      />

      {/* 8. Mandatory User Phone Number & OTP Verification Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        promptMessage={authPromptMessage}
      />
    </div>
  );
}

export default App;
