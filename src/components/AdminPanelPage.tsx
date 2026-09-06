import React, { useState, useEffect } from 'react';
import { 
  TourPackage, 
  Stay, 
  ReelPost, 
  BookingItem, 
  CustomTripRequest, 
  CustomTripDayPlan, 
  Destination, 
  LocalGuide, 
  AppNotification, 
  DestinationId,
  AdminSession,
  PricingRules,
  PromoCode
} from '../types';
import { notificationEngine } from '../services/notificationEngine';
import { storageService } from '../utils/storageService';
import { syncService } from '../utils/syncService';
import { MediaUploader } from './MediaUploader';
import { HomestayGalleryUploader } from './HomestayGalleryUploader';
import { AdminInvoiceModal } from './AdminInvoiceModal';
import { AdminAuthLock } from './AdminAuthLock';
import { 
  Settings, 
  DollarSign, 
  Users, 
  Film, 
  MapPin, 
  Check, 
  Trash2, 
  Plus, 
  Radio, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  Edit2, 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Mail, 
  Ticket, 
  Sliders, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText,
  Compass,
  Bell,
  Eye,
  Layers,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  Languages,
  Home,
  Percent,
  Tag,
  ShieldCheck,
  LogOut,
  CreditCard,
  MessageCircle,
  Copy,
  ExternalLink,
  Printer,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Sun,
  Snowflake,
  CloudRain,
  Leaf,
  QrCode
} from 'lucide-react';

