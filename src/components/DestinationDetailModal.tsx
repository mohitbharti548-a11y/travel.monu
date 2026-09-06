import React from 'react';
import { Destination, Stay, LocalGuide } from '../types';
import { CURATED_STAYS, LOCAL_GUIDES } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Mountain, 
  Calendar, 
  Sparkles, 
  Star, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  Home
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onBookTour: (destTitle: string) => void;
  stays?: Stay[];
  guides?: LocalGuide[];
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  onBookTour,
  stays,
  guides
}) => {
  if (!destination) return null;

  const staySource = stays && stays.length > 0 ? stays : CURATED_STAYS;
  const guideSource = guides && guides.length > 0 ? guides : LOCAL_GUIDES;

  const relevantStays = staySource.filter(s => s.destinationId === destination.id);
  const relevantGuides = guideSource.filter(g => g.destination.toLowerCase().includes(destination.name.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slatehimachal-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner with 4K Imagery and Takri Emblem */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold text-goldenhour-300 border border-goldenhour-500/40 font-mono">
                {destination.altitude}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold">
                {destination.hindiName}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-md text-xs font-bold">
                {destination.temperature}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {destination.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-xl font-light">
              {destination.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-semibold">Altitude</span>
              <strong className="text-slate-900 dark:text-white text-sm">{destination.altitude}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-semibold">Best Time to Visit</span>
              <strong className="text-slate-900 dark:text-white text-sm">{destination.bestTimeToVisit}</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 dark:text-slate-400 block font-semibold">Starting Budget</span>
              <strong className="text-pine-700 dark:text-goldenhour-400 text-sm">₹{destination.startingPrice.toLocaleString('en-IN')} / person</strong>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              The Creator's Perspective
            </h4>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Creator's Secret Spot Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 dark:border-goldenhour-500/30">
            <div className="flex items-center gap-2 text-amber-900 dark:text-goldenhour-400 font-extrabold text-sm uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Monu's Verified Secret Spot: {destination.secretSpot.title}</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 mb-3 leading-relaxed">
              {destination.secretSpot.description}
            </p>
            <div className="bg-white/80 dark:bg-slatehimachal-900/80 p-3 rounded-xl border border-amber-200 dark:border-goldenhour-900/60 text-xs space-y-1">
              <p><strong className="text-amber-800 dark:text-goldenhour-400">Best Timing:</strong> {destination.secretSpot.bestTime}</p>
              <p><strong className="text-amber-800 dark:text-goldenhour-400">Creator Tip:</strong> {destination.secretSpot.creatorTip}</p>
            </div>
          </div>

          {/* Handpicked Stays in this destination */}
          {relevantStays.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Home className="w-4 h-4 text-pine-600 dark:text-goldenhour-400" />
                Handpicked Homestays & Domes in {destination.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relevantStays.map(stay => (
                  <div key={stay.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 flex gap-4">
                    <img src={stay.image} alt={stay.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-pine-700 dark:text-goldenhour-400">{stay.type}</span>
                        <span className="flex items-center text-xs font-bold text-amber-500"><Star className="w-3 h-3 fill-amber-400 mr-1" /> {stay.rating}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{stay.name}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">₹{stay.pricePerNight} / night</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 italic mt-1 line-clamp-1">"{stay.creatorNote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Must Visit Spots List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Must-Visit Cultural & Natural Landmarks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destination.mustVisitSpots.map((spot, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                  <Check className="w-3.5 h-3.5 text-pine-600 dark:text-goldenhour-400 shrink-0" />
                  <span>{spot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Protected by Creator Weather Guarantee & Direct Refund Policy</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookTour(destination.name);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-pine-700 hover:bg-pine-800 dark:bg-goldenhour-500 dark:hover:bg-goldenhour-600 text-white dark:text-slate-950 shadow-lg flex items-center gap-2 transition-all"
            >
              <span>Customize {destination.name} Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
