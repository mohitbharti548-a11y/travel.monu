import React, { useState, useMemo, useEffect } from 'react';
import { CustomTripRequest, UserProfile } from '../types';
import jsPDF from 'jspdf';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  MapPin, 
  Home, 
  Compass, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Mountain, 
  Activity,
  AlertTriangle,
  Info,
  Layers,
  Check,
  TrendingUp,
  Gauge,
  Droplets,
  Wind,
  Eye,
  Download,
  X,
  MessageCircle,
  Navigation,
  Phone,
  Lock
} from 'lucide-react';
import { InteractiveDynamicMap, MapSiteLocation, HIMACHAL_GPS_COORDINATES } from './InteractiveDynamicMap';

interface CustomTripWidgetProps {
  onSubmitRequest: (request: Omit<CustomTripRequest, 'id' | 'requestRef' | 'status' | 'adminQuotedPrice' | 'adminCuratedSchedule' | 'submittedAt'>) => void;
  userProfile?: UserProfile | null;
  onOpenAuth?: (prompt?: string) => void;
}

interface SiteItem {
  id: string;
  name: string;
  type: string;
  altitude: number; // in meters
  driveFromBaseHours: number;
}

interface PlaceRegion {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  icon: string;
  baseAltitude: number;
  mapX: number; // SVG map coordinates 0-100
  mapY: number;
  sites: SiteItem[];
}