interface AdminPanelPageProps {
  destinations: Destination[];
  onUpdateDestination: (updatedDest: Destination) => void;
  onCreateDestination?: (newDest: Destination) => void;
  onDeleteDestination?: (destId: string) => void;
  packages: TourPackage[];
  onUpdatePackage: (updatedPkg: TourPackage) => void;
  onCreatePackage: (newPkg: TourPackage) => void;
  onDeletePackage: (pkgId: string) => void;
  stays: Stay[];
  onUpdateStay: (updatedStay: Stay) => void;
  onCreateStay: (newStay: Stay) => void;
  onDeleteStay: (stayId: string) => void;
  onToggleStay: (stayId: string) => void;
  guides: LocalGuide[];
  onUpdateGuide: (updatedGuide: LocalGuide) => void;
  onCreateGuide: (newGuide: LocalGuide) => void;
  onDeleteGuide: (guideId: string) => void;
  reels: ReelPost[];
  onCreateReel?: (newReel: ReelPost) => void;
  onDeleteReel: (reelId: string) => void;
  bookings: BookingItem[];
  onUpdateBookingStatus?: (bookingId: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;
  customRequests: CustomTripRequest[];
  onApproveCustomRequest: (requestId: string, price: number, schedule: CustomTripDayPlan[], notes: string) => void;
  onSyncRequests?: (updated: CustomTripRequest[]) => void;
  roadAlert: string;
  onUpdateRoadAlert: (alert: string) => void;
  onNavigateToUserPanel: () => void;
}

const COMMON_AMENITIES = [
  'Room Heater / Bukhari',
  '24/7 Geyser / Hot Water',
  'Panoramic Mountain View',
  'High-Speed Workation WiFi',
  'Bonfire Setup',
  'Home-Cooked Pahadi Meals',
  'Electric Heating Blanket',
  'Private Balcony',
  'Dedicated Workstation Desk',
  'Solar Water Heating',
  'Pet Friendly',
  'Secure Vehicle Parking',
  'Star Gazing Deck'
];

const GUIDE_LANGUAGES = [
  'Hindi',
  'Pahadi (Kulluvi/Mandyali)',
  'English',
  'Tibetan / Bhoti',
  'Spitian',
  'Punjabi'
];

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  destinations,
  onUpdateDestination,
  packages,
  onUpdatePackage,
  onCreatePackage,
  onDeletePackage,
  stays,
  onUpdateStay,
  onCreateStay,
  onDeleteStay,
  onToggleStay,
  guides,
  onUpdateGuide,
  onCreateGuide,
  onDeleteGuide,
  reels,
  onDeleteReel,
  bookings,
  customRequests,
  onApproveCustomRequest,
  onSyncRequests,
  roadAlert,
  onUpdateRoadAlert,
  onNavigateToUserPanel
}) => {
  // --- ROLE-BASED AUTHENTICATION STATE ---
  const [authSession, setAuthSession] = useState<AdminSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('hn_admin_session_v4');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<
    'custom_trips' | 'pricing' | 'bookings' | 'destinations' | 'packages' | 'stays' | 'guides' | 'reels' | 'broadcast' | 'alerts_stream'
  >('custom_trips');

  // --- DYNAMIC PRICING STATE ---
  const [pricingRules, setPricingRules] = useState<PricingRules>(() => storageService.loadPricingRules());
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => storageService.loadPromoCodes());
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  // --- BOOKING OPERATIONS STATE ---
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>('');
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<BookingItem | null>(null);

  // --- ROAD BROADCAST & SYNC STATE ---
  const [newRoadAlertText, setNewRoadAlertText] = useState(roadAlert);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [isApprovedRequestsExpanded, setIsApprovedRequestsExpanded] = useState<boolean>(false);
  const [liveAlerts, setLiveAlerts] = useState<AppNotification[]>([]);

  // --- CUSTOM TRIP CURATION DRAWER STATE ---
  const [selectedReqForCuration, setSelectedReqForCuration] = useState<CustomTripRequest | null>(null);
  const [curatedPrice, setCuratedPrice] = useState<number>(0);
  const [curatedNotes, setCuratedNotes] = useState<string>('');
  const [curatedSchedule, setCuratedSchedule] = useState<CustomTripDayPlan[]>([]);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  // --- MODAL STATES FOR EDITORS (WITH MEDIA UPLOADER) ---
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isCreatingDestination, setIsCreatingDestination] = useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isCreatingPackage, setIsCreatingPackage] = useState<boolean>(false);
  const [editingStay, setEditingStay] = useState<Stay | null>(null);
  const [isCreatingStay, setIsCreatingStay] = useState<boolean>(false);
  const [editingGuide, setEditingGuide] = useState<LocalGuide | null>(null);
  const [isCreatingGuide, setIsCreatingGuide] = useState<boolean>(false);
  const [isCreatingReel, setIsCreatingReel] = useState<boolean>(false);

  // New Reel Form State
  const [newReelVideo, setNewReelVideo] = useState<string>('');
  const [newReelPoster, setNewReelPoster] = useState<string>('');
  const [newReelCaption, setNewReelCaption] = useState<string>('');
  const [newReelLocation, setNewReelLocation] = useState<string>('Spiti Valley');
  const [newReelAuthor, setNewReelAuthor] = useState<string>('Monu Thakur');
  const [newReelHandle, setNewReelHandle] = useState<string>('@himachal.nomad');

  // New Destination / Package / Stay / Guide state holders for media uploads
  const [destHeroImage, setDestHeroImage] = useState<string>('');
  const [destDroneVideo, setDestDroneVideo] = useState<string>('');
  const [pkgImage, setPkgImage] = useState<string>('');
  const [stayImage, setStayImage] = useState<string>('');
  const [stayGalleryImages, setStayGalleryImages] = useState<string[]>([]);
  const [stayVideoUrl, setStayVideoUrl] = useState<string>('');
  const [stayAmenities, setStayAmenities] = useState<string[]>([]);
  const [guideAvatar, setGuideAvatar] = useState<string>('');
  const [guideVideo, setGuideVideo] = useState<string>('');
  const [guideLanguages, setGuideLanguages] = useState<string[]>([]);

  // Auto-sync custom requests from server
  const fetchLatestCustomRequests = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/custom-requests');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && onSyncRequests) {
          onSyncRequests(list);
          setLastSyncTime(new Date().toLocaleTimeString());
        }
      }
    } catch (e) {
      console.warn('Admin live sync fetch failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLatestCustomRequests();
    const interval = setInterval(fetchLatestCustomRequests, 3000);
    window.addEventListener('focus', fetchLatestCustomRequests);
    const unsub = notificationEngine.subscribe((list) => setLiveAlerts(list));
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchLatestCustomRequests);
      unsub();
    };
  }, []);

  // Save pricing rules & promo codes changes
  const handleSavePricingRules = (newRules: PricingRules) => {
    setPricingRules(newRules);
    storageService.savePricingRules(newRules);
    syncService.savePricingRules(newRules);
    syncService.broadcast('PRICING_RULES_UPDATED', newRules);
    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: 'Dynamic Pricing Multipliers Updated',
      message: `Global modifier set to ${newRules.globalMultiplierPercent > 0 ? '+' : ''}${newRules.globalMultiplierPercent}%.`,
      priority: 'normal'
    });
  };

  const handleApplySeasonPreset = (preset: PricingRules['seasonPreset']) => {
    let global = 0;
    let pkg = 0;
    let stay = 0;
    let transit = 0;
    let fuel = 0;

    if (preset === 'peak_summer') {
      global = 20;
      pkg = 20;
      stay = 25;
      transit = 15;
      fuel = 10;
    } else if (preset === 'winter_spiti') {
      global = 15;
      pkg = 15;
      stay = 10;
      transit = 25;
      fuel = 20;
    } else if (preset === 'autumn_valley') {
      global = 5;
      pkg = 5;
      stay = 5;
      transit = 5;
      fuel = 0;
    } else if (preset === 'monsoon_green') {
      global = -15;
      pkg = -15;
      stay = -20;
      transit = -10;
      fuel = 0;
    }

    const updated: PricingRules = {
      ...pricingRules,
      seasonPreset: preset,
      globalMultiplierPercent: global,
      packageModifierPercent: pkg,
      stayModifierPercent: stay,
      transitModifierPercent: transit,
      fuelSurchargePercent: fuel,
      updatedAt: new Date().toISOString()
    };
    handleSavePricingRules(updated);
  };

  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const newCode: PromoCode = {
      id: `promo-${Date.now()}`,
      code: (form.code?.value || 'DISCOUNT10').toUpperCase().trim(),
      discountPercent: Number(form.discount?.value) || 10,
      minTravelers: Number(form.minTravelers?.value) || 1,
      maxUses: Number(form.maxUses?.value) || 100,
      usedCount: 0,
      validUntil: form.validUntil?.value || '2026-12-31',
      isActive: true,
      applicableCategory: form.category?.value || 'all'
    };
    const updated = [newCode, ...promoCodes];
    setPromoCodes(updated);
    storageService.savePromoCodes(updated);
    setIsCreatingPromo(false);
  };

  const handleTogglePromoCode = (id: string) => {
    const updated = promoCodes.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    setPromoCodes(updated);
    storageService.savePromoCodes(updated);
  };

  const handleDeletePromoCode = (id: string) => {
    const updated = promoCodes.filter(p => p.id !== id);
    setPromoCodes(updated);
    storageService.savePromoCodes(updated);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hn_admin_session_v4');
    setAuthSession(null);
  };

  // If user is not authenticated yet, show secure lock screen
  if (!authSession) {
    return (
      <AdminAuthLock 
        onAuthenticated={(session) => setAuthSession(session)} 
        onExit={onNavigateToUserPanel} 
      />
    );
  }

  const isSuperAdmin = authSession.role === 'super_admin';
  const totalRevenue = bookings.reduce((acc, b) => b.status === 'Confirmed' ? acc + b.paidAmount : acc, 0);
  const pendingRequests = customRequests.filter(r => r.status === 'pending_review');
  const approvedRequests = customRequests.filter(r => r.status === 'approved' || r.status === 'paid_finalized');

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'all' || b.status.toLowerCase() === bookingFilterStatus.toLowerCase();
    const q = bookingSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      b.bookingRef.toLowerCase().includes(q) ||
      b.primaryTraveler.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q) ||
      b.destination.toLowerCase().includes(q) ||
      b.contactPhone.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // --- Handlers for Custom Trips ---
  const handleOpenCuration = (req: CustomTripRequest) => {
    setSelectedReqForCuration(req);
    setCuratedPrice(req.adminQuotedPrice > 0 ? req.adminQuotedPrice : req.targetBudgetPerPerson * req.travelers);
    setCuratedNotes(req.adminNotes || 'Tailored with private 4x4, curated homestays, and Monu local pass.');

    if (req.adminCuratedSchedule && req.adminCuratedSchedule.length > 0) {
      setCuratedSchedule(req.adminCuratedSchedule.map(s => ({ ...s })));
    } else {
      const daysCount = req.days;
      const initialSchedule: CustomTripDayPlan[] = [];
      for (let i = 1; i <= daysCount; i++) {
        if (i === 1) {
          initialSchedule.push({
            dayNumber: 1,
            title: `Arrival & Gateway Trail (${req.selectedSpots[0] || 'Manali'})`,
            plan: `Pick up traveler group (${req.travelers} Nomads) in ${req.preferredTransit}. Acclimatization walk through pine trails and local welcome tea.`,
            stay: req.preferredStayType,
            highlights: ['Acclimatization', 'Local Tea Tasting']
          });
        } else if (i === daysCount) {
          initialSchedule.push({
            dayNumber: i,
            title: `Summit Souvenirs & Departure Descent`,
            plan: `Morning breakfast with valley panoramic views, local handicraft stop, and seamless drop-off.`,
            stay: 'Departure',
            highlights: ['Souvenirs', 'Descent']
          });
        } else {
          const spotName = req.selectedSpots[(i - 1) % req.selectedSpots.length] || 'Scenic Pass';
          initialSchedule.push({
            dayNumber: i,
            title: `Exploration of ${spotName}`,
            plan: `Full day exploration of ${spotName} with local mountain guide, cultural monastery visit, and traditional pahadi lunch.`,
            stay: req.preferredStayType,
            highlights: [spotName, 'Monastery Lore']
          });
        }
      }
      setCuratedSchedule(initialSchedule);
    }
  };

  const handleUpdateScheduleDay = (index: number, field: keyof CustomTripDayPlan, value: any) => {
    const updated = [...curatedSchedule];
    updated[index] = { ...updated[index], [field]: value };
    setCuratedSchedule(updated);
  };

  const handleAddScheduleDay = () => {
    const nextDay = curatedSchedule.length + 1;
    setCuratedSchedule(prev => [
      ...prev,
      {
        dayNumber: nextDay,
        title: `Day ${nextDay} Mountain Exploration`,
        plan: `Guided exploration of scenic trails and authentic homestay stay.`,
        stay: selectedReqForCuration?.preferredStayType || 'Curated Homestay',
        highlights: ['Scenic Trail', 'Valley Views']
      }
    ]);
  };

  const handleRemoveScheduleDay = (index: number) => {
    setCuratedSchedule(prev => prev.filter((_, i) => i !== index).map((day, idx) => ({ ...day, dayNumber: idx + 1 })));
  };

  const handleSaveAndApproveRequest = () => {
    if (!selectedReqForCuration) return;
    if (curatedPrice <= 0) {
      alert("Please specify a valid approved price quote for the traveler!");
      return;
    }

    onApproveCustomRequest(selectedReqForCuration.id, curatedPrice, curatedSchedule, curatedNotes);
    setSelectedReqForCuration(null);
  };

  // Direct WhatsApp Generator
  const generateWhatsAppMessage = (req: CustomTripRequest, price: number, schedule: CustomTripDayPlan[], notes: string) => {
    let msg = `🏔️ *THE HIMACHAL NOMAD • CUSTOM TRIP ITINERARY*\n`;
    msg += `Namaste ${req.travelerName}! Here is your personalized itinerary curated by Monu.\n\n`;
    msg += `📋 *Ref:* ${req.requestRef}\n`;
    msg += `👥 *Travelers:* ${req.travelers} Nomads | ⏱️ *Duration:* ${req.days}D / ${req.nights}N\n`;
    msg += `🚗 *Transit:* ${req.preferredTransit} | 🏡 *Stay:* ${req.preferredStayType}\n`;
    msg += `💰 *All-Inclusive Quote:* ₹${price.toLocaleString('en-IN')}\n\n`;
    msg += `🗓️ *DAY-BY-DAY CURATED SCHEDULE:*\n`;
    schedule.forEach((day) => {
      msg += `*Day ${day.dayNumber}: ${day.title}*\n`;
      msg += `• Plan: ${day.plan}\n`;
      msg += `• Stay: ${day.stay}\n\n`;
    });
    msg += `📝 *Creator Note:* ${notes}\n\n`;
    msg += `✨ *Confirm & Secure Passes:* https://himachalnomad.com/#/custom-packages\n`;
    msg += `📞 *Direct Monu Ops:* +91 96532 40540`;
    return msg;
  };

  const handleOpenWhatsAppChat = () => {
    if (!selectedReqForCuration) return;
    const phone = selectedReqForCuration.travelerPhone.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = generateWhatsAppMessage(selectedReqForCuration, curatedPrice, curatedSchedule, curatedNotes);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyWhatsAppText = () => {
    if (!selectedReqForCuration) return;
    const text = generateWhatsAppMessage(selectedReqForCuration, curatedPrice, curatedSchedule, curatedNotes);
    navigator.clipboard.writeText(text);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 2500);
  };

  // --- Handlers for Catalog & Media Uploads ---
  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination) return;
    const updated = {
      ...editingDestination,
      heroImage: destHeroImage || editingDestination.heroImage,
      droneVideoPreview: destDroneVideo || editingDestination.droneVideoPreview
    };
    onUpdateDestination(updated);
    setEditingDestination(null);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackage) {
      const form = e.target as any;
      const title = form.pkgTitle?.value || editingPackage.title;
      const destination = form.pkgDestination?.value || editingPackage.destination;
      const duration = form.pkgDuration?.value || editingPackage.duration;
      const price = form.pkgPrice?.value ? Number(form.pkgPrice.value) : editingPackage.basePrice;

      let destId: DestinationId = editingPackage.destinationId || 'spiti';
      const destLower = destination.toLowerCase();
      if (destLower.includes('manali')) destId = 'manali';
      else if (destLower.includes('dharamshala') || destLower.includes('mcleod')) destId = 'dharamshala';
      else if (destLower.includes('shimla')) destId = 'shimla';
      else if (destLower.includes('kasol') || destLower.includes('kullu') || destLower.includes('jibhi')) destId = 'kullu';
      else if (destLower.includes('kinnaur')) destId = 'kinnaur';
      else if (destLower.includes('chamba')) destId = 'chamba';

      const updated: TourPackage = {
        ...editingPackage,
        title,
        destination,
        destinationId: destId,
        duration,
        basePrice: price,
        image: pkgImage || editingPackage.image
      };
      onUpdatePackage(updated);
      setEditingPackage(null);
      setPkgImage('');
    }
  };

  const handleCreatePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const pkgTitle = form.pkgTitle?.value || 'Himachal Expedition';
    const pkgDest = form.pkgDestination?.value || 'Spiti Valley';

    let destId: DestinationId = 'spiti';
    const destLower = pkgDest.toLowerCase();
    if (destLower.includes('manali')) destId = 'manali';
    else if (destLower.includes('dharamshala') || destLower.includes('mcleod')) destId = 'dharamshala';
    else if (destLower.includes('shimla')) destId = 'shimla';
    else if (destLower.includes('kasol') || destLower.includes('kullu') || destLower.includes('jibhi')) destId = 'kullu';
    else if (destLower.includes('kinnaur')) destId = 'kinnaur';
    else if (destLower.includes('chamba')) destId = 'chamba';

    const newPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      title: pkgTitle,
      destination: pkgDest,
      destinationId: destId,
      duration: form.pkgDuration?.value || '5 Days / 4 Nights',
      basePrice: Number(form.pkgPrice?.value) || 14999,
      image: pkgImage || 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      badge: form.pkgBadge?.value || 'Creator Special',
      overview: form.pkgOverview?.value || `Authentic guided expedition across ${pkgDest}. Handcrafted route, homestay stays, and local mountain expertise.`,
      highlights: form.pkgHighlights?.value
        ? form.pkgHighlights.value.split('\n').filter((h: string) => h.trim().length > 0)
        : [
            'Scenic high-altitude circuits and secret viewpoints',
            'Handpicked homestay stays with traditional meals',
            'Verified local mountain guide & 4x4 transit support'
          ],
      itinerary: []
    };
    onCreatePackage(newPkg);
    setIsCreatingPackage(false);
    setPkgImage('');
  };

  const handleSaveStay = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStay) {
      const form = e.target as any;
      const stayName = form.stayName?.value || editingStay.name;
      const stayLocation = form.stayLocation?.value || editingStay.location;
      const stayType = form.stayType?.value || editingStay.type;
      const stayPrice = form.stayPrice?.value ? Number(form.stayPrice.value) : editingStay.pricePerNight;

      let destId: DestinationId = editingStay.destinationId || 'spiti';
      const locLower = stayLocation.toLowerCase();
      if (locLower.includes('manali')) destId = 'manali';
      else if (locLower.includes('dharamshala') || locLower.includes('mcleod')) destId = 'dharamshala';
      else if (locLower.includes('shimla')) destId = 'shimla';
      else if (locLower.includes('kasol') || locLower.includes('kullu') || locLower.includes('jibhi')) destId = 'kullu';
      else if (locLower.includes('kinnaur')) destId = 'kinnaur';
      else if (locLower.includes('chamba')) destId = 'chamba';

      const chosenImage = stayImage || editingStay.imageUrl || editingStay.image || '';

      const updated: Stay = {
        ...editingStay,
        name: stayName,
        location: stayLocation,
        destinationId: destId,
        type: stayType,
        pricePerNight: stayPrice,
        imageUrl: chosenImage,
        image: chosenImage,
        galleryImages: stayGalleryImages.length > 0 ? stayGalleryImages : (editingStay.galleryImages || (chosenImage ? [chosenImage] : [])),
        videoUrl: stayVideoUrl !== undefined ? stayVideoUrl : editingStay.videoUrl,
        amenities: stayAmenities.length > 0 ? stayAmenities : editingStay.amenities
      };
      onUpdateStay(updated);
      setEditingStay(null);
      setStayImage('');
      setStayGalleryImages([]);
      setStayVideoUrl('');
      setStayAmenities([]);
    }
  };

  const handleCreateStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const stayName = form.stayName?.value || 'Handpicked Stay';
    const stayLoc = form.stayLocation?.value || 'Himachal';

    let destId: DestinationId = 'spiti';
    const locLower = stayLoc.toLowerCase();
    if (locLower.includes('manali')) destId = 'manali';
    else if (locLower.includes('dharamshala') || locLower.includes('mcleod')) destId = 'dharamshala';
    else if (locLower.includes('shimla')) destId = 'shimla';
    else if (locLower.includes('kasol') || locLower.includes('kullu') || locLower.includes('jibhi')) destId = 'kullu';
    else if (locLower.includes('kinnaur')) destId = 'kinnaur';
    else if (locLower.includes('chamba')) destId = 'chamba';

    const chosenImage = stayImage || (stayGalleryImages.length > 0 ? stayGalleryImages[0] : 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80');

    const newStay: Stay = {
      id: `stay-${Date.now()}`,
      name: stayName,
      location: stayLoc,
      destinationId: destId,
      type: form.stayType?.value || 'Boutique Homestay',
      pricePerNight: Number(form.stayPrice?.value) || 3500,
      rating: 4.9,
      reviewsCount: 1,
      imageUrl: chosenImage,
      image: chosenImage,
      galleryImages: stayGalleryImages.length > 0 ? stayGalleryImages : [chosenImage],
      videoUrl: stayVideoUrl || '',
      amenities: stayAmenities.length > 0 ? stayAmenities : ['Panoramic Mountain View', 'Room Heater / Bukhari', 'High-Speed Workation WiFi'],
      creatorNote: 'Handpicked authentic stay with panoramic mountain views and local hospitality.',
      isHandpicked: true
    };
    onCreateStay(newStay);
    setIsCreatingStay(false);
    setStayImage('');
    setStayGalleryImages([]);
    setStayVideoUrl('');
    setStayAmenities([]);
  };

  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuide) {
      const form = e.target as any;
      const updated: LocalGuide = {
        ...editingGuide,
        name: form.guideName?.value || editingGuide.name,
        nickname: form.guideNickname?.value || editingGuide.nickname,
        destination: form.guideDestination?.value || editingGuide.destination,
        specialty: form.guideSpecialty?.value || editingGuide.specialty,
        avatar: guideAvatar || editingGuide.avatar,
        videoIntroUrl: guideVideo || editingGuide.videoIntroUrl,
        languages: guideLanguages.length > 0 ? guideLanguages : editingGuide.languages
      };
      onUpdateGuide(updated);
      setEditingGuide(null);
      setGuideAvatar('');
      setGuideVideo('');
      setGuideLanguages([]);
    }
  };

  const handleCreateGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const newGuide: LocalGuide = {
      id: `guide-${Date.now()}`,
      name: form.guideName?.value || 'Local Mountain Guide',
      nickname: form.guideNickname?.value || 'Chacha',
      destination: form.guideDestination?.value || 'Manali & Spiti',
      experienceYears: Number(form.guideExp?.value) || 5,
      languages: guideLanguages.length > 0 ? guideLanguages : ['Hindi', 'Pahadi', 'English'],
      specialty: form.guideSpecialty?.value || 'High Pass 4x4 & Monastery Lore',
      avatar: guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      videoIntroUrl: guideVideo || '',
      bio: form.guideBio?.value || 'Lifelong Himachal local with deep knowledge of high altitude passes and trails.',
      badge: form.guideBadge?.value || 'Certified Mountain Guide'
    };
    onCreateGuide(newGuide);
    setIsCreatingGuide(false);
    setGuideAvatar('');
    setGuideVideo('');
    setGuideLanguages([]);
  };

  const handleCreateReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelVideo) {
      alert("Please upload or provide a video for the new reel!");
      return;
    }
    const created: ReelPost = {
      id: `reel-${Date.now()}`,
      authorName: newReelAuthor,
      authorHandle: newReelHandle,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isCreator: true,
      isVerifiedTraveler: true,
      videoUrl: newReelVideo,
      posterImage: newReelPoster || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
      caption: newReelCaption || 'Live alpine snow loop from the high passes!',
      location: newReelLocation,
      destinationId: 'spiti',
      likes: 42,
      commentsCount: 6,
      datePosted: 'Just now',
      audioTrack: 'Authentic Pahadi Beats'
    };
    if (reels) {
      reels.unshift(created);
    }
    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: 'New Reel Published to Peak Feed',
      message: `${created.authorName} uploaded a new reel from ${created.location}.`,
      priority: 'normal'
    });
    setIsCreatingReel(false);
    setNewReelVideo('');
    setNewReelPoster('');
    setNewReelCaption('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      
      {/* Top Header Bar with Role Indicator */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pine-600 text-white shadow-lg">
            <Compass className="w-6 h-6 animate-float" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                The Himachal Nomad • Creator Operations
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                isSuperAdmin 
                  ? 'bg-amber-950 text-amber-300 border-amber-800' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {isSuperAdmin ? 'SUPER ADMIN (MASTER)' : 'OPERATIONS ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as <strong>{authSession.adminName}</strong> • Direct WhatsApp: <strong>+91 96532 40540</strong>
            </p>
          </div>
        </div>

        {/* Top Actions: Lock / Logout & Return */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToUserPanel}
            className="btn-3d px-4 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Traveler Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl font-bold text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Lock & Logout Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto my-6 flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'custom_trips', label: 'Curation Engine', icon: Sparkles, count: pendingRequests.length },
          { id: 'pricing', label: 'Dynamic Pricing & Promos', icon: Percent },
          { id: 'bookings', label: 'Bookings & Invoicing', icon: Ticket, count: bookings.length },
          { id: 'destinations', label: 'Destinations', icon: MapPin },
          { id: 'packages', label: 'Tour Packages', icon: Layers },
          { id: 'stays', label: 'Homestays & Stays', icon: Home },
          { id: 'guides', label: 'Mountain Guides', icon: Users },
          { id: 'reels', label: 'The Peak Feed (Reels)', icon: Film },
          { id: 'broadcast', label: 'Road Advisory & Passes', icon: Radio },
          { id: 'alerts_stream', label: 'Notification Logs', icon: Bell, count: liveAlerts.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-pine-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white text-pine-900' : 'bg-pine-950 text-pine-300 border border-pine-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto">

        {/* ================= TAB 1: CUSTOM TRIP CURATION ENGINE & DIRECT WHATSAPP ================= */}
        {activeTab === 'custom_trips' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>Custom Trip Planner & Direct Curation Studio</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-extrabold uppercase">
                    Live Engine
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review traveler requests from the interactive widget, build custom day itineraries, and send direct WhatsApp quotes.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={fetchLatestCustomRequests}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync ({lastSyncTime})</span>
                </button>
              </div>
            </div>

            {/* Pending Requests Queue */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Pending Review Requests ({pendingRequests.length})</span>
              </h4>

              {pendingRequests.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-300">All Custom Trip Requests Curated!</p>
                  <p className="text-xs text-slate-500 mt-1">New submissions from the custom builder will appear here live.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-900">
                              {req.requestRef}
                            </span>
                            {req.requestType === 'stay_only' && (
                              <span className="text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 flex items-center gap-1">
                                <Home className="w-3 h-3 text-emerald-400" />
                                <span>STAY ONLY BOOKING</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-extrabold text-white mt-1">
                            {req.travelerName || req.userName || 'Nomad Traveler'}
                          </h4>
                          <p className="text-xs text-slate-400">
                            📞 {req.travelerPhone || req.phone || req.userPhone} • ✉️ {req.travelerEmail || req.email || req.userEmail}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800">
                          {req.requestType === 'stay_only' ? 'Stay Awaiting Approval' : 'Pending Quote'}
                        </span>
                      </div>

                      {req.requestType === 'stay_only' ? (
                        <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-bold">{req.stayName || 'Handpicked Stay'}</span>
                            <span className="text-slate-400">{req.stayLocation || req.destination}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Dates</span>
                              <strong>{req.checkInDate} to {req.checkOutDate}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Rooms / Guests</span>
                              <strong>{req.roomsCount || 1} Room(s) • {req.guestCount || req.travelerCount || 2} Guests</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Estimated Quote</span>
                              <strong className="text-emerald-400">{req.budget || ('₹' + req.estimatedPrice)}</strong>
                            </div>
                          </div>
                          {req.specialNotes && (
                            <p className="text-xs text-amber-200/90 italic bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                              Notes: "{req.specialNotes}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl text-xs text-slate-300">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Nomads</span>
                            <strong>{req.travelers} Persons</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Duration</span>
                            <strong>{req.days}D / {req.nights}N</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Target Budget</span>
                            <strong>₹{req.targetBudgetPerPerson}/p</strong>
                          </div>
                        </div>
                      )}

                      {req.requestType !== 'stay_only' && (
                        <div className="text-xs space-y-1 text-slate-300">
                          <p><strong>Spots:</strong> {req.selectedSpots?.join(', ') || 'Custom Circuit'}</p>
                          <p><strong>Transit:</strong> {req.preferredTransit} | <strong>Stay:</strong> {req.preferredStayType}</p>
                          {req.specialWishes && (
                            <p className="text-amber-200/90 italic bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                              "{req.specialWishes}"
                            </p>
                          )}
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                        <span className="text-[11px] text-slate-500">Submitted: {req.submittedAt || req.createdAt?.split('T')[0] || 'Today'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenCuration(req)}
                            className="btn-3d px-4 py-1.5 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{req.requestType === 'stay_only' ? 'Review & Approve Stay' : 'Curate Itinerary & Quote'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved & Finalized Custom Requests */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => setIsApprovedRequestsExpanded(!isApprovedRequestsExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-extrabold text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approved & Paid Custom Trips ({approvedRequests.length})</span>
                </div>
                {isApprovedRequestsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isApprovedRequestsExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">{req.requestRef}</span>
                          <h5 className="text-sm font-extrabold text-white">{req.travelerName}</h5>
                          <p className="text-xs text-slate-400">{req.travelerPhone}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          req.status === 'paid_finalized' 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                            : 'bg-pine-950 text-pine-300 border-pine-800'
                        }`}>
                          {req.status === 'paid_finalized' ? 'PAID & FINALIZED' : 'APPROVED QUOTE'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex justify-between bg-slate-950 p-2 rounded-xl">
                        <span>Quoted Price: <strong>₹{req.adminQuotedPrice.toLocaleString('en-IN')}</strong></span>
                        <span>Party: <strong>{req.travelers} Nomads ({req.days}D)</strong></span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => handleOpenCuration(req)}
                          className="text-xs text-amber-400 hover:underline font-bold"
                        >
                          Modify Curation
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReqForCuration(req);
                            setCuratedPrice(req.adminQuotedPrice);
                            setCuratedSchedule(req.adminCuratedSchedule);
                            setCuratedNotes(req.adminNotes || '');
                            handleOpenWhatsAppChat();
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: DYNAMIC PRICING & PROMO CODES ================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                    <span>Dynamic Pricing & Seasonality Multipliers</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Set real-time percentage multipliers for high altitude fuel, peak snow seasons, and special group adjustments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Active Multiplier:</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold ${
                    pricingRules.globalMultiplierPercent >= 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {pricingRules.globalMultiplierPercent > 0 ? `+${pricingRules.globalMultiplierPercent}%` : `${pricingRules.globalMultiplierPercent}%`}
                  </span>
                </div>
              </div>

              {/* Season Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Seasonality Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'peak_summer', label: 'Peak Summer (+20%)', icon: Sun, color: 'hover:border-amber-400' },
                    { id: 'winter_spiti', label: 'Winter White Spiti (+15%)', icon: Snowflake, color: 'hover:border-cyan-400' },
                    { id: 'autumn_valley', label: 'Autumn Golden (+5%)', icon: Leaf, color: 'hover:border-amber-500' },
                    { id: 'monsoon_green', label: 'Monsoon Discount (-15%)', icon: CloudRain, color: 'hover:border-emerald-400' }
                  ].map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = pricingRules.seasonPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleApplySeasonPreset(preset.id as any)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-xs font-extrabold">{preset.label}</p>
                          <p className="text-[10px] text-slate-500">1-Click Auto Modifier</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Multiplier Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                
                {/* Global Multiplier */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-white">Global Price Modifier</label>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {pricingRules.globalMultiplierPercent > 0 ? `+${pricingRules.globalMultiplierPercent}%` : `${pricingRules.globalMultiplierPercent}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="50"
                    step="1"
                    value={pricingRules.globalMultiplierPercent}
                    onChange={(e) => handleSavePricingRules({
                      ...pricingRules,
                      globalMultiplierPercent: Number(e.target.value),
                      seasonPreset: 'custom',
                      updatedAt: new Date().toISOString()
                    })}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Applies universally to all base packages, homestays, and custom itineraries.
                  </p>
                </div>

                {/* Homestay Modifier */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-white">Homestay & Mud Cottage Modifier</label>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {pricingRules.stayModifierPercent > 0 ? `+${pricingRules.stayModifierPercent}%` : `${pricingRules.stayModifierPercent}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="50"
                    step="1"
                    value={pricingRules.stayModifierPercent}
                    onChange={(e) => handleSavePricingRules({
                      ...pricingRules,
                      stayModifierPercent: Number(e.target.value),
                      seasonPreset: 'custom',
                      updatedAt: new Date().toISOString()
                    })}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Adjusts nightly homestay rates for seasonal heating / winter fuel.
                  </p>
                </div>

                {/* High Pass Transit & Fuel Surcharge */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-white">High-Pass 4x4 / Fuel Surcharge</label>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {pricingRules.fuelSurchargePercent > 0 ? `+${pricingRules.fuelSurchargePercent}%` : `${pricingRules.fuelSurchargePercent}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={pricingRules.fuelSurchargePercent}
                    onChange={(e) => handleSavePricingRules({
                      ...pricingRules,
                      fuelSurchargePercent: Number(e.target.value),
                      seasonPreset: 'custom',
                      updatedAt: new Date().toISOString()
                    })}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Surcharge for Kunzum Pass snow chains & 4x4 mountain safari vehicles.
                  </p>
                </div>

                {/* Live Simulator Preview */}
                <div className="bg-pine-950/40 p-4 rounded-2xl border border-pine-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Real-Time Price Simulation</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span>₹24,999 Base Spiti Package:</span>
                      <strong className="text-white">
                        ₹{Math.round(24999 * (1 + pricingRules.globalMultiplierPercent / 100)).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>₹2,800/Night Kaza Homestay:</span>
                      <strong className="text-white">
                        ₹{Math.round(2800 * (1 + (pricingRules.globalMultiplierPercent + pricingRules.stayModifierPercent) / 100)).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Promo Codes Management Section */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Promo Codes & Creator Discounts</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Manage coupons for early birds, groups, and creator follower campaigns.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingPromo(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-pine-600 hover:bg-pine-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md font-mono font-extrabold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {promo.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {promo.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Min {promo.minTravelers} Traveler(s) • Used {promo.usedCount}/{promo.maxUses} times • Expires {promo.validUntil}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromoCode(promo.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          promo.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {promo.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeletePromoCode(promo.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Smart UPI Payment Gateway Settings */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Dynamic Smart UPI Payment Gateway (0% Fee)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Direct-to-bank UPI VPA used for generating dynamic QR codes, deep links, and UTR verifications.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>ACTIVE 0% FEE UPI</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Business UPI VPA (Payee Address)</label>
                  <input
                    type="text"
                    defaultValue={pricingRules.defaultUpiVpa || '9653240540@axl'}
                    onBlur={(e) => {
                      const updated = {
                        ...pricingRules,
                        defaultUpiVpa: e.target.value.trim() || '9653240540@axl',
                        updatedAt: new Date().toISOString()
                      };
                      handleSavePricingRules(updated);
                    }}
                    placeholder="e.g. 9653240540@axl or yourname@okaxis"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl font-mono text-emerald-400 font-bold outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    All traveler UPI QR codes & mobile deep links will direct funds straight to this UPI ID.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Business / Payee Display Name</label>
                  <input
                    type="text"
                    defaultValue={pricingRules.businessName || 'The Himachal Nomad'}
                    onBlur={(e) => {
                      const updated = {
                        ...pricingRules,
                        businessName: e.target.value.trim() || 'The Himachal Nomad',
                        updatedAt: new Date().toISOString()
                      };
                      handleSavePricingRules(updated);
                    }}
                    placeholder="e.g. The Himachal Nomad"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Display name shown inside Google Pay, PhonePe, and Paytm receipts.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: BOOKING OPERATIONS & INVOICING ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-amber-400" />
                    <span>Booking Operations, Payment Logs & GST Invoices</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time passenger manifests, payment status changes, and printable GST tax invoices for HP checkposts.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Confirmed Revenue</span>
                  <p className="text-xl font-extrabold text-emerald-400 font-mono">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={bookingSearchQuery}
                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                    placeholder="Search by Booking Ref, Traveler Name, Phone..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilterStatus(st)}
                      className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                        bookingFilterStatus === st ? 'bg-pine-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Traveler Details</th>
                      <th className="py-3 px-4">Expedition & Date</th>
                      <th className="py-3 px-4 text-right">Payment Log</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No bookings matching the current search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-850/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">
                            {b.bookingRef}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-extrabold text-white">{b.primaryTraveler}</p>
                            <p className="text-[11px] text-slate-400">📞 {b.contactPhone}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-200">{b.title}</p>
                            <p className="text-[11px] text-slate-400">
                              {b.destination} • {b.travelDate} ({b.passengers} Nomads)
                            </p>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <p className="font-mono font-extrabold text-emerald-400">
                              ₹{b.paidAmount.toLocaleString('en-IN')}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {b.paymentMethod} • {b.paymentDate}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              b.status === 'Confirmed' 
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                                : b.status === 'Completed'
                                  ? 'bg-blue-950 text-blue-300 border-blue-800'
                                  : 'bg-rose-950 text-rose-300 border-rose-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedBookingForInvoice(b)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1"
                                title="View & Print GST Invoice"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>GST Invoice</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 4: DESTINATIONS CATALOG ================= */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">Destination Hubs Management</h3>
                <p className="text-xs text-slate-400">Edit circuit information, regional tags, altitudes, and upload hero photos directly.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((dest) => (
                <div key={dest.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20 font-mono">
                      {dest.altitude}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <h4 className="text-base font-extrabold text-white">{dest.name}</h4>
                        <p className="text-xs text-amber-300">{dest.altitude} • {dest.temperature}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-300 line-clamp-2">{dest.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-emerald-400">From ₹{dest.startingPrice.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => {
                          setEditingDestination(dest);
                          setDestHeroImage(dest.heroImage);
                          setDestDroneVideo(dest.droneVideoPreview || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Hub</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: TOUR PACKAGES CATALOG ================= */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">Curated Tour Packages & Circuits</h3>
                <p className="text-xs text-slate-400">Update pricing, durations, route covers, and create new packages.</p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingPackage(true);
                  setPkgImage('');
                }}
                className="btn-3d px-4 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Launch New Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-44">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      {pkg.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-pine-700 text-[10px] font-bold text-white shadow">
                          {pkg.badge}
                        </span>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div>
                          <span className="text-[10px] text-amber-300 font-bold uppercase">{pkg.destination}</span>
                          <h4 className="text-sm font-extrabold text-white">{pkg.title}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Duration: {pkg.duration}</span>
                        <span className="font-extrabold text-emerald-400">₹{pkg.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">{pkg.overview}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                    <button
                      onClick={() => {
                        setEditingPackage(pkg);
                        setPkgImage(pkg.image);
                      }}
                      className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Package</span>
                    </button>
                    <button
                      onClick={() => onDeletePackage(pkg.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: HOMESTAYS & STAYS ================= */}
        {activeTab === 'stays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">Handpicked Homestays, Haveli & Glamping</h3>
                <p className="text-xs text-slate-400">Manage stay amenities, rates per night, and upload authentic room photos and videos.</p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingStay(true);
                  setStayImage('');
                  setStayAmenities(['Room Heater / Bukhari', '24/7 Geyser / Hot Water', 'Panoramic Mountain View']);
                }}
                className="btn-3d px-4 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Homestay / Stay</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stays.map((stay) => (
                <div key={stay.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-44">
                      <img src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300">
                        {stay.type}
                      </span>
                      <button
                        onClick={() => onToggleStay(stay.id)}
                        className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold ${
                          stay.isHandpicked ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {stay.isHandpicked ? '✓ Handpicked' : 'Standard'}
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-sm font-extrabold text-white">{stay.name}</h4>
                        <p className="text-xs text-slate-300">{stay.location}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-emerald-400">₹{stay.pricePerNight.toLocaleString('en-IN')}/night</span>
                        <span className="text-amber-400">★ {stay.rating} ({stay.reviewsCount} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {stay.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                            {a}
                          </span>
                        ))}
                        {stay.amenities.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{stay.amenities.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                    <button
                      onClick={() => {
                        setEditingStay(stay);
                        setStayImage(stay.imageUrl || stay.image || '');
                        setStayGalleryImages(stay.galleryImages || []);
                        setStayVideoUrl(stay.videoUrl || '');
                        setStayAmenities(stay.amenities || []);
                      }}
                      className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Stay & Photos</span>
                    </button>
                    <button
                      onClick={() => onDeleteStay(stay.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                      title="Delete Stay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: MOUNTAIN GUIDES ================= */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">Local Mountain Guides & Navigators</h3>
                <p className="text-xs text-slate-400">Manage verified local guides, languages, specialities, and upload profile photos.</p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingGuide(true);
                  setGuideAvatar('');
                  setGuideVideo('');
                  setGuideLanguages(['Hindi', 'Pahadi', 'English']);
                }}
                className="btn-3d px-4 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Local Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <div key={guide.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={guide.avatar} alt={guide.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-white">{guide.name}</h4>
                        {guide.nickname && <span className="text-xs text-amber-400">({guide.nickname})</span>}
                      </div>
                      <p className="text-xs text-slate-400">{guide.destination} • {guide.experienceYears} Years Exp</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-pine-950 text-pine-300 border border-pine-800">
                        {guide.specialty}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{guide.bio}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setEditingGuide(guide);
                        setGuideAvatar(guide.avatar);
                        setGuideVideo(guide.videoIntroUrl || '');
                        setGuideLanguages(guide.languages || []);
                      }}
                      className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => onDeleteGuide(guide.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 8: THE PEAK FEED (REELS MODERATION & CREATION) ================= */}
        {activeTab === 'reels' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">The Peak Feed • Reel Moderation & Studio</h3>
                <p className="text-xs text-slate-400">Moderate active travel reels, delete low quality videos, or directly upload new MP4 reels.</p>
              </div>
              <button
                onClick={() => setIsCreatingReel(true)}
                className="btn-3d px-4 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Reel</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {reels.map((reel) => (
                <div key={reel.id} className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[9/16] group">
                  <img src={reel.posterImage} alt={reel.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] text-white">
                    <span className="font-bold bg-black/60 px-2 py-0.5 rounded-full">{reel.location}</span>
                    <button
                      onClick={() => onDeleteReel(reel.id)}
                      className="p-1 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                      title="Delete / Moderate Reel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 text-white space-y-1">
                    <p className="text-xs font-bold line-clamp-2">{reel.caption}</p>
                    <p className="text-[10px] text-slate-300">By {reel.authorName} • {reel.likes} Likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: ROAD BROADCAST & MOUNTAIN PASSES ================= */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                <span>Himalayan Pass Status & Live Road Advisory Broadcast</span>
              </h3>
              <p className="text-xs text-slate-400">
                This advisory ticker updates across the top banner and sends real-time push alerts to all active travelers.
              </p>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Live Broadcast Advisory Message
                </label>
                <textarea
                  value={newRoadAlertText}
                  onChange={(e) => setNewRoadAlertText(e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-400"
                />

                <div className="flex flex-wrap gap-2">
                  {[
                    'Atal Tunnel & Kunzum Pass Open (Dry & Clear)',
                    'Kunzum Pass: 4x4 / Snow Chains Required due to fresh snowfall',
                    'Jalori Pass: Open for light vehicles only (Ice patches near Shoja)',
                    'Rohtang Pass: Clear with strict permit verification at Gulaba'
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setNewRoadAlertText(preset)}
                      className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onUpdateRoadAlert(newRoadAlertText)}
                    className="btn-3d px-5 py-2.5 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-2 shadow"
                  >
                    <Send className="w-4 h-4" />
                    <span>Broadcast Live Flash Advisory</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 10: NOTIFICATION LOGS ================= */}
        {activeTab === 'alerts_stream' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>Real-Time Operations Event Stream</span>
            </h3>
            <div className="space-y-2">
              {liveAlerts.map((alert) => (
                <div key={alert.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-white">{alert.title}</p>
                    <p className="text-slate-400 mt-0.5">{alert.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{alert.timeAgo || 'Just now'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: CUSTOM TRIP CURATION DRAWER ================= */}
      {selectedReqForCuration && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-pine-600 text-white">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <span>Curate Custom Expedition • {selectedReqForCuration.travelerName}</span>
                    <span className="text-xs font-mono text-amber-400">({selectedReqForCuration.requestRef})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Party: {selectedReqForCuration.travelers} Nomads • {selectedReqForCuration.days} Days / {selectedReqForCuration.nights} Nights
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReqForCuration(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Quote and Notes Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    All-Inclusive Approved Quote (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={curatedPrice}
                    onChange={(e) => setCuratedPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-extrabold text-base focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    Target was ₹{selectedReqForCuration.targetBudgetPerPerson * selectedReqForCuration.travelers} (₹{selectedReqForCuration.targetBudgetPerPerson}/person)
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Creator Note & Pass Inclusions
                  </label>
                  <input
                    type="text"
                    value={curatedNotes}
                    onChange={(e) => setCuratedNotes(e.target.value)}
                    placeholder="e.g. Private 4x4, Kunzum Pass permit, and homestays included."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Day-by-Day Scheduler */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    Day-by-Day Customized Itinerary Breakdown
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddScheduleDay}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold flex items-center gap-1 border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {curatedSchedule.map((day, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-extrabold text-xs flex items-center justify-center border border-amber-500/30">
                            {day.dayNumber}
                          </span>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => handleUpdateScheduleDay(idx, 'title', e.target.value)}
                            className="bg-transparent text-sm font-extrabold text-white border-b border-slate-700 focus:outline-none focus:border-amber-400 px-1 py-0.5"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleDay(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Remove Day"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={day.plan}
                          onChange={(e) => handleUpdateScheduleDay(idx, 'plan', e.target.value)}
                          placeholder="Activities, spots visited, mountain routes..."
                          className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={day.stay}
                            onChange={(e) => handleUpdateScheduleDay(idx, 'stay', e.target.value)}
                            placeholder="Overnight Stay / Homestay Name"
                            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                          />
                          <input
                            type="text"
                            value={day.highlights.join(', ')}
                            onChange={(e) => handleUpdateScheduleDay(idx, 'highlights', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="Highlights tags (comma separated)"
                            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions: WhatsApp Direct Connect & Save */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenWhatsAppChat}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Itinerary (+91 {selectedReqForCuration.travelerPhone})</span>
                </button>

                <button
                  onClick={handleCopyWhatsAppText}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{whatsappCopied ? 'Copied!' : 'Copy Itinerary'}</span>
                </button>
              </div>

              <button
                onClick={handleSaveAndApproveRequest}
                className="btn-3d px-6 py-2.5 rounded-xl bg-pine-600 hover:bg-pine-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Save & Approve Custom Quote</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: DESTINATION EDITOR WITH MEDIA UPLOADER ================= */}
      {editingDestination && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Edit Destination: {editingDestination.name}</h3>
              <button onClick={() => setEditingDestination(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Altitude</label>
                  <input
                    type="text"
                    value={editingDestination.altitude}
                    onChange={(e) => setEditingDestination({ ...editingDestination, altitude: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Temperature</label>
                  <input
                    type="text"
                    value={editingDestination.temperature}
                    onChange={(e) => setEditingDestination({ ...editingDestination, temperature: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={editingDestination.description}
                  onChange={(e) => setEditingDestination({ ...editingDestination, description: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              {/* Direct Media Upload for Destination Cover Photo */}
              <MediaUploader
                label="Hero Circuit Cover Photo (From Gallery or URL)"
                mediaUrl={destHeroImage}
                onMediaChange={(url) => setDestHeroImage(url)}
                accept="image"
                aspectRatio="wide"
                helperText="Upload any authentic landscape photo directly from your device gallery."
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDestination(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-xs font-extrabold text-white"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TOUR PACKAGE CREATOR / EDITOR ================= */}
      {(editingPackage || isCreatingPackage) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">
                {editingPackage ? `Edit Package: ${editingPackage.title}` : 'Launch New Tour Package'}
              </h3>
              <button
                onClick={() => {
                  setEditingPackage(null);
                  setIsCreatingPackage(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingPackage ? handleSavePackage : handleCreatePackageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300">Package Title</label>
                <input
                  name="pkgTitle"
                  type="text"
                  defaultValue={editingPackage?.title || ''}
                  placeholder="e.g. Spiti Valley 7-Day High Pass Expedition"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Destination</label>
                  <input
                    name="pkgDestination"
                    type="text"
                    defaultValue={editingPackage?.destination || 'Spiti Valley'}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Duration</label>
                  <input
                    name="pkgDuration"
                    type="text"
                    defaultValue={editingPackage?.duration || '7 Days / 6 Nights'}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Base Price (₹)</label>
                  <input
                    name="pkgPrice"
                    type="number"
                    defaultValue={editingPackage?.basePrice || 24999}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Direct Media Upload for Tour Package Cover Photo */}
              <MediaUploader
                label="Package Cover Photo (Direct from Gallery or URL)"
                mediaUrl={pkgImage}
                onMediaChange={(url) => setPkgImage(url)}
                accept="image"
                aspectRatio="wide"
                helperText="Upload any mountain pass, trek, or scenic circuit photo directly from your device."
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPackage(null);
                    setIsCreatingPackage(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-xs font-extrabold text-white"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: HOMESTAY CREATOR / EDITOR WITH CHECKLIST & PHOTO UPLOAD ================= */}
      {(editingStay || isCreatingStay) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">
                {editingStay ? `Edit Homestay: ${editingStay.name}` : 'List New Handpicked Homestay'}
              </h3>
              <button
                onClick={() => {
                  setEditingStay(null);
                  setIsCreatingStay(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingStay ? handleSaveStay : handleCreateStaySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Homestay / Stay Name</label>
                  <input
                    name="stayName"
                    type="text"
                    defaultValue={editingStay?.name || ''}
                    placeholder="e.g. Mud Haven Heritage Cottage"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Location</label>
                  <input
                    name="stayLocation"
                    type="text"
                    defaultValue={editingStay?.location || 'Kaza, Spiti Valley'}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Stay Type</label>
                  <select
                    name="stayType"
                    defaultValue={editingStay?.type || 'Boutique Homestay'}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Boutique Homestay">Boutique Homestay</option>
                    <option value="Luxury Glamping">Luxury Glamping</option>
                    <option value="Heritage Haveli">Heritage Haveli</option>
                    <option value="Mountain Villa">Mountain Villa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Price Per Night (₹)</label>
                  <input
                    name="stayPrice"
                    type="number"
                    defaultValue={editingStay?.pricePerNight || 2800}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Multi-Photo & Video Gallery Uploader matching Image 2 specifications */}
              <HomestayGalleryUploader
                coverImage={stayImage}
                galleryImages={stayGalleryImages}
                videoUrl={stayVideoUrl}
                onChange={(cover, gallery, video) => {
                  setStayImage(cover);
                  setStayGalleryImages(gallery);
                  if (video !== undefined) setStayVideoUrl(video);
                }}
              />

              {/* Interactive Amenities Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Amenities & Facilities Checklist
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_AMENITIES.map((amenity) => {
                    const isChecked = stayAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => {
                          if (isChecked) {
                            setStayAmenities(stayAmenities.filter(a => a !== amenity));
                          } else {
                            setStayAmenities([...stayAmenities, amenity]);
                          }
                        }}
                        className={`p-2 rounded-xl text-left text-[11px] font-bold border transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStay(null);
                    setIsCreatingStay(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-xs font-extrabold text-white"
                >
                  Save Homestay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MOUNTAIN GUIDE EDITOR / CREATOR ================= */}
      {(editingGuide || isCreatingGuide) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">
                {editingGuide ? `Edit Guide: ${editingGuide.name}` : 'Add Local Mountain Guide'}
              </h3>
              <button
                onClick={() => {
                  setEditingGuide(null);
                  setIsCreatingGuide(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingGuide ? handleSaveGuide : handleCreateGuideSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Full Name</label>
                  <input
                    name="guideName"
                    type="text"
                    defaultValue={editingGuide?.name || ''}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Pahadi Nickname / Call Sign</label>
                  <input
                    name="guideNickname"
                    type="text"
                    defaultValue={editingGuide?.nickname || ''}
                    placeholder="e.g. Monu, Chacha, Tenzin"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Base Destination</label>
                  <input
                    name="guideDestination"
                    type="text"
                    defaultValue={editingGuide?.destination || 'Manali & Spiti'}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Specialty</label>
                  <input
                    name="guideSpecialty"
                    type="text"
                    defaultValue={editingGuide?.specialty || 'High Pass 4x4 & Monastery Lore'}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Direct Media Upload for Guide Profile Avatar */}
              <MediaUploader
                label="Guide Profile Photo (Direct from Gallery or URL)"
                mediaUrl={guideAvatar}
                onMediaChange={(url) => setGuideAvatar(url)}
                accept="image"
                aspectRatio="square"
                helperText="Upload a portrait photo of the local guide from your device."
              />

              {/* Languages Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {GUIDE_LANGUAGES.map((lang) => {
                    const isChecked = guideLanguages.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => {
                          if (isChecked) {
                            setGuideLanguages(guideLanguages.filter(l => l !== lang));
                          } else {
                            setGuideLanguages([...guideLanguages, lang]);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          isChecked
                            ? 'bg-pine-950 border-pine-700 text-pine-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {lang} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingGuide(null);
                    setIsCreatingGuide(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-xs font-extrabold text-white"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REEL UPLOADER WITH DEVICE VIDEO & POSTER PICKER ================= */}
      {isCreatingReel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Publish New Reel to The Peak Feed</span>
              </h3>
              <button onClick={() => setIsCreatingReel(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300">Reel Caption & Hashtags</label>
                <input
                  type="text"
                  value={newReelCaption}
                  onChange={(e) => setNewReelCaption(e.target.value)}
                  placeholder="e.g. Rohtang Pass morning snow loop! #Spiti #Kunzum"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={newReelLocation}
                    onChange={(e) => setNewReelLocation(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Creator Name</label>
                  <input
                    type="text"
                    value={newReelAuthor}
                    onChange={(e) => setNewReelAuthor(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Direct Video Upload from Device Gallery */}
              <MediaUploader
                label="Reel Video File (MP4, WebM, MOV from Gallery)"
                mediaUrl={newReelVideo}
                onMediaChange={(url) => setNewReelVideo(url)}
                accept="video"
                aspectRatio="portrait"
                helperText="Upload any vertical/portrait mountain video reel directly from your device."
                required
              />

              {/* Optional Poster Image */}
              <MediaUploader
                label="Thumbnail Poster Image (Optional)"
                mediaUrl={newReelPoster}
                onMediaChange={(url) => setNewReelPoster(url)}
                accept="image"
                aspectRatio="portrait"
                helperText="Cover thumbnail shown before the video starts playing."
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingReel(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d px-5 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-xs font-extrabold text-white"
                >
                  Publish Reel Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROMO CODE CREATOR ================= */}
      {isCreatingPromo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Create New Promo Code</h3>
              <button onClick={() => setIsCreatingPromo(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromoCode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300">Coupon Code</label>
                <input
                  name="code"
                  type="text"
                  placeholder="e.g. MONU20"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Discount (%)</label>
                  <input
                    name="discount"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue="10"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Min Travelers</label>
                  <input
                    name="minTravelers"
                    type="number"
                    defaultValue="1"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Max Usage Cap</label>
                  <input
                    name="maxUses"
                    type="number"
                    defaultValue="100"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300">Valid Until</label>
                  <input
                    name="validUntil"
                    type="date"
                    defaultValue="2026-12-31"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300">Applicable To</label>
                <select
                  name="category"
                  defaultValue="all"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="all">All Services (Packages + Homestays)</option>
                  <option value="package">Tour Packages Only</option>
                  <option value="stay">Homestays Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingPromo(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pine-600 hover:bg-pine-500 text-xs font-extrabold text-white"
                >
                  Save Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINTABLE GST INVOICE ================= */}
      {selectedBookingForInvoice && (
        <AdminInvoiceModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}

    </div>
  );
};
