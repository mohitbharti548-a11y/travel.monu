export type DestinationId = 'manali' | 'spiti' | 'kaza' | 'dharamshala' | 'shimla' | 'kullu' | 'mandi' | 'kinnaur' | 'chamba';

export interface SecretSpot {
  title: string;
  description: string;
  coordinates?: string;
  bestTime: string;
  creatorTip: string;
}

export interface Stay {
  id: string;
  name: string;
  location: string;
  destinationId: DestinationId;
  type: 'Boutique Homestay' | 'Luxury Glamping' | 'Heritage Haveli' | 'Mountain Villa';
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: string[];
  creatorNote: string;
  isHandpicked: boolean;
}

export interface LocalGuide {
  id: string;
  name: string;
  nickname: string;
  destination: string;
  experienceYears: number;
  languages: string[];
  specialty: string;
  avatar: string;
  videoIntroUrl?: string;
  bio: string;
  badge: string;
}

export interface Destination {
  id: DestinationId;
  name: string;
  takriName?: string;
  hindiName: string;
  tagline: string;
  altitude: string;
  temperature: string;
  bestTimeToVisit: string;
  heroImage: string;
  droneVideoPreview?: string;
  description: string;
  mustVisitSpots: string[];
  secretSpot: SecretSpot;
  startingPrice: number;
  popularActivities: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  stayOption: {
    standard: string;
    luxuryUpgrade: string;
    upgradeCost: number;
  };
  selectedStay: 'standard' | 'luxury';
  activities: {
    id: string;
    name: string;
    cost: number;
    included: boolean;
    selected: boolean;
    icon?: string;
  }[];
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  destinationId: DestinationId;
  duration: string;
  basePrice: number;
  image: string;
  badge?: string;
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
}

export interface ReelPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isCreator: boolean;
  isVerifiedTraveler: boolean;
  videoUrl: string;
  posterImage: string;
  caption: string;
  location: string;
  destinationId?: DestinationId;
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  datePosted: string;
  audioTrack: string;
  liveUpdateStatus?: string;
}

export interface BookingItem {
  id: string;
  bookingRef: string;
  itemType: 'package' | 'flight' | 'bus' | 'stay' | 'custom_trip' | 'transit';
  title: string;
  destination: string;
  travelDate: string;
  passengers: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  customizationDetails?: {
    upgrades: string[];
    addOns: string[];
  };
  customDaySchedule?: CustomTripDayPlan[];
  contactEmail: string;
  contactPhone: string;
  primaryTraveler: string;
}

export interface TransitOption {
  id: string;
  type: 'flight' | 'bus';
  operator: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  amenities: string[];
  badge?: string;
}

export interface CustomTripDayPlan {
  dayNumber: number;
  title: string;
  plan: string;
  stay: string;
  highlights: string[];
}

export interface CustomTripRequest {
  id: string;
  requestRef: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelers: number;
  days: number;
  nights: number;
  targetBudgetPerPerson: number;
  selectedSpots: string[];
  preferredStayType: 'On-Site Hotels' | 'Off-Site Hotels' | 'Homestay' | 'Boutique Cottage' | 'Luxury Glamping Dome' | 'Swiss Alpine Tent' | string;
  preferredTransit: 'Rentals' | 'Car Guides' | 'Rentals with a Guide' | 'Self Drive' | '4x4 High-Pass Safari' | 'Premier Volvo Sleeper' | 'Private Mountain Taxi' | string;
  specialWishes: string;
  startDate: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'paid_finalized';
  adminQuotedPrice: number;
  adminCuratedSchedule: CustomTripDayPlan[];
  adminNotes?: string;
  submittedAt: string;
  approvedAt?: string;
  paidAt?: string;
  bookingRef?: string;
}

// Enterprise Alert & Notification Engine Types
export type NotificationType = 
  | 'booking_confirmed'
  | 'ticket_generated'
  | 'custom_request_created'
  | 'custom_request_approved'
  | 'payment_received'
  | 'road_weather_alert'
  | 'system_broadcast';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  data?: {
    bookingRef?: string;
    requestRef?: string;
    amount?: number;
    destination?: string;
    travelerName?: string;
    linkAction?: 'open_bookings' | 'open_custom_requests' | 'open_weather';
  };
}

export type AdminRole = 'super_admin' | 'admin';

export interface AdminSession {
  role: AdminRole;
  adminName: string;
  loginTime: string;
  token: string;
}

export interface PricingRules {
  globalMultiplierPercent: number; // e.g., +15% or -10%
  packageModifierPercent: number;
  stayModifierPercent: number;
  transitModifierPercent: number;
  fuelSurchargePercent: number;
  seasonPreset: 'normal' | 'peak_summer' | 'autumn_valley' | 'winter_spiti' | 'monsoon_green' | 'custom';
  isDynamicPricingActive: boolean;
  updatedAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  minTravelers: number;
  maxUses: number;
  usedCount: number;
  validUntil: string;
  isActive: boolean;
  applicableCategory: 'all' | 'package' | 'stay' | 'transit' | 'custom_trip';
}

export interface UserProfile {
  phone: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  loginTime: string;
  token?: string;
}


