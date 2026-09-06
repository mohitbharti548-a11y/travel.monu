import React, { useState, useMemo } from 'react';
import { 
  Home, MapPin, Star, ShieldCheck, Sparkles, Wifi, 
  Flame, Coffee, Eye, ChevronRight, Filter, Compass, Video
} from 'lucide-react';
import { Stay, UserProfile } from '../types';

interface HandpickedStaysSectionProps {
  stays: Stay[];
  activeProfile: UserProfile | null;
  onBookStay: (stay: Stay) => void;
  onOpenAuth: () => void;
}

export const HandpickedStaysSection: React.FC<HandpickedStaysSectionProps> = ({
  stays,
  activeProfile,
  onBookStay,
  onOpenAuth
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeGalleryStay, setActiveGalleryStay] = useState<Stay | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  const destinations = useMemo(() => {
    const list = Array.from(new Set(stays.map(s => s.location))).filter(Boolean);
    return ['all', ...list];
  }, [stays]);

  const filteredStays = useMemo(() => {
    return stays.filter(stay => {
      const matchDest = selectedDestination === 'all' || stay.location === selectedDestination;
      const matchType = selectedType === 'all' || stay.type === selectedType;
      return matchDest && matchType;
    });
  }, [stays, selectedDestination, selectedType]);

  const openGalleryModal = (stay: Stay, initialIdx: number = 0) => {
    setActiveGalleryStay(stay);
    setActivePhotoIdx(initialIdx);
  };

  return (
    <section id="homestays" className="py-20 bg-stone-950 relative overflow-hidden border-t border-stone-800/80">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
            <Home className="w-4 h-4" />
            <span>DIRECT STAY BOOKINGS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Handpicked Stays & Mud Homestays
          </h2>
          <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed">
            Don't need a full itinerary? Book our exclusive rustic chalets, apple orchard mud houses, geodesic domes, and cozy high-altitude nomad bases directly with local pahadi hosts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10 bg-stone-900/60 p-3 sm:p-4 rounded-2xl border border-stone-800 backdrop-blur-md">
          {/* Destination Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
            {destinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDestination === dest
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/50'
                }`}
              >
                {dest === 'all' ? 'All Himachal' : dest}
              </button>
            ))}
          </div>

          {/* Stay Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-stone-950 text-stone-200 border border-stone-700 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Stay Types</option>
              <option value="homestay">Mud & Wood Homestays</option>
              <option value="dome">Geodesic Glamping Domes</option>
              <option value="resort">Luxury Chalets & Retreats</option>
              <option value="campsite">Riverside Campsites</option>
            </select>
          </div>
        </div>

        {/* Stays Grid */}
        {filteredStays.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/30 rounded-3xl border border-stone-800/80">
            <Compass className="w-12 h-12 text-stone-600 mx-auto mb-3 animate-pulse" />
            <p className="text-stone-300 font-medium text-sm">No handpicked stays found for this destination filter.</p>
            <button
              onClick={() => { setSelectedDestination('all'); setSelectedType('all'); }}
              className="mt-3 text-xs text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredStays.map((stay) => {
              const allPhotos = [(stay.imageUrl || stay.image), ...(stay.galleryImages || [])].filter(Boolean);
              return (
                <div
                  key={stay.id}
                  className="group bg-stone-900/80 rounded-3xl overflow-hidden border border-stone-800/90 hover:border-emerald-500/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  {/* Image & Badges */}
                  <div className="relative h-60 bg-stone-950 overflow-hidden cursor-pointer" onClick={() => openGalleryModal(stay, 0)}>
                    <img
                      src={(stay.imageUrl || stay.image)}
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-black/40" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="bg-stone-900/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 capitalize">
                        {stay.type}
                      </span>
                      {stay.videoUrl && (
                        <span className="bg-amber-500/90 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                          <Video className="w-3 h-3" />
                          <span>Video Tour</span>
                        </span>
                      )}
                    </div>

                    {/* Multi-Photo Count Badge */}
                    {allPhotos.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openGalleryModal(stay, 0); }}
                        className="absolute top-3 right-3 bg-stone-950/80 hover:bg-stone-900 text-stone-200 text-xs px-2.5 py-1 rounded-full backdrop-blur-md border border-stone-700 flex items-center space-x-1.5 shadow"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{allPhotos.length} Photos</span>
                      </button>
                    )}

                    {/* Location overlay */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs text-stone-300 flex items-center space-x-1 drop-shadow">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{stay.location}</span>
                      </span>
                      <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-stone-700">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-white">{stay.rating || '4.9'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {stay.name}
                      </h3>
                      <p className="mt-2 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {(stay.description || stay.creatorNote)}
                      </p>

                      {/* Amenities pills */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {stay.amenities?.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-stone-950 text-stone-300 text-[11px] px-2.5 py-0.5 rounded-lg border border-stone-800"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-stone-400 block">Direct Host Rate</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xl font-extrabold text-white">
                            ₹{stay.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-stone-400">/ night</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {allPhotos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => openGalleryModal(stay, 0)}
                            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                            title="View Photo Gallery"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onBookStay(stay)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20"
                        >
                          <span>Book Stay</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Gallery Modal */}
      {activeGalleryStay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{activeGalleryStay.name}</h3>
                <p className="text-xs text-stone-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{activeGalleryStay.location}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveGalleryStay(null)}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                ✕
              </button>
            </div>

            {/* Main Active Photo */}
            <div className="relative h-80 sm:h-96 bg-black flex items-center justify-center">
              {(() => {
                const photos = [(activeGalleryStay.imageUrl || activeGalleryStay.image), ...(activeGalleryStay.galleryImages || [])].filter(Boolean);
                return (
                  <img
                    src={photos[activePhotoIdx] || (activeGalleryStay.imageUrl || activeGalleryStay.image)}
                    alt="Stay active view"
                    className="max-h-full max-w-full object-contain"
                  />
                );
              })()}
            </div>

            {/* Thumbnails row */}
            {(() => {
              const photos = [(activeGalleryStay.imageUrl || activeGalleryStay.image), ...(activeGalleryStay.galleryImages || [])].filter(Boolean);
              return (
                <div className="p-4 bg-stone-950 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
                    {photos.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                          activePhotoIdx === idx ? 'border-emerald-400 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const st = activeGalleryStay;
                      setActiveGalleryStay(null);
                      onBookStay(st);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs whitespace-nowrap shadow-lg shadow-emerald-500/20"
                  >
                    Book This Stay
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};
