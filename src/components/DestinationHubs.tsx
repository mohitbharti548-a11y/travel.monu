import React, { useState, useRef } from 'react';
import { Destination, DestinationId } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { 
  Mountain, 
  Sparkles, 
  ArrowUpRight, 
  Eye, 
  Compass, 
  Map, 
  Grid, 
  MapPin, 
  Thermometer, 
  Calendar, 
  Navigation,
  Layers,
  ArrowRight
} from 'lucide-react';

import { InteractiveDynamicMap, MapSiteLocation } from './InteractiveDynamicMap';

interface DestinationHubsProps {
  destinations: Destination[];
  onSelectDestination: (destId: DestinationId) => void;
  onBookDirect: (destName: string) => void;
}

// Destination GPS Dictionary for dynamic interactive mapping
const DESTINATION_GPS: Record<string, { lat: number; lng: number; altitude: number }> = {
  spiti: { lat: 32.2461, lng: 78.0349, altitude: 3800 },
  kaza: { lat: 32.2276, lng: 78.0710, altitude: 3650 },
  manali: { lat: 32.2432, lng: 77.1892, altitude: 2050 },
  kullu: { lat: 31.9579, lng: 77.1095, altitude: 1279 },
  dharamshala: { lat: 32.2190, lng: 76.3234, altitude: 1750 },
  mandi: { lat: 31.7087, lng: 76.9320, altitude: 850 },
  shimla: { lat: 31.1048, lng: 77.1734, altitude: 2276 },
  kinnaur: { lat: 31.5380, lng: 78.2560, altitude: 2700 },
  chamba: { lat: 32.5534, lng: 76.1258, altitude: 996 }
};

