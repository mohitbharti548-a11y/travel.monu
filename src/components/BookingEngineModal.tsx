import React, { useState } from 'react';
import { 
  X, 
  Bus, 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap,
  Bell,
  MessageCircle,
  Compass,
  CheckCircle2,
  Tv,
  Coffee,
  Wind
} from 'lucide-react';
import { notificationEngine } from '../services/notificationEngine';

interface BookingEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTransit?: (transit: any, travelers: number, date: string) => void;
}

export const BookingEngineModal: React.FC<BookingEngineModalProps> = ({
  isOpen,
  onClose
}) => {
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [travelerContact, setTravelerContact] = useState('');

  if (!isOpen) return null;

  const handleJoinWaitlist = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setWaitlistJoined(true);

    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: '🚀 Priority Transit Waitlist Confirmed',
      message: 'You have been added to Monu VIP early-access list for Premier Volvo Sleepers & Mountain Flights.',
      priority: 'high'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white my-6">
        
        {/* Header with Glowing Badge */}
        <div className="bg-gradient-to-r from-pine-900 via-pine-800 to-slate-950 text-white p-6 sm:p-8 flex items-center justify-between border-b border-pine-700/80 dark:border-slate-800 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Coming Soon • Launching Winter 2026</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Premier Volvo Sleepers & Scenic Flights
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Direct high-comfort mountain connectivity curated exclusively for Himachal Nomad travelers — from Volvo 9600 heated berths to 90-minute Himalayan aerial hops.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Preview Cards Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Premier Volvo 9600 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative group hover:border-pine-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300 flex items-center justify-center">
                <Bus className="w-5 h-5 text-pine-700 dark:text-amber-400" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider block">
                  Overnight Highway Luxury
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Volvo 9600 Sleepers
                </h4>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Delhi & Chandigarh $\leftrightarrow$ Manali, Dharamshala, Shimla & Chamba. Private departure lounges with clean washrooms.
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Deep recline heated memory-foam berths</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Individual 4K screen & Starlink WiFi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Hot Pahadi spiced chai & snack hamper</span>
                </div>
              </div>
            </div>

            {/* 2. Scenic Mountain Flights */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative group hover:border-pine-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center justify-center">
                <Plane className="w-5 h-5 text-sky-700 dark:text-sky-400" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold text-sky-600 dark:text-sky-400 tracking-wider block">
                  90-Min Direct Aerial
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Scenic Mountain Flights
                </h4>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Delhi (DEL T3) $\leftrightarrow$ Kullu-Manali (Bhuntar) & Dharamshala (Kangra). Fly right past snow-draped Dhauladhar peaks.
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Left-window snow crest view selection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>15kg Check-in + 7kg Cabin baggage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Priority airport private taxi connect</span>
                </div>
              </div>
            </div>

            {/* 3. Spiti 4x4 High-Pass Safari */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative group hover:border-pine-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider block">
                  All-Terrain Expedition
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Spiti 4x4 Cruisers
                </h4>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Manali $\leftrightarrow$ Kaza via Atal Tunnel & Kunzum Pass (4,551m). Specialized high-clearance mountain 4x4s with expert drivers.
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Max 4 nomads per 4x4 for ultimate room</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Emergency oxygen & oximeter onboard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Glacier halts & Kunzum pass photo stops</span>
                </div>
              </div>
            </div>

          </div>

          {/* VIP Priority Waitlist & Monu WhatsApp Connect */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-pine-900 via-slate-900 to-slate-950 text-white border border-pine-700/60 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h4 className="text-lg font-extrabold text-white">
                    Get VIP Early Access on Launch
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  Direct bookings open soon with exclusive creator seat allocations and free weather rescheduling guarantees. Join the priority waitlist to be notified first.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {waitlistJoined ? (
                  <div className="px-5 py-3 rounded-2xl bg-emerald-600/90 text-white font-extrabold text-xs flex items-center gap-2 border border-emerald-400 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>You're on the VIP Waitlist!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinWaitlist()}
                    className="btn-3d w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Join Priority Waitlist</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/919653240540?text=${encodeURIComponent(
                    'Hi Monu! I want to join the priority waitlist for Premier Volvo 9600 Sleepers & Scenic Flights.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d px-4 py-3.5 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp Monu</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slatehimachal-950 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Monu 100% Weather & Mountain Road Rescheduling Guarantee</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

