import React, { useState } from 'react';
import { TourPackage, ItineraryDay, CustomTripRequest, UserProfile, PricingRules } from '../types';
import { TOUR_PACKAGES } from '../data/mockData';
import { CustomTripWidget } from './CustomTripWidget';
import { ScrollReveal } from './ScrollReveal';
import { PreBookingAdvisory } from './PreBookingAdvisory';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  Check, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Home, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Sliders,
  Compass,
  TrendingUp,
  Tag,
  Minus,
  Users
} from 'lucide-react';

interface CustomPackageBuilderProps {
  onProceedToCheckout: (packageDetails: {
    packageItem: TourPackage;
    customizedDays: ItineraryDay[];
    calculatedTotal: number;
    travelers: number;
    travelDate: string;
  }) => void;
  onSubmitCustomRequest: (request: Omit<CustomTripRequest, 'id' | 'requestRef' | 'status' | 'adminQuotedPrice' | 'adminCuratedSchedule' | 'submittedAt'>) => void;
  packages?: TourPackage[];
  pricingRules?: PricingRules;
  userProfile?: UserProfile | null;
  onOpenAuth?: (prompt?: string) => void;
}

export const CustomPackageBuilder: React.FC<CustomPackageBuilderProps> = ({
  onProceedToCheckout,
  onSubmitCustomRequest,
  packages,
  pricingRules,
  userProfile,
  onOpenAuth
}) => {
  const activePackages = packages && packages.length > 0 ? packages : TOUR_PACKAGES;
  const [activeMode, setActiveMode] = useState<'studio' | 'pre-curated'>('pre-curated');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(activePackages[0].id);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>('2026-09-18');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Active package
  const currentPackage = activePackages.find(p => p.id === selectedPackageId) || activePackages[0];
  
  // Customization state per package
  const [customDays, setCustomDays] = useState<Record<string, ItineraryDay[]>>({
    [currentPackage.id]: (currentPackage.itinerary || []).map(day => ({
      ...day,
      activities: (day.activities || []).map(act => ({ ...act }))
    }))
  });

  const activeItinerary = customDays[selectedPackageId] || currentPackage.itinerary || [];

  // Dynamic pricing factor
  const pricingMultiplier = pricingRules?.isDynamicPricingActive 
    ? (1 + ((pricingRules.globalMultiplierPercent || 0) + (pricingRules.packageModifierPercent || 0)) / 100)
    : 1;

  // Toggle stay tier for a specific day
  const handleToggleStay = (dayNumber: number, stayType: 'standard' | 'luxury') => {
    setCustomDays(prev => {
      const packageDays = (prev[selectedPackageId] || currentPackage.itinerary).map(day => {
        if (day.dayNumber === dayNumber) {
          return { ...day, selectedStay: stayType };
        }
        return day;
      });
      return { ...prev, [selectedPackageId]: packageDays };
    });
  };

  // Toggle activity selection
  const handleToggleActivity = (dayNumber: number, activityId: string) => {
    setCustomDays(prev => {
      const packageDays = (prev[selectedPackageId] || currentPackage.itinerary).map(day => {
        if (day.dayNumber === dayNumber) {
          const updatedActs = day.activities.map(act => {
            if (act.id === activityId) {
              return { ...act, selected: !act.selected };
            }
            return act;
          });
          return { ...day, activities: updatedActs };
        }
        return day;
      });
      return { ...prev, [selectedPackageId]: packageDays };
    });
  };

  // Calculate live total price with dynamic pricing multiplier
  const calculateTotal = () => {
    const effectiveBasePrice = Math.round(currentPackage.basePrice * pricingMultiplier);
    let base = effectiveBasePrice * travelersCount;
    
    // Add stay upgrades
    activeItinerary.forEach(day => {
      if (day.selectedStay === 'luxury') {
        base += (day.stayOption?.upgradeCost || 2500) * Math.ceil(travelersCount / 2);
      }
      // Add extra activities
      (day.activities || []).forEach(act => {
        if (!act.included && act.selected) {
          base += act.cost * travelersCount;
        }
      });
    });

    return base;
  };

  const calculatedTotal = calculateTotal();

  const handleCheckoutClick = () => {
    onProceedToCheckout({
      packageItem: currentPackage,
      customizedDays: activeItinerary,
      calculatedTotal: calculatedTotal,
      travelers: travelersCount,
      travelDate: travelDate
    });
  };

  return (
    <section id="custom-packages" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Background Topographic Texture */}
      <div className="absolute inset-0 -z-10 bg-topo-pattern opacity-40 pointer-events-none"></div>

      {/* Section Header with 3D Scroll Reveal */}
      <ScrollReveal direction="up">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pine-700 dark:text-pine-400" />
            <span>Tailor Your Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading text-3d-depth">
            Custom Itineraries & Trip Studio
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
            Design your dream Himalayan expedition with custom travelers, days, spots, and stays, or customize our pre-curated creator routes.
          </p>

          {/* Dynamic Pricing Live Notice if Active */}
          {pricingRules?.isDynamicPricingActive && pricingMultiplier !== 1 && (
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                Seasonal Tariff Active ({pricingRules.seasonPreset.replace('_', ' ').toUpperCase()} • {((pricingMultiplier - 1) * 100) > 0 ? '+' : ''}{Math.round((pricingMultiplier - 1) * 100)}%)
              </span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex flex-col sm:inline-flex sm:flex-row p-1.5 bg-slate-200/80 dark:bg-slatehimachal-800/80 rounded-2xl mt-6 border border-slate-300/70 dark:border-slate-700 shadow-inner max-w-xl mx-auto gap-1">
            <button
              onClick={() => setActiveMode('pre-curated')}
              className={`btn-3d flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                activeMode === 'pre-curated'
                  ? 'bg-pine-700 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Pre-Curated Timelines</span>
            </button>

            <button
              onClick={() => setActiveMode('studio')}
              className={`btn-3d flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                activeMode === 'studio'
                  ? 'bg-pine-700 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Trip Studio</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* VIEW 1: Interactive Custom Trip Studio (Design From Scratch) */}
      {activeMode === 'studio' && (
        <ScrollReveal direction="up">
          <CustomTripWidget 
            onSubmitRequest={onSubmitCustomRequest} 
            userProfile={userProfile}
            onOpenAuth={onOpenAuth}
          />
        </ScrollReveal>
      )}

      {/* VIEW 2: Pre-Curated Timeline Package Builder */}
      {activeMode === 'pre-curated' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Package Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePackages.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              const dynamicPkgPrice = Math.round(pkg.basePrice * pricingMultiplier);
              return (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    if (!customDays[pkg.id]) {
                      setCustomDays(prev => ({
                        ...prev,
                        [pkg.id]: (pkg.itinerary || []).map(d => ({
                          ...d,
                          activities: (d.activities || []).map(a => ({ ...a }))
                        }))
                      }));
                    }
                  }}
                  className={`card-3d p-4 rounded-3xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-700 dark:border-pine-500 shadow-md ring-2 ring-pine-700/20'
                      : 'bg-white dark:bg-slatehimachal-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800">
                      {pkg.badge || 'Curated'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{pkg.duration}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1 leading-snug">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-3">
                    {pkg.overview}
                  </p>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Base Price</span>
                    <span className="text-sm font-extrabold text-pine-800 dark:text-pine-400">
                      ₹{dynamicPkgPrice.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">/person</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Builder Layout: Timeline & Sticky Summary Card that moves gracefully with scroll */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Cols: Interactive Timeline Accordion */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slatehimachal-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{currentPackage.title}</span>
                    <span className="text-xs font-normal text-pine-700 dark:text-amber-400 font-mono">({currentPackage.duration})</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeItinerary.length} Days Itinerary • Click a day to configure stays & experiences
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 text-xs font-extrabold">
                    {currentPackage.destination}
                  </span>
                </div>
              </div>

              {/* Dynamic Elevation Profile for Current Pre-Curated Tour */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-pine-400" /> Route Altitude Profile & Elevation Curve
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    Gradual Acclimatization Verified
                  </span>
                </div>

                <div className="h-16 w-full flex items-end justify-between gap-2 pt-2">
                  {activeItinerary.map((d, i) => {
                    // Estimate elevation based on day
                    const isSpitiHigh = d.title.includes('Kunzum') || d.title.includes('Chandratal') || d.title.includes('Hikkim') || d.title.includes('Kaza') || d.title.includes('Kibber');
                    const isDharamshalaHigh = d.title.includes('Triund');
                    const altitude = isSpitiHigh ? (d.title.includes('Kunzum') ? 4551 : d.title.includes('Chandratal') ? 4300 : 3650) : isDharamshalaHigh ? 2828 : 2050;
                    const heightPct = Math.max(25, Math.min(100, ((altitude - 800) / 3800) * 100));

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t transition-all ${
                            altitude > 3500 
                              ? 'bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-125' 
                              : 'bg-gradient-to-t from-pine-700 to-pine-400 group-hover:brightness-125'
                          }`}
                        ></div>
                        <span className="text-[9px] text-slate-400 font-mono mt-1">D{d.dayNumber}</span>
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] p-1.5 rounded-lg shadow-xl z-20 whitespace-nowrap border border-slate-700 pointer-events-none">
                          <span className="font-bold">Day {d.dayNumber}: {d.title}</span>
                          <span className="text-pine-300 font-mono">{altitude}m Altitude</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeItinerary.map((day) => {
                const isExpanded = expandedDay === day.dayNumber;
                return (
                  <div
                    key={day.dayNumber}
                    className="card-3d bg-white dark:bg-slatehimachal-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                  >
                    {/* Day Header Trigger */}
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slatehimachal-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300 font-extrabold flex items-center justify-center text-sm shadow-inner shrink-0">
                          D{day.dayNumber}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                            {day.title}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {day.selectedStay === 'luxury' ? `★ Upgrade: ${day.stayOption.luxuryUpgrade}` : day.stayOption.standard}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {day.selectedStay === 'luxury' && (
                          <span className="hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                            Luxury Stay
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </button>

                    {/* Day Expandable Content */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slatehimachal-850/60 space-y-5 text-xs animate-fadeIn">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {day.description}
                        </p>

                        {/* Stay Options Selector */}
                        <div className="space-y-2">
                          <label className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <Home className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" /> Select Night Accommodations
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStay(day.dayNumber, 'standard')}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                day.selectedStay === 'standard'
                                  ? 'bg-white dark:bg-slatehimachal-900 border-pine-700 dark:border-pine-500 shadow-sm ring-1 ring-pine-700'
                                  : 'bg-white/80 dark:bg-slatehimachal-900/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">Standard Included</span>
                                {day.selectedStay === 'standard' && <Check className="w-4 h-4 text-pine-700 dark:text-pine-400" />}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{day.stayOption.standard}</p>
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 block">₹0 Additional</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStay(day.dayNumber, 'luxury')}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                day.selectedStay === 'luxury'
                                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-500'
                                  : 'bg-white/80 dark:bg-slatehimachal-900/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-amber-950 dark:text-amber-300 text-xs">✨ Luxury Dome / Haven</span>
                                {day.selectedStay === 'luxury' && <Check className="w-4 h-4 text-amber-700 dark:text-amber-400" />}
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{day.stayOption.luxuryUpgrade}</p>
                              <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold mt-1 block">+₹{day.stayOption.upgradeCost.toLocaleString('en-IN')} / room</span>
                            </button>
                          </div>
                        </div>

                        {/* Activities & Add-ons */}
                        <div className="space-y-2">
                          <label className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" /> Experiences & Excursions
                          </label>
                          <div className="space-y-2">
                            {day.activities.map((act) => (
                              <div
                                key={act.id}
                                onClick={() => !act.included && handleToggleActivity(day.dayNumber, act.id)}
                                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                                  act.included
                                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40'
                                    : act.selected
                                    ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-600 dark:border-pine-500 shadow-sm cursor-pointer'
                                    : 'bg-white dark:bg-slatehimachal-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 cursor-pointer'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    checked={act.selected}
                                    readOnly
                                    className="rounded text-pine-700 pointer-events-none"
                                  />
                                  <span className="font-semibold text-slate-900 dark:text-white text-xs">{act.name}</span>
                                </div>

                                <div>
                                  {act.included ? (
                                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
                                      Included
                                    </span>
                                  ) : (
                                    <span className="text-xs font-extrabold text-pine-800 dark:text-pine-400">
                                      +₹{act.cost.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">/person</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right 1 Col: Sticky Calculation & Booking Summary Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-slatehimachal-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Tailored Itinerary Summary
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {currentPackage.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentPackage.destination} • {currentPackage.duration}</p>
                </div>

                {/* Travelers & Departure Date Inputs */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-pine-700 dark:text-pine-400" />
                        <span>Number of Travelers</span>
                      </label>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300 border border-pine-200 dark:border-pine-800">
                        {travelersCount === 1 ? 'Solo Nomad' : travelersCount === 2 ? 'Duo Couple / Friends' : travelersCount <= 5 ? `${travelersCount} Small Group` : `${travelersCount} Nomads Tribe`}
                      </span>
                    </div>

                    {/* Manual Stepper & Input Count Box */}
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slatehimachal-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                        disabled={travelersCount <= 1}
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold bg-white dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slatehimachal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm text-base"
                        title="Decrease Travelers"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex-1 flex items-center justify-center gap-1.5 px-2">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={travelersCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1) {
                              setTravelersCount(Math.min(30, val));
                            } else if (e.target.value === '') {
                              setTravelersCount(1);
                            }
                          }}
                          className="w-14 text-center font-extrabold text-base text-slate-900 dark:text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-pine-500 rounded-lg py-1 border border-slate-300/60 dark:border-slate-600 font-mono"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nomads</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTravelersCount(Math.min(30, travelersCount + 1))}
                        disabled={travelersCount >= 30}
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold bg-pine-700 hover:bg-pine-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm text-base"
                        title="Increase Travelers"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Slider Bar */}
                    <div className="px-1 pt-1">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={travelersCount}
                        onChange={(e) => setTravelersCount(parseInt(e.target.value, 10))}
                        className="w-full accent-pine-600 dark:accent-pine-400 cursor-pointer h-1.5 bg-slate-200 dark:bg-slatehimachal-700 rounded-lg appearance-none"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                        <span>1 Nomad</span>
                        <span>5</span>
                        <span>10</span>
                        <span>15</span>
                        <span>20+</span>
                      </div>
                    </div>

                    {/* Quick-Pick Preset Chips */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 4, 6, 8, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTravelersCount(num)}
                          className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            travelersCount === num
                              ? 'bg-pine-700 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slatehimachal-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slatehimachal-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Preferred Departure Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slatehimachal-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-pine-700"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Tier ({travelersCount} Travelers)</span>
                    <span className="font-bold">₹{(currentPackage.basePrice * travelersCount).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Total All-Inclusive</span>
                    <span className="text-2xl font-extrabold text-pine-800 dark:text-pine-400">
                      ₹{calculatedTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Direct Checkout Action */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckoutClick}
                    className="btn-3d w-full py-4 rounded-2xl font-extrabold text-sm bg-pine-700 hover:bg-pine-800 text-white shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Direct Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Weather Guarantee • Monu Direct Connect</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Before Booking Advisory Section for Pre-Curated Circuit */}
          <div className="mt-8">
            <PreBookingAdvisory defaultLang="both" />
          </div>
        </div>
      )}

    </section>
  );
};