// 3D Tilt Card Component for dynamic micro-interaction
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('');
  const [shadow, setShadow] = useState<string>('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate limits (-8deg to +8deg)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setShadow('0 20px 35px -10px rgba(15, 23, 42, 0.35)');
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShadow('');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        boxShadow: shadow,
        transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const DestinationHubs: React.FC<DestinationHubsProps> = ({
  destinations,
  onSelectDestination,
  onBookDirect
}) => {
  // Required Filter Tabs
  const [filter, setFilter] = useState<'all' | 'high_altitude' | 'lush_valleys' | 'spiritual_trekking'>('all');
  
  // View mode: 'grid' vs 'map'
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapPin, setSelectedMapPin] = useState<Destination | null>(null);

  const filteredDestinations = destinations.filter((d) => {
    if (!d || !d.id) return false;
    if (filter === 'high_altitude') {
      const nameL = (d.name || '').toLowerCase();
      const descL = (d.description || '').toLowerCase();
      const altL = (d.altitude || '').toLowerCase();
      return d.id === 'spiti' || d.id === 'kaza' || d.id === 'kinnaur' || nameL.includes('spiti') || nameL.includes('kaza') || nameL.includes('kinnaur') || altL.includes('3,') || altL.includes('4,') || descL.includes('altitude');
    }
    if (filter === 'lush_valleys') {
      const nameL = (d.name || '').toLowerCase();
      return d.id === 'manali' || d.id === 'kullu' || d.id === 'mandi' || d.id === 'chamba' || nameL.includes('manali') || nameL.includes('kullu') || nameL.includes('mandi') || nameL.includes('chamba') || nameL.includes('valley');
    }
    if (filter === 'spiritual_trekking') {
      const nameL = (d.name || '').toLowerCase();
      const descL = (d.description || '').toLowerCase();
      return d.id === 'dharamshala' || d.id === 'shimla' || d.id === 'chamba' || nameL.includes('dharamshala') || nameL.includes('mcleod') || nameL.includes('shimla') || descL.includes('monastery') || descL.includes('temple');
    }
    return true;
  });

  // Convert destinations to Interactive Map Site Locations
  const mapSiteLocations: MapSiteLocation[] = filteredDestinations.map(d => {
    const coords = DESTINATION_GPS[d.id] || { lat: 32.0, lng: 77.0, altitude: parseInt(d.altitude) || 2000 };
    return {
      id: d.id,
      name: d.name,
      regionName: d.hindiName,
      altitude: coords.altitude,
      lat: coords.lat,
      lng: coords.lng,
      type: d.popularActivities?.[0] || d.mustVisitSpots?.[0] || 'Sacred Hub',
      isSelected: selectedMapPin?.id === d.id
    };
  });

  return (
    <section id="destinations" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Subtle Mountain Imagery Layer with Gradient Isolation */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-3xl opacity-20 dark:opacity-15">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
          alt="Himachal High Valleys Landscape"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-snowpeak via-snowpeak/90 to-snowpeak dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950"></div>
        <div className="absolute inset-0 bg-topo-pattern opacity-60"></div>
      </div>

      {/* Section Header with 3D Scroll Reveal */}
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-pine-700 dark:text-pine-400 animate-spin-slow" />
              <span>The Sacred Hubs of Himachal</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Curated Destination Hubs
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-xl font-normal">
              Authentic valley circuits, high-altitude passes, and Monu's verified secret spots with zero tourist traps.
            </p>
          </div>

          {/* Right Controls: View Mode Toggle & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 bg-slate-200 dark:bg-slatehimachal-800 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-pine-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-pine-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Dynamic Map</span>
              </button>
            </div>

            {/* Required Filter Tabs on Top */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Regions' },
                { id: 'high_altitude', label: 'High Altitude / Spiti' },
                { id: 'lush_valleys', label: 'Lush Valleys / Kullu-Manali' },
                { id: 'spiritual_trekking', label: 'Spiritual & Trekking / Dharamshala' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filter === tab.id
                      ? 'bg-pine-700 text-white shadow-md font-extrabold'
                      : 'bg-white dark:bg-slatehimachal-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slatehimachal-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* VIEW 1: DYNAMIC REAL-TIME HIMACHAL TOPOGRAPHIC MAP */}
      {viewMode === 'map' && (
        <div className="mb-12 p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-pine-400" />
              <h3 className="font-extrabold text-base text-white">Interactive Dynamic Map of Himachal Pradesh</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Pan, zoom in/out with mouse scroll or buttons & click any location pin
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Real Interactive Leaflet Map */}
            <div className="lg:col-span-2">
              <InteractiveDynamicMap 
                sites={mapSiteLocations}
                height="420px"
                showConnectingRoute={true}
                onSelectSite={(siteName) => {
                  const matched = destinations.find(d => d.name === siteName || siteName.includes(d.name));
                  if (matched) setSelectedMapPin(matched);
                }}
              />
            </div>

            {/* Pin Detail Preview Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              {selectedMapPin ? (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-goldenhour-400 font-extrabold uppercase tracking-wider block">{selectedMapPin.altitude}</span>
                      <h4 className="text-xl font-extrabold text-white">{selectedMapPin.name}</h4>
                      <p className="text-xs text-slate-400">{selectedMapPin.hindiName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-pine-900 text-pine-200 text-xs font-bold">
                      {selectedMapPin.temperature}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedMapPin.description || selectedMapPin.tagline}
                  </p>

                  {selectedMapPin.secretSpot && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300/90 space-y-1">
                      <strong className="text-[11px] text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Secret Spot:
                      </strong>
                      <p className="text-[11px] text-slate-300">
                        {selectedMapPin.secretSpot.title || 'Secret Viewpoint'}: {selectedMapPin.secretSpot.description || 'Untouched valley ridge viewpoint.'}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => onSelectDestination(selectedMapPin.id)}
                      className="btn-3d flex-1 py-2.5 rounded-xl bg-pine-700 hover:bg-pine-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Guide</span>
                    </button>

                    <button
                      onClick={() => onBookDirect(selectedMapPin.name)}
                      className="btn-3d flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Book Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <MapPin className="w-8 h-8 text-pine-400 mx-auto animate-bounce" />
                  <p className="text-xs font-bold text-white">Click any pin on the map</p>
                  <p className="text-[11px]">Inspect Monu's secret spots, elevation, and weather for that hub.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DESTINATION GRID WITH 3D CARD TILT EFFECT */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination, index) => (
            <ScrollReveal key={destination.id} delay={index * 100}>
              <TiltCard className="group relative bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-pine-400 dark:hover:border-pine-600 shadow-lg flex flex-col h-full cursor-default">
                
                {/* Image Container with 3D Hover Zoom */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.heroImage}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-bold text-goldenhour-300 border border-goldenhour-500/30 font-mono">
                      {destination.altitude}
                    </span>
                    
                    <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold text-white">
                      {destination.temperature}
                    </span>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-bold text-goldenhour-300 block mb-0.5">
                      {destination.hindiName}
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight">
                      {destination.name}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-1 font-light mt-0.5">
                      {destination.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  {/* Meta details */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Altitude</span>
                      <strong className="text-slate-900 dark:text-white">{destination.altitude}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Season</span>
                      <strong className="text-slate-900 dark:text-white">{destination.bestTimeToVisit}</strong>
                    </div>
                  </div>

                  {/* Creator Secret Spot Callout */}
                  {destination.secretSpot && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 dark:border-amber-900/40 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-extrabold text-[11px] mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="truncate">Secret Spot: {destination.secretSpot.title || 'Hidden Scenic Viewpoint'}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {destination.secretSpot.description || 'Untouched valley ridge and mountain viewpoints.'}
                      </p>
                    </div>
                  )}

                  {/* Highlights Pills */}
                  {Array.isArray(destination.mustVisitSpots) && destination.mustVisitSpots.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {destination.mustVisitSpots.slice(0, 3).map((spot, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200"
                        >
                          {spot}
                        </span>
                      ))}
                      {destination.mustVisitSpots.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                          +{destination.mustVisitSpots.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Price & Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Starting Route</span>
                      <strong className="text-base font-extrabold text-pine-800 dark:text-pine-400">
                        ₹{destination.startingPrice.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-slate-500"> / person</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectDestination(destination.id)}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="Inspect full guide & stays"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onBookDirect(destination.name)}
                        className="btn-3d px-4 py-2.5 rounded-xl bg-pine-700 hover:bg-pine-800 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore Route</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      )}

    </section>
  );
};