const HIMACHAL_REGIONS: PlaceRegion[] = [
  {
    id: 'manali',
    name: 'Manali & Solang',
    hindiName: 'मनाली',
    tagline: 'Valley of the Gods, Cedar Woods & High Pass Gateway',
    icon: '🌲',
    baseAltitude: 2050,
    mapX: 48,
    mapY: 38,
    sites: [
      { id: 'm1', name: 'Old Manali Heritage Village & Cafes', type: 'Village / Culture', altitude: 2050, driveFromBaseHours: 0.2 },
      { id: 'm2', name: 'Jogini Waterfalls Pine Trail', type: 'Waterfall / Nature', altitude: 2200, driveFromBaseHours: 0.5 },
      { id: 'm3', name: 'Sethan Igloo Village & Apple Orchards', type: 'Snow & Culture', altitude: 2700, driveFromBaseHours: 1.0 },
      { id: 'm4', name: 'Atal Tunnel North Portal & Sissu Waterfall', type: 'High Pass / Scenic', altitude: 3100, driveFromBaseHours: 1.2 },
      { id: 'm5', name: 'Solang Valley Snow Activity Point', type: 'Adventure', altitude: 2400, driveFromBaseHours: 0.6 },
      { id: 'm6', name: 'Hampta Pass Trekking Trailhead', type: 'High Alpine Trek', altitude: 3000, driveFromBaseHours: 1.5 },
      { id: 'm7', name: 'Hadimba Devi Ancient Wooden Temple', type: 'Heritage Temple', altitude: 2050, driveFromBaseHours: 0.3 },
      { id: 'm8', name: 'Vashisht Hot Sulfur Springs', type: 'Natural Springs', altitude: 2100, driveFromBaseHours: 0.4 }
    ]
  },
  {
    id: 'spiti',
    name: 'Spiti Valley & Kaza',
    hindiName: 'स्पीति घाटी',
    tagline: 'Cold Desert, 1000-Yr Gompas & Marine Fossils',
    icon: '🏔️',
    baseAltitude: 3650,
    mapX: 74,
    mapY: 32,
    sites: [
      { id: 's1', name: 'Key Monastery (1000-Year Gompa)', type: 'Sacred Monastery', altitude: 4166, driveFromBaseHours: 0.8 },
      { id: 's2', name: 'Chandratal Crescent Glacial Lake (4,300m)', type: 'Alpine Lake', altitude: 4300, driveFromBaseHours: 3.5 },
      { id: 's3', name: 'Hikkim World Highest Post Office (4,440m)', type: 'Iconic Landmark', altitude: 4440, driveFromBaseHours: 1.2 },
      { id: 's4', name: 'Komic Highest Inhabited Village & Tangyud Gompa', type: 'High Village', altitude: 4587, driveFromBaseHours: 1.4 },
      { id: 's5', name: 'Langza Giant Golden Buddha & Marine Fossils', type: 'Fossils & Buddha', altitude: 4400, driveFromBaseHours: 1.0 },
      { id: 's6', name: 'Dhankar Cliffside Monastery & Hidden Lake', type: 'Fortress Gompa', altitude: 3894, driveFromBaseHours: 1.5 },
      { id: 's7', name: 'Pin Valley National Park & Mudh Village', type: 'Wildlife Park', altitude: 3800, driveFromBaseHours: 2.2 },
      { id: 's8', name: 'Kibber Sanctuary & Chicham Suspension Bridge', type: 'High Bridge', altitude: 4270, driveFromBaseHours: 0.9 },
      { id: 's9', name: 'Kunzum Pass (4,551m Sacred Stupa)', type: 'High Mountain Pass', altitude: 4551, driveFromBaseHours: 2.8 },
      { id: 's10', name: 'Tabo Monastery (Ajanta of the Himalayas)', type: 'Ancient UNESCO Site', altitude: 3280, driveFromBaseHours: 2.0 }
    ]
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala & Kangra',
    hindiName: 'धर्मशाला',
    tagline: 'Tibetan Spiritual Hub & Dhauladhar Alpine Ridges',
    icon: '🧘',
    baseAltitude: 1750,
    mapX: 26,
    mapY: 36,
    sites: [
      { id: 'd1', name: 'McLeodGanj Dalai Lama Temple & Tsuglagkhang', type: 'Spiritual Center', altitude: 2082, driveFromBaseHours: 0.3 },
      { id: 'd2', name: 'Triund Ridge Alpine Sunset Trek (2,828m)', type: 'Panoramic Trek', altitude: 2828, driveFromBaseHours: 2.5 },
      { id: 'd3', name: 'Bhagsunag Waterfall & Mountain Cafe', type: 'Nature & Waterfall', altitude: 1900, driveFromBaseHours: 0.4 },
      { id: 'd4', name: 'Dharamkot Bohemian Village & Forest Meditation', type: 'Boho Village', altitude: 2100, driveFromBaseHours: 0.4 },
      { id: 'd5', name: 'Palampur 150-Year Heritage Tea Gardens', type: 'Tea Estates', altitude: 1220, driveFromBaseHours: 1.5 },
      { id: 'd6', name: 'Kangra Ancient Rock Fort & Brajeshwari Temple', type: 'Historic Fort', altitude: 733, driveFromBaseHours: 1.2 },
      { id: 'd7', name: 'Norbulingka Tibetan Cultural Art Institute', type: 'Art & Culture', altitude: 1350, driveFromBaseHours: 0.8 }
    ]
  },
  {
    id: 'kullu',
    name: 'Kullu, Tirthan & Kasol',
    hindiName: 'कुल्लू एवं तीर्थन',
    tagline: 'Trout Rivers, Pine Valleys, Jibhi & Parvati',
    icon: '🌊',
    baseAltitude: 1279,
    mapX: 50,
    mapY: 48,
    sites: [
      { id: 'k1', name: 'Tirthan Valley Riverfront & Trout Angling', type: 'Riverfront Nature', altitude: 1600, driveFromBaseHours: 1.2 },
      { id: 'k2', name: 'Jibhi Waterfall & Wooden Bridges', type: 'Hidden Valley', altitude: 1800, driveFromBaseHours: 1.5 },
      { id: 'k3', name: 'Jalori Pass & Serolsar Lake Trek (3,120m)', type: 'High Pass Lake', altitude: 3120, driveFromBaseHours: 2.0 },
      { id: 'k4', name: 'Great Himalayan National Park (UNESCO)', type: 'National Park', altitude: 2400, driveFromBaseHours: 1.8 },
      { id: 'k5', name: 'Kasol & Parvati Pine Riverbank Walks', type: 'Riverside Trails', altitude: 1580, driveFromBaseHours: 1.1 },
      { id: 'k6', name: 'Tosh High Village & Manikaran Hot Springs', type: 'Village & Springs', altitude: 2400, driveFromBaseHours: 1.8 },
      { id: 'k7', name: 'Naggar Historic Wood-Stone Castle & Art Gallery', type: 'Royal Heritage', altitude: 1800, driveFromBaseHours: 0.6 }
    ]
  },
  {
    id: 'shimla',
    name: 'Shimla & Kufri',
    hindiName: 'शिमला',
    tagline: 'Colonial Ridge, Cedar Forest Walks & Apple Orchards',
    icon: '🏛️',
    baseAltitude: 2276,
    mapX: 58,
    mapY: 72,
    sites: [
      { id: 'sh1', name: 'The Mall Road, Historic Ridge & Christ Church', type: 'Heritage Walk', altitude: 2276, driveFromBaseHours: 0.2 },
      { id: 'sh2', name: 'Jakhu Hanuman Temple & Giant Hilltop Statue', type: 'Hilltop Temple', altitude: 2455, driveFromBaseHours: 0.4 },
      { id: 'sh3', name: 'Kufri Snow Viewpoint & Nature Park', type: 'Snow Point', altitude: 2720, driveFromBaseHours: 0.8 },
      { id: 'sh4', name: 'Mashobra Quiet Cedar Forest Trail', type: 'Cedar Woods', altitude: 2146, driveFromBaseHours: 0.7 },
      { id: 'sh5', name: 'Narkanda & Hatu Peak Panoramic Temple (3,400m)', type: 'Peak Vista', altitude: 3400, driveFromBaseHours: 2.2 },
      { id: 'sh6', name: 'Chail Palace & World Highest Cricket Ground', type: 'Royal Palace', altitude: 2250, driveFromBaseHours: 1.8 }
    ]
  },
  {
    id: 'mandi',
    name: 'Mandi & Prashar Lake',
    hindiName: 'मंडी एवं पराशर',
    tagline: 'Sacred Floating Lakes & 81 Stone Temples',
    icon: '🛕',
    baseAltitude: 850,
    mapX: 44,
    mapY: 56,
    sites: [
      { id: 'md1', name: 'Prashar Lake Floating Island & Pagoda Temple', type: 'Sacred Alpine Lake', altitude: 2730, driveFromBaseHours: 2.2 },
      { id: 'md2', name: 'Rewalsar Sacred Lotus Lake (Tri-Religious)', type: 'Holy Lake', altitude: 1360, driveFromBaseHours: 1.0 },
      { id: 'md3', name: 'Barot Valley & Uhl River Hydro Reservoir', type: 'Hidden Valley', altitude: 1830, driveFromBaseHours: 2.0 },
      { id: 'md4', name: 'Bhootnath Temple & Beas River Ghats (Chhoti Kashi)', type: 'Ancient Temple', altitude: 850, driveFromBaseHours: 0.2 },
      { id: 'md5', name: 'Janjehli Valley Alpine Meadows & Apple Orchards', type: 'Offbeat Meadow', altitude: 2150, driveFromBaseHours: 2.5 }
    ]
  },
  {
    id: 'kinnaur',
    name: 'Kinnaur & Chitkul',
    hindiName: 'किन्नौर एवं छितकुल',
    tagline: 'Hindustan-Tibet Road, Apple Valleys & Last Indian Village',
    icon: '🍎',
    baseAltitude: 2700,
    mapX: 80,
    mapY: 64,
    sites: [
      { id: 'kn1', name: 'Chitkul (Last Inhabited Indian Village & Baspa River)', type: 'Last Village', altitude: 3450, driveFromBaseHours: 2.0 },
      { id: 'kn2', name: 'Kalpa & Sacred Kinner Kailash Sunrise Vista', type: 'Sacred Peak', altitude: 2960, driveFromBaseHours: 0.5 },
      { id: 'kn3', name: 'Sangla Valley & Kamru Ancient Wood Fort', type: 'Historic Fort', altitude: 2680, driveFromBaseHours: 1.2 },
      { id: 'kn4', name: 'Roghi Suicide Point & Cliff Hanger Road', type: 'Adventure Cliff', altitude: 2800, driveFromBaseHours: 0.6 },
      { id: 'kn5', name: 'Nako Lake & 11th-Century Monastery', type: 'Sacred Lake', altitude: 3662, driveFromBaseHours: 3.5 }
    ]
  },
  {
    id: 'chamba',
    name: 'Chamba, Khajjiar & Bharmour',
    hindiName: 'चंबा एवं खज्जियार',
    tagline: 'Mini Switzerland, 1000-Yr Royal Temples & Saach Pass',
    icon: '🏰',
    baseAltitude: 996,
    mapX: 25,
    mapY: 20,
    sites: [
      { id: 'ch1', name: 'Khajjiar Pine Meadow & Mini Switzerland Lake', type: 'Alpine Meadow & Lake', altitude: 1920, driveFromBaseHours: 0.8 },
      { id: 'ch2', name: 'Chamba Town & 10th-Century Laxmi Narayan Temple', type: 'Royal Heritage Temple', altitude: 996, driveFromBaseHours: 0.2 },
      { id: 'ch3', name: 'Chamera Emerald Lake & Speedboating Reservoir', type: 'Scenic Reservoir', altitude: 763, driveFromBaseHours: 1.0 },
      { id: 'ch4', name: 'Bharmour Chaurasi 84-Temple Complex (Sacred Capital)', type: 'Ancient Pilgrimage', altitude: 2100, driveFromBaseHours: 2.0 },
      { id: 'ch5', name: 'Manimahesh Kailash Sacred Glacial Lake (4,080m)', type: 'Holy High Trek', altitude: 4080, driveFromBaseHours: 5.5 },
      { id: 'ch6', name: 'Kalatop Wildlife Sanctuary & Deodar Canopy Ridge', type: 'Dense Forest & Wildlife', altitude: 2440, driveFromBaseHours: 0.6 },
      { id: 'ch7', name: 'Saach Pass High-Altitude Cliff Road (4,414m to Pangi)', type: 'Extreme Mountain Pass', altitude: 4414, driveFromBaseHours: 4.5 }
    ]
  }
];

// Background photography map keyed by destination region with authentic Himachal landscapes
const REGION_BACKGROUND_IMAGES: Record<string, string> = {
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=85',
  spiti: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=2000&q=85',
  dharamshala: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=85',
  kullu: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
  shimla: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=2000&q=85',
  mandi: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=2000&q=85',
  kinnaur: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=85',
  chamba: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=85'
};

export const CustomTripWidget: React.FC<CustomTripWidgetProps> = ({ 
  onSubmitRequest,
  userProfile,
  onOpenAuth
}) => {
  const [travelers, setTravelers] = useState<number>(2);
  const [days, setDays] = useState<number>(5);
  const [nights, setNights] = useState<number>(4);

  // Place & Sites Matrix State
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('manali');
  const [selectedSites, setSelectedSites] = useState<string[]>([
    'Old Manali Heritage Village & Cafes',
    'Atal Tunnel North Portal & Sissu Waterfall',
    'Jogini Waterfalls Pine Trail'
  ]);

  const [preferredStay, setPreferredStay] = useState<'On-Site Hotels' | 'Off-Site Hotels' | string>('On-Site Hotels');
  const [preferredTransit, setPreferredTransit] = useState<'Rentals' | 'Car Guides' | 'Rentals with a Guide' | string>('Rentals');
  const [startDate, setStartDate] = useState<string>('2026-09-20');
  const [specialWishes, setSpecialWishes] = useState<string>('');
  
  // Traveler contact info for Monu's quote (Auto-populated from User Profile if logged in)
  const [travelerName, setTravelerName] = useState<string>(userProfile?.name || 'Ramesh Sharma');
  const [travelerPhone, setTravelerPhone] = useState<string>(userProfile?.phone ? `+${userProfile.phone}` : '+91 98765 43210');
  const [travelerEmail, setTravelerEmail] = useState<string>(userProfile?.email || 'ramesh@example.com');

  useEffect(() => {
    if (userProfile && userProfile.isLoggedIn) {
      if (userProfile.name) setTravelerName(userProfile.name);
      if (userProfile.phone) setTravelerPhone(`+${userProfile.phone}`);
      if (userProfile.email) setTravelerEmail(userProfile.email);
    }
  }, [userProfile]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const activeRegion = HIMACHAL_REGIONS.find(r => r.id === selectedPlaceId) || HIMACHAL_REGIONS[0];

  // Map selected site names to full SiteItem objects with altitude and region
  const selectedSiteObjects = useMemo(() => {
    const list: { site: SiteItem; region: PlaceRegion }[] = [];
    HIMACHAL_REGIONS.forEach(region => {
      region.sites.forEach(site => {
        if (selectedSites.includes(site.name)) {
          list.push({ site, region });
        }
      });
    });
    return list;
  }, [selectedSites]);

  // Unique regions selected
  const chosenRegions = useMemo(() => {
    const regionSet = new Set<string>();
    selectedSiteObjects.forEach(item => regionSet.add(item.region.name));
    return Array.from(regionSet);
  }, [selectedSiteObjects]);

  const chosenRegionObjects = useMemo(() => {
    const ids = Array.from(new Set(selectedSiteObjects.map(i => i.region.id)));
    return HIMACHAL_REGIONS.filter(r => ids.includes(r.id));
  }, [selectedSiteObjects]);

  // Convert selected sites to MapSiteLocations with real GPS coordinates
  const mapSiteLocations: MapSiteLocation[] = useMemo(() => {
    if (selectedSiteObjects.length === 0) {
      // Default to active region sites
      const region = HIMACHAL_REGIONS.find(r => r.id === selectedPlaceId) || HIMACHAL_REGIONS[0];
      return region.sites.map(s => {
        const coords = HIMACHAL_GPS_COORDINATES[s.name] || { lat: 32.2432, lng: 77.1892 };
        return {
          id: s.id,
          name: s.name,
          regionName: region.name,
          altitude: s.altitude,
          lat: coords.lat,
          lng: coords.lng,
          type: s.type,
          isSelected: false
        };
      });
    }

    return selectedSiteObjects.map(({ region, site }) => {
      const coords = HIMACHAL_GPS_COORDINATES[site.name] || {
        lat: 31.5 + (region.mapY / 100) * 1.5,
        lng: 76.5 + (region.mapX / 100) * 2.0
      };
      return {
        id: site.id,
        name: site.name,
        regionName: region.name,
        altitude: site.altitude,
        lat: coords.lat,
        lng: coords.lng,
        type: site.type,
        isSelected: true
      };
    });
  }, [selectedSiteObjects, selectedPlaceId]);

  // Altitude calculations
  const maxAltitude = useMemo(() => {
    if (selectedSiteObjects.length === 0) return 2050;
    return Math.max(...selectedSiteObjects.map(item => item.site.altitude));
  }, [selectedSiteObjects]);

  const minAltitude = useMemo(() => {
    if (selectedSiteObjects.length === 0) return 2050;
    return Math.min(...selectedSiteObjects.map(item => item.site.altitude));
  }, [selectedSiteObjects]);

  // Estimated budget based on config
  const estimatedBudgetTotal = useMemo(() => {
    let ratePerDay = 3500;
    if (preferredStay === 'On-Site Hotels') ratePerDay += 1500;
    if (preferredStay === 'Off-Site Hotels') ratePerDay += 800;
    
    if (preferredTransit === 'Rentals') ratePerDay += 1200;
    if (preferredTransit === 'Car Guides') ratePerDay += 2000;
    if (preferredTransit === 'Rentals with a Guide') ratePerDay += 2800;

    return ratePerDay * days * travelers;
  }, [days, travelers, preferredStay, preferredTransit]);

  // INSTANT ROUTE FEASIBILITY VALIDATOR & ADVISORY
  const feasibilityMetrics = useMemo(() => {
    const regionCount = chosenRegions.length;
    const sitesCount = selectedSites.length;
    
    const hasSpiti = chosenRegions.some(r => r.includes('Spiti'));
    const hasDharamshala = chosenRegions.some(r => r.includes('Dharamshala'));
    const hasManali = chosenRegions.some(r => r.includes('Manali'));
    const hasShimla = chosenRegions.some(r => r.includes('Shimla'));

    let totalTransitHours = sitesCount * 1.2;
    if (hasSpiti && hasManali) totalTransitHours += 6.5; // Kunzum Pass transit
    if (hasDharamshala && hasManali) totalTransitHours += 6.0; // Mandi Kangra highway
    if (hasSpiti && hasDharamshala) totalTransitHours += 14.0; // Cross-state circuit

    const avgDailyDrive = Math.round((totalTransitHours / days) * 10) / 10;
    
    // Check specific critical warnings
    const warnings: string[] = [];
    let score = 95;

    // Warning: Spiti + Dharamshala in short duration
    if (hasSpiti && hasDharamshala && days < 6) {
      score -= 40;
      warnings.push(`⚠️ Feasibility Warning: Spiti Valley & Dharamshala are ~420km apart across high mountain passes. For a ${days}-day trip, this involves 14+ hours of continuous mountain driving with high altitude risks. Monu strongly recommends a minimum of 7-8 days or focusing on either the Spiti Circuit or Dharamshala/Kangra Valley.`);
    }

    // Warning: Spiti in <= 3 days
    if (hasSpiti && days <= 3) {
      score -= 35;
      warnings.push(`⚠️ Acclimatization Risk: Spiti Valley sits above 3,800m. A ${days}-day trip does not provide adequate gradual ascent time and risks Acute Mountain Sickness (AMS). Minimum 5 days recommended.`);
    }

    // Warning: Too many regions in too few days
    if (regionCount >= 3 && days <= 4) {
      score -= 25;
      warnings.push(`⚠️ Multi-Region Transit Warning: Covering ${regionCount} mountain regions (${chosenRegions.join(', ')}) in ${days} days means spending most of your holiday inside vehicles. Consider cutting 1 region for leisurely exploration.`);
    }

    let verdict = 'Optimal & Immersive Pace';
    let verdictColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    if (score < 65) {
      verdict = 'High Travel Distance / Infeasible Route';
      verdictColor = 'text-rose-400 bg-rose-950/80 border-rose-800 animate-pulse';
    } else if (score < 80) {
      verdict = 'High-Energy Mountain Sprint';
      verdictColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
    }

    return {
      score: Math.max(score, 45),
      avgDailyDrive,
      warnings,
      verdict,
      verdictColor
    };
  }, [chosenRegions, selectedSites, days]);

  const handleToggleSite = (siteName: string) => {
    if (selectedSites.includes(siteName)) {
      if (selectedSites.length > 1) {
        setSelectedSites(selectedSites.filter(s => s !== siteName));
      }
    } else {
      setSelectedSites([...selectedSites, siteName]);
    }
  };

  const handleSelectAllSitesInPlace = (region: PlaceRegion) => {
    const regionSiteNames = region.sites.map(s => s.name);
    const hasAll = regionSiteNames.every(name => selectedSites.includes(name));
    
    if (hasAll) {
      const remaining = selectedSites.filter(name => !regionSiteNames.includes(name));
      setSelectedSites(remaining.length > 0 ? remaining : [regionSiteNames[0]]);
    } else {
      const combined = Array.from(new Set([...selectedSites, ...regionSiteNames]));
      setSelectedSites(combined);
    }
  };

  const getSelectedCountForPlace = (region: PlaceRegion) => {
    const regionSiteNames = region.sites.map(s => s.name);
    return selectedSites.filter(s => regionSiteNames.includes(s)).length;
  };

  // Generate Draft Itinerary PDF
  const handleDownloadDraftPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 60, 45); // Pine Green
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("THE HIMACHAL NOMAD", 14, 18);
    doc.setFontSize(10);
    doc.text("Bespoke Himalayan Expedition • Draft Itinerary Brief", 14, 26);
    doc.text(`Ref: DRAFT-HN-${Math.floor(1000 + Math.random() * 9000)}`, 140, 18);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 26);

    // Traveler & Configuration Info
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text("1. Trip Configuration & Traveler Details", 14, 52);
    
    doc.setFontSize(10);
    doc.text(`Primary Traveler: ${travelerName || 'Nomad Explorer'} (${travelerPhone || 'Not specified'})`, 14, 62);
    doc.text(`Party Size: ${travelers} Nomad(s) | Duration: ${days} Days / ${nights} Nights`, 14, 70);
    doc.text(`Preferred Start Date: ${startDate} | Peak Elevation: ${maxAltitude}m`, 14, 78);
    doc.text(`Accommodations: ${preferredStay} | Mountain Transit: ${preferredTransit}`, 14, 86);
    doc.text(`Estimated Budget: Rs. ${estimatedBudgetTotal.toLocaleString('en-IN')}`, 14, 94);

    // Selected Sites Breakdown
    doc.setFontSize(12);
    doc.text(`2. Selected Places & Wishlist Sites (${selectedSites.length} spots)`, 14, 108);
    
    doc.setFontSize(9);
    let yPos = 118;
    selectedSiteObjects.forEach((item, idx) => {
      doc.text(`• ${item.site.name} (${item.region.name} - ${item.site.altitude}m) - ${item.site.type}`, 16, yPos);
      yPos += 7;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Pacing & Monu's Advisory
    yPos += 8;
    doc.setFontSize(12);
    doc.text("3. Pahadi Pacing & Feasibility Score", 14, yPos);
    yPos += 8;
    doc.setFontSize(9);
    doc.text(`Pacing Verdict: ${feasibilityMetrics.verdict} (${feasibilityMetrics.score}% Score)`, 14, yPos);
    yPos += 6;
    doc.text(`Estimated Daily Mountain Transit: ~${feasibilityMetrics.avgDailyDrive} hours/day`, 14, yPos);

    if (feasibilityMetrics.warnings.length > 0) {
      yPos += 8;
      doc.setTextColor(180, 83, 9);
      doc.text("Advisory Notes:", 14, yPos);
      yPos += 6;
      feasibilityMetrics.warnings.forEach(w => {
        const lines = doc.splitTextToSize(`* ${w}`, 180);
        doc.text(lines, 14, yPos);
        yPos += lines.length * 6;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Curated by Monu | Helpline: +91 96532 40540 | Instagram: @himachal.nomad", 14, 285);

    doc.save(`HimachalNomad-DraftItinerary-${travelerName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.isLoggedIn) {
      if (onOpenAuth) {
        onOpenAuth("Please verify your mobile number with OTP so Monu can send your customized itinerary and live updates!");
        return;
      }
    }

    if (!travelerName || !travelerPhone || !travelerEmail) {
      alert("Please provide your name, phone, and email so Monu can send your customized itinerary!");
      return;
    }

    const generatedRef = `REQ-HN-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(generatedRef);

    onSubmitRequest({
      requestRef: generatedRef,
      travelerName,
      travelerEmail,
      travelerPhone,
      travelers,
      days,
      nights,
      targetBudgetPerPerson: 18000,
      selectedSpots: selectedSites,
      preferredStayType: preferredStay,
      preferredTransit,
      specialWishes,
      startDate
    } as any);

    setIsSubmitted(true);
    setIsPreviewOpen(false);
  };

  const currentBgImage = REGION_BACKGROUND_IMAGES[selectedPlaceId] || REGION_BACKGROUND_IMAGES.manali;

  return (
    <div id="custom-studio" className="relative rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-8 md:p-10 transition-all duration-700">
      
      {/* Dynamic Destination Region Background Canvas with Direct High-Res Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-700">
        <img
          key={selectedPlaceId}
          src={currentBgImage}
          alt={activeRegion.name}
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.85] dark:brightness-[0.45] transition-all duration-700 animate-fadeIn"
        />
        {/* Soft lighting overlay so the customizer cards pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/92 to-white/95 dark:from-slate-950/90 dark:via-slate-950/92 dark:to-slate-950 transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-topo-pattern opacity-30"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-slate-200/80 dark:border-slate-800 pb-5 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" />
            <span>Live Scene: {activeRegion.name} ({activeRegion.hindiName})</span>
          </div>
          <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
            Design Your Bespoke Himachal Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">
            Pick your base places and explore specific sites under each to tailor a focused or multi-region route with live connected route mapping & feasibility intelligence.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="relative z-10 py-8 sm:py-12 text-center max-w-lg mx-auto space-y-4 animate-fadeIn">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Custom Trip Request Dispatched!
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2">
            Your request <strong className="font-mono text-pine-700 dark:text-pine-400">{submittedRef}</strong> for <strong>{days} Days / {nights} Nights</strong> ({travelers} Travelers) with <strong>{selectedSites.length} selected sites</strong> has been sent to <strong>Monu's Creator Studio</strong>.
          </p>
          
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 text-left space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold">
              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Next Steps in Workflow:</span>
            </div>
            <p>1. Monu reviews your selected places & sites to curate your day-by-day plan & quote.</p>
            <p>2. Once approved, you will receive an alert to review Monu's plan in "My Passes" and complete payment.</p>
            <p>3. Your official customized PDF ticket is instantly generated for you and Monu!</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-3d w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-xs bg-slate-100 dark:bg-slatehimachal-800 hover:bg-slate-200 dark:hover:bg-slatehimachal-700 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Configure Another Trip
            </button>
            <a
              href={`https://wa.me/919653240540?text=Hi%20Monu!%20I%20just%20submitted%20custom%20trip%20request%20${submittedRef}%20for%20${days}D/${nights}N.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>Notify Monu on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6 sm:space-y-8">
          
          {/* 1. Trip Dynamics Grid (Travelers & Duration) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* A. Travelers Count */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-pine-700 dark:text-amber-400" /> Travelers
                </span>
                <strong className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {travelers} {travelers === 1 ? 'Nomad' : 'Nomads'}
                </strong>
              </div>

              <div className="grid grid-cols-6 gap-1 sm:gap-2">
                {[1, 2, 3, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTravelers(num)}
                    className={`py-2.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center min-h-[40px] ${
                      travelers === num
                        ? 'bg-pine-700 text-white shadow-sm ring-2 ring-pine-700/30 font-black'
                        : 'bg-white dark:bg-slatehimachal-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slatehimachal-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* B. Duration (Days & Nights) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pine-700 dark:text-amber-400" /> Duration
                </span>
                <strong className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {days} Days / {nights} Nights
                </strong>
              </div>

              <div className="grid grid-cols-6 gap-1 sm:gap-2">
                {[3, 4, 5, 6, 7, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDays(d);
                      setNights(d - 1);
                    }}
                    className={`py-2.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center min-h-[40px] ${
                      days === d
                        ? 'bg-pine-700 text-white shadow-sm ring-2 ring-pine-700/30 font-black'
                        : 'bg-white dark:bg-slatehimachal-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slatehimachal-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 2. PLACES & SITES DISCOVERY MATRIX */}
          <div className="space-y-4 p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slatehimachal-850 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-pine-700 dark:text-amber-400" /> 1. Select Himachal Places & Destinations
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Click a place below to open its specific sites. You can select one place or combine multiple places!
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 font-extrabold text-[11px] sm:text-xs border border-pine-200 dark:border-pine-800">
                  {selectedSites.length} Sites Across {chosenRegions.length} Region(s)
                </span>
              </div>
            </div>

            {/* A. Place / Region Selector Grid (Optimized for Mobile Touch) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
              {HIMACHAL_REGIONS.map((region) => {
                const isCurrent = selectedPlaceId === region.id;
                const count = getSelectedCountForPlace(region);
                const hasSelected = count > 0;

                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedPlaceId(region.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] sm:min-h-[105px] ${
                      isCurrent
                        ? 'bg-pine-700 text-white shadow-md ring-2 ring-pine-700/30'
                        : hasSelected
                        ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-400 dark:border-pine-700 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-white dark:bg-slatehimachal-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-base sm:text-lg block mb-0.5">{region.icon}</span>
                      <strong className={`font-extrabold text-[11px] sm:text-xs block leading-tight line-clamp-1 ${isCurrent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {region.name}
                      </strong>
                      <span className={`text-[10px] font-bold block ${isCurrent ? 'text-white/80' : 'text-slate-400'}`}>
                        {region.hindiName}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between">
                      {hasSelected ? (
                        <span className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-pine-200 dark:bg-pine-900 text-pine-900 dark:text-pine-200'
                        }`}>
                          {count} sites
                        </span>
                      ) : (
                        <span className={`text-[9px] sm:text-[10px] ${isCurrent ? 'text-white/60' : 'text-slate-400'}`}>
                          0 chosen
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* B. Specific Sites Tray for Currently Active Place */}
            <div className="mt-4 p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slatehimachal-900 border-2 border-pine-200 dark:border-slate-700 space-y-3 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0">{activeRegion.icon}</span>
                  <div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5">
                      <span>Specific Sites in {activeRegion.name}</span>
                      <span className="text-xs text-pine-700 dark:text-amber-400 font-bold">({activeRegion.hindiName})</span>
                    </h5>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">{activeRegion.tagline} • Base Alt: {activeRegion.baseAltitude}m</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectAllSitesInPlace(activeRegion)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slatehimachal-800 dark:hover:bg-slatehimachal-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer text-center shrink-0"
                >
                  {getSelectedCountForPlace(activeRegion) === activeRegion.sites.length ? 'Deselect All in ' + activeRegion.name : 'Select All in ' + activeRegion.name}
                </button>
              </div>

              {/* Sites Checkbox Matrix with Altitudes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {activeRegion.sites.map((site) => {
                  const isChecked = selectedSites.includes(site.name);
                  return (
                    <div
                      key={site.id}
                      onClick={() => handleToggleSite(site.name)}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none min-h-[50px] ${
                        isChecked
                          ? 'bg-pine-50 dark:bg-pine-950/70 border-pine-600 dark:border-pine-500 shadow-sm'
                          : 'bg-slate-50/70 dark:bg-slatehimachal-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-pine-700 text-white' : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block leading-snug break-words">
                            {site.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                            {site.type}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 block">
                          {site.altitude}m
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. INTERACTIVE CONNECTED ROUTE MAP & ROUTE FEASIBILITY VALIDATOR */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-5 sm:space-y-6 shadow-xl">
            
            {/* A. Live Route Feasibility Validator Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-pine-800/60 text-pine-300 border border-pine-700 shrink-0">
                  <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-pine-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-white flex flex-wrap items-center gap-1.5">
                    <span>Route Feasibility & Pacing Validator</span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-pine-900 text-pine-300 font-mono">
                      By Monu
                    </span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    Real-time mountain transit calculation across {chosenRegions.length} region(s) and {days} days.
                  </p>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-extrabold flex items-center justify-center gap-1.5 self-start sm:self-auto ${feasibilityMetrics.verdictColor}`}>
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span>{feasibilityMetrics.verdict} ({feasibilityMetrics.score}% Score)</span>
              </div>
            </div>

            {/* Critical Feasibility Warnings */}
            {feasibilityMetrics.warnings.length > 0 && (
              <div className="space-y-2">
                {feasibilityMetrics.warnings.map((warn, i) => (
                  <div key={i} className="p-3 sm:p-3.5 rounded-2xl bg-amber-950/60 border-2 border-amber-500/70 text-amber-200 text-xs flex items-start gap-2.5 shadow-md">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">{warn}</p>
                  </div>
                ))}
              </div>
            )}

            {/* B. Connected Route Map Visualizer */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pine-400 shrink-0" /> Dynamic Route Map & Mountain Pass Corridors
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {mapSiteLocations.length} Pinned Sites • Pan & Zoom Enabled
                </span>
              </div>

              {/* Dynamic Leaflet Mountain Map */}
              <InteractiveDynamicMap
                sites={mapSiteLocations}
                height="280px"
                showConnectingRoute={true}
                onSelectSite={(siteName) => handleToggleSite(siteName)}
              />
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-pine-400" /> Peak Altitude
                </span>
                <strong className="text-base sm:text-lg font-extrabold text-white block">{maxAltitude.toLocaleString('en-IN')}m</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">{maxAltitude > 3800 ? 'High Alpine Zone ❄️' : 'Sub-Alpine Valley 🌲'}</span>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Est. Daily Drive
                </span>
                <strong className="text-base sm:text-lg font-extrabold text-amber-300 block">~{feasibilityMetrics.avgDailyDrive} hrs/day</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">Mountain ghat transit</span>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Wind className="w-3 h-3 text-sky-400" /> Oxygen Range
                </span>
                <strong className="text-base sm:text-lg font-extrabold text-sky-300 block">
                  {maxAltitude > 4200 ? '62% – 78%' : maxAltitude > 3000 ? '78% – 88%' : '88% – 95%'}
                </strong>
                <span className="text-[10px] text-slate-400 block leading-tight">Effective oxygen level</span>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-emerald-400" /> Hydration Goal
                </span>
                <strong className="text-base sm:text-lg font-extrabold text-emerald-300 block">3.5 – 4.5 L</strong>
                <span className="text-[10px] text-slate-400 block leading-tight">Essential in high passes</span>
              </div>
            </div>

            {/* DYNAMIC ALTITUDE PROFILE PROGRESSION GRAPH */}
            <div className="space-y-2 p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-pine-400" /> Elevation Profile ({minAltitude}m → {maxAltitude}m)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Pahadi Terrain</span>
              </div>

              <div className="h-18 sm:h-20 w-full relative flex items-end justify-between gap-1 pt-4 pb-2 px-1 sm:px-2 overflow-x-auto">
                <div className="absolute top-6 left-0 right-0 border-b border-dashed border-amber-500/40 flex justify-end pr-2 pointer-events-none">
                  <span className="text-[8px] sm:text-[9px] text-amber-400 font-mono">3,500m High Altitude Threshold</span>
                </div>

                {selectedSiteObjects.map((item, idx) => {
                  const heightPercent = Math.max(15, Math.min(100, ((item.site.altitude - 500) / 4200) * 100));
                  const isHigh = item.site.altitude > 3500;
                  return (
                    <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center group relative h-full justify-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all ${
                          isHigh 
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500' 
                            : 'bg-gradient-to-t from-pine-700 to-pine-400 group-hover:from-pine-600'
                        }`}
                      ></div>
                      <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] p-2 rounded-lg shadow-xl z-20 whitespace-nowrap border border-slate-700 pointer-events-none">
                        <strong className="font-bold">{item.site.name}</strong>
                        <span className="text-pine-300 font-mono">{item.site.altitude}m ({item.region.name})</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 font-mono">
                <span>Start: {minAltitude}m</span>
                <span>Ascent Pacing</span>
                <span>Peak: {maxAltitude}m</span>
              </div>
            </div>
          </div>

          {/* 4. Stay Tier & Transit Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Preferred Stay */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-4 h-4 text-pine-700 dark:text-amber-400" /> 2. Preferred Stay Type
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { 
                    id: 'On-Site Hotels', 
                    label: 'On-Site Hotels', 
                    desc: 'Direct hotel stay inside the circuit / resort with curated amenities' 
                  },
                  { 
                    id: 'Off-Site Hotels', 
                    label: 'Off-Site Hotels', 
                    desc: 'Peaceful boutique hotels situated in scenic valley outskirts' 
                  }
                ].map((stay) => (
                  <button
                    key={stay.id}
                    type="button"
                    onClick={() => setPreferredStay(stay.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer min-h-[70px] ${
                      preferredStay === stay.id
                        ? 'bg-pine-700 text-white shadow-sm ring-2 ring-pine-700/30'
                        : 'bg-white dark:bg-slatehimachal-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <strong className="block text-xs font-bold leading-tight">{stay.label}</strong>
                    <span className={`text-[10px] block mt-1 leading-snug ${preferredStay === stay.id ? 'text-white/80' : 'text-slate-400'}`}>
                      {stay.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Transit */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-pine-700 dark:text-amber-400" /> 3. Preferred Mountain Transit
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { 
                    id: 'Rentals', 
                    label: 'Rentals', 
                    desc: 'Self-drive 4x4 SUV / Bike rental' 
                  },
                  { 
                    id: 'Car Guides', 
                    label: 'Car Guides', 
                    desc: 'Dedicated vehicle with mountain guide' 
                  },
                  { 
                    id: 'Rentals with a Guide', 
                    label: 'Rentals with a Guide', 
                    desc: 'Self-drive rental escorted by guide' 
                  }
                ].map((transit) => (
                  <button
                    key={transit.id}
                    type="button"
                    onClick={() => setPreferredTransit(transit.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px] ${
                      preferredTransit === transit.id
                        ? 'bg-pine-700 text-white shadow-sm ring-2 ring-pine-700/30'
                        : 'bg-white dark:bg-slatehimachal-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <strong className="block text-xs font-bold leading-tight">{transit.label}</strong>
                      <span className={`text-[10px] block mt-1 leading-snug ${preferredTransit === transit.id ? 'text-white/80' : 'text-slate-400'}`}>
                        {transit.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 5. Special Wishes & Departure Date & Contact */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 sm:p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 text-slate-900 dark:text-white font-bold text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-pine-700 min-h-[42px]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Special Wishes or Secret Stops for Monu
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stargazing with Tenzin, Riverside trout angling, secret chai..."
                  value={specialWishes}
                  onChange={(e) => setSpecialWishes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 text-slate-900 dark:text-white text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-pine-700 min-h-[42px]"
                />
              </div>
            </div>

            {/* Traveler Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 text-slate-900 dark:text-white text-sm sm:text-xs font-bold focus:outline-none min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">WhatsApp Phone</label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 text-slate-900 dark:text-white text-sm sm:text-xs font-medium focus:outline-none min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  inputMode="email"
                  required
                  placeholder="traveler@example.com"
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 text-slate-900 dark:text-white text-sm sm:text-xs font-medium focus:outline-none min-h-[42px]"
                />
              </div>
            </div>
          </div>

          {/* 6. Action Controls: Preview Draft Itinerary & Dispatch Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">Draft Configuration</span>
              <strong className="text-base sm:text-lg font-extrabold text-pine-800 dark:text-pine-400 block">
                {travelers} Nomad(s) • {days}D/{nights}N • {selectedSites.length} Sites ({maxAltitude}m Peak)
              </strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Preview your draft itinerary or submit to Monu for day-by-day plan & direct quote.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="btn-3d w-full sm:w-auto px-5 py-3.5 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slatehimachal-800 hover:bg-slate-200 dark:hover:bg-slatehimachal-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
              >
                <Eye className="w-4 h-4 text-pine-600 dark:text-pine-400" />
                <span>Preview Draft Itinerary</span>
              </button>

              <button
                type="submit"
                className="btn-3d w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-pine-700 hover:bg-pine-800 text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Request to Monu</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* DRAFT ITINERARY PREVIEW & WHATSAPP MODAL (Mobile-Optimized Modal Sheet) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 space-y-4 text-slate-900 dark:text-white max-h-[92vh] flex flex-col my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-pine-700 dark:text-pine-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                    Draft Itinerary & Route Brief
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Bespoke Expedition ({days}D/{nights}N) for {travelers} Nomads
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slatehimachal-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Itinerary Summary */}
            <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 text-xs">
              
              {/* Trip Highlights Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Start Date</span>
                  <strong className="text-slate-900 dark:text-white text-xs">{startDate}</strong>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Accommodations</span>
                  <strong className="text-slate-900 dark:text-white text-xs">{preferredStay}</strong>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Transit</span>
                  <strong className="text-slate-900 dark:text-white text-xs">{preferredTransit}</strong>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Est. Budget</span>
                  <strong className="text-pine-800 dark:text-pine-400 text-xs sm:text-sm font-extrabold">₹{estimatedBudgetTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Feasibility Verdict Pill */}
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex flex-wrap items-center justify-between gap-1.5 ${feasibilityMetrics.verdictColor}`}>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Feasibility: {feasibilityMetrics.verdict} ({feasibilityMetrics.score}%)</span>
                </div>
                <span className="text-[10px] font-mono">Peak: {maxAltitude}m</span>
              </div>

              {/* Selected Sites with Altitudes */}
              <div className="space-y-1.5">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block">
                  Chosen Stops & Sites ({selectedSites.length} spots across {chosenRegions.length} region(s)):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedSiteObjects.map((item, i) => (
                    <div key={i} className="p-2 rounded-xl bg-white dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <strong className="text-slate-900 dark:text-white text-xs block truncate">{item.site.name}</strong>
                        <span className="text-[10px] text-slate-400 block truncate">{item.region.name} • {item.site.type}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300 shrink-0">
                        {item.site.altitude}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {specialWishes && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <strong className="block text-[10px] uppercase font-bold">Special Requests for Monu:</strong>
                  <p className="mt-0.5 italic text-xs">"{specialWishes}"</p>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadDraftPDF}
                  className="btn-3d px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slatehimachal-800 hover:bg-slate-200 dark:hover:bg-slatehimachal-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5 text-pine-600 dark:text-pine-400" />
                  <span>Draft PDF</span>
                </button>

                <a
                  href={`https://wa.me/919653240540?text=Hi%20Monu!%20Here%20is%20my%20draft%20custom%20trip%20plan:%20${days}D/${nights}N%20for%20${travelers}%20nomads%20across%20${chosenRegions.join(',%20')}%20with%20${preferredStay}%20and%20${preferredTransit}.%20Can%20we%20discuss?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="btn-3d px-5 py-2.5 rounded-xl bg-pine-700 hover:bg-pine-800 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Confirm & Submit Request</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
