import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Plus, 
  Minus, 
  Maximize2, 
  Layers, 
  MapPin, 
  Navigation, 
  Mountain, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';

export interface MapSiteLocation {
  id: string;
  name: string;
  regionName: string;
  altitude: number;
  lat: number;
  lng: number;
  type: string;
  isSelected?: boolean;
}

interface InteractiveDynamicMapProps {
  sites: MapSiteLocation[];
  onSelectSite?: (siteName: string) => void;
  className?: string;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showConnectingRoute?: boolean;
  highlightedRegionId?: string;
}

// Site Coordinates Registry (High-precision GPS for Himachal spots)
export const HIMACHAL_GPS_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Manali Region
  'Old Manali Heritage Village & Cafes': { lat: 32.2562, lng: 77.1738 },
  'Jogini Waterfalls Pine Trail': { lat: 32.2700, lng: 77.1950 },
  'Sethan Igloo Village & Apple Orchards': { lat: 32.2040, lng: 77.2380 },
  'Atal Tunnel North Portal & Sissu Waterfall': { lat: 32.4820, lng: 77.1350 },
  'Solang Valley Snow Activity Point': { lat: 32.3160, lng: 77.1580 },
  'Hampta Pass Trekking Trailhead': { lat: 32.2850, lng: 77.3400 },
  'Hadimba Devi Ancient Wooden Temple': { lat: 32.2483, lng: 77.1804 },
  'Vashisht Hot Sulfur Springs': { lat: 32.2612, lng: 77.1878 },

  // Spiti Valley
  'Key Monastery (1000-Year Gompa)': { lat: 32.2980, lng: 78.0120 },
  'Chandratal Crescent Glacial Lake (4,300m)': { lat: 32.4824, lng: 77.6160 },
  'Hikkim World Highest Post Office (4,440m)': { lat: 32.2540, lng: 78.0770 },
  'Komic Highest Inhabited Village & Tangyud Gompa': { lat: 32.2380, lng: 78.0930 },
  'Langza Giant Golden Buddha & Marine Fossils': { lat: 32.2680, lng: 78.0430 },
  'Dhankar Cliffside Monastery & Hidden Lake': { lat: 32.1180, lng: 78.2140 },
  'Pin Valley National Park & Mudh Village': { lat: 31.9600, lng: 77.9300 },
  'Kibber Sanctuary & Chicham Suspension Bridge': { lat: 32.3330, lng: 77.9950 },
  'Kunzum Pass (4,551m Sacred Stupa)': { lat: 32.3950, lng: 77.6320 },
  'Tabo Monastery (Ajanta of the Himalayas)': { lat: 32.0950, lng: 78.3810 },

  // Dharamshala
  'McLeodGanj Dalai Lama Temple & Tsuglagkhang': { lat: 32.2350, lng: 76.3260 },
  'Triund Ridge Alpine Sunset Trek (2,828m)': { lat: 32.2580, lng: 76.3530 },
  'Bhagsunag Waterfall & Mountain Cafe': { lat: 32.2480, lng: 76.3380 },
  'Dharamkot Bohemian Village & Forest Meditation': { lat: 32.2510, lng: 76.3290 },
  'Palampur 150-Year Heritage Tea Gardens': { lat: 32.1109, lng: 76.5363 },
  'Kangra Ancient Rock Fort & Brajeshwari Temple': { lat: 32.0880, lng: 76.2570 },
  'Norbulingka Tibetan Cultural Art Institute': { lat: 32.1760, lng: 76.3500 },

  // Kullu & Tirthan
  'Tirthan Valley Riverfront & Trout Angling': { lat: 31.6360, lng: 77.3450 },
  'Jibhi Waterfall & Wooden Bridges': { lat: 31.6020, lng: 77.3910 },
  'Jalori Pass & Serolsar Lake Trek (3,120m)': { lat: 31.5360, lng: 77.4020 },
  'Great Himalayan National Park (UNESCO)': { lat: 31.7500, lng: 77.5500 },
  'Kasol & Parvati Pine Riverbank Walks': { lat: 32.0100, lng: 77.3150 },
  'Tosh High Village & Manikaran Hot Springs': { lat: 32.0180, lng: 77.4520 },
  'Naggar Historic Wood-Stone Castle & Art Gallery': { lat: 32.1460, lng: 77.1680 },

  // Shimla
  'The Mall Road, Historic Ridge & Christ Church': { lat: 31.1048, lng: 77.1734 },
  'Jakhu Hanuman Temple & Giant Hilltop Statue': { lat: 31.1010, lng: 77.1850 },
  'Kufri Snow Viewpoint & Nature Park': { lat: 31.0980, lng: 77.2680 },
  'Mashobra Quiet Cedar Forest Trail': { lat: 31.1300, lng: 77.2280 },
  'Narkanda & Hatu Peak Panoramic Temple (3,400m)': { lat: 31.2560, lng: 77.4580 },
  'Chail Palace & World Highest Cricket Ground': { lat: 30.9680, lng: 77.1900 },

  // Mandi
  'Prashar Lake Floating Island & Pagoda Temple': { lat: 31.7540, lng: 77.1010 },
  'Rewalsar Sacred Lotus Lake (Tri-Religious)': { lat: 31.6310, lng: 76.8330 },
  'Barot Valley & Uhl River Hydro Reservoir': { lat: 32.0400, lng: 76.8400 },
  'Bhootnath Temple & Beas River Ghats (Chhoti Kashi)': { lat: 31.7080, lng: 76.9320 },
  'Janjehli Valley Alpine Meadows & Apple Orchards': { lat: 31.5200, lng: 77.1800 },

  // Kinnaur
  'Chitkul (Last Inhabited Indian Village & Baspa River)': { lat: 31.3500, lng: 78.4350 },
  'Kalpa & Sacred Kinner Kailash Sunrise Vista': { lat: 31.5380, lng: 78.2560 },
  'Sangla Valley & Kamru Ancient Wood Fort': { lat: 31.4240, lng: 78.2650 },
  'Roghi Suicide Point & Cliff Hanger Road': { lat: 31.5220, lng: 78.2320 },
  'Nako Lake & 11th-Century Monastery': { lat: 31.8810, lng: 78.6270 },

  // Chamba & Khajjiar
  'Khajjiar Pine Meadow & Mini Switzerland Lake': { lat: 32.5510, lng: 76.0600 },
  'Chamba Town & 10th-Century Laxmi Narayan Temple': { lat: 32.5534, lng: 76.1258 },
  'Chamera Emerald Lake & Speedboating Reservoir': { lat: 32.5800, lng: 75.9800 },
  'Bharmour Chaurasi 84-Temple Complex (Sacred Capital)': { lat: 32.4400, lng: 76.5400 },
  'Manimahesh Kailash Sacred Glacial Lake (4,080m)': { lat: 32.4000, lng: 76.6300 },
  'Kalatop Wildlife Sanctuary & Deodar Canopy Ridge': { lat: 32.5350, lng: 76.0200 },
  'Saach Pass High-Altitude Cliff Road (4,414m to Pangi)': { lat: 33.0100, lng: 76.2400 }
};

export const InteractiveDynamicMap: React.FC<InteractiveDynamicMapProps> = ({
  sites,
  onSelectSite,
  className = '',
  height = '420px',
  initialCenter = [31.95, 77.25], // Centered in Himachal Pradesh
  initialZoom = 8,
  showConnectingRoute = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [mapStyle, setMapStyle] = useState<'topo' | 'dark' | 'streets'>('topo');
  const [activeSitePopup, setActiveSitePopup] = useState<MapSiteLocation | null>(null);

  // Tile layer providers
  const tileProviders = {
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map: &copy; OpenTopoMap (CC-BY-SA)'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB Voyager'
    },
    streets: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap'
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map instance with scroll wheel and touch drag
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      smoothWheelZoom: true,
      maxBounds: [
        [30.0, 75.0], // Southwest bounds of Himachal
        [33.8, 79.5]  // Northeast bounds of Himachal
      ],
      minZoom: 7,
      maxZoom: 16
    } as any);

    mapInstanceRef.current = map;

    // Base Tile Layer
    const baseTile = L.tileLayer(tileProviders[mapStyle].url, {
      maxZoom: 17,
      subdomains: 'abc'
    }).addTo(map);

    (map as any)._baseTileLayer = baseTile;

    // Layer Group for markers & routes
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._baseTileLayer) return;

    map.removeLayer((map as any)._baseTileLayer);
    const newTile = L.tileLayer(tileProviders[mapStyle].url, {
      maxZoom: 17,
      subdomains: 'abc'
    }).addTo(map);
    (map as any)._baseTileLayer = newTile;
  }, [mapStyle]);

  // Update Markers & Route Path dynamically when sites change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const latLngs: L.LatLngExpression[] = [];

    sites.forEach((site, index) => {
      const isSelected = site.isSelected !== false;
      const isHighAltitude = site.altitude > 3500;

      latLngs.push([site.lat, site.lng]);

      // Custom HTML Pin Marker with altitude & glow
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${isSelected ? '<span class="absolute w-8 h-8 rounded-full bg-emerald-500/40 animate-ping"></span>' : ''}
            <div class="px-2 py-1 rounded-xl font-bold text-[11px] shadow-2xl flex items-center gap-1.5 transition-all transform hover:scale-110 border ${
              isSelected
                ? isHighAltitude
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-white border-amber-300 font-extrabold shadow-amber-500/50'
                  : 'bg-emerald-700 text-white ring-2 ring-white border-emerald-500 font-extrabold shadow-emerald-700/50'
                : 'bg-slate-900/90 text-slate-300 border-slate-700'
            }">
              <span class="text-xs">${isHighAltitude ? '❄️' : '🌲'}</span>
              <span class="truncate max-w-[110px]">${site.name.split('(')[0]}</span>
              <span class="text-[9px] font-mono px-1 py-0.2 rounded ${isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}">${site.altitude}m</span>
            </div>
          </div>
        `,
        iconSize: [140, 36],
        iconAnchor: [70, 18]
      });

      const marker = L.marker([site.lat, site.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveSitePopup(site);
        map.flyTo([site.lat, site.lng], Math.max(map.getZoom(), 11), { duration: 1.2 });
        if (onSelectSite) onSelectSite(site.name);
      });

      layerGroup.addLayer(marker);
    });

    // Draw Connecting Highway Route Line
    if (showConnectingRoute && latLngs.length > 1) {
      // Glow shadow line
      const shadowLine = L.polyline(latLngs, {
        color: '#059669',
        weight: 6,
        opacity: 0.35,
        lineCap: 'round'
      });
      layerGroup.addLayer(shadowLine);

      // Main connecting road
      const mainLine = L.polyline(latLngs, {
        color: '#10b981',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '6, 8',
        lineCap: 'round'
      });
      layerGroup.addLayer(mainLine);
      routePolylineRef.current = mainLine;
    }

    // Auto-fit bounds if we have 2 or more selected sites
    if (sites.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
    }
  }, [sites, showConnectingRoute]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetBounds = () => {
    if (mapInstanceRef.current && sites.length > 0) {
      const latLngs = sites.map(s => [s.lat, s.lng] as L.LatLngExpression);
      mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50], maxZoom: 12 });
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950 ${className}`}>
      {/* Real Interactive Leaflet Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height }} 
        className="w-full relative z-0 focus:outline-none"
      />

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl flex flex-col overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-800 text-white transition-colors cursor-pointer border-b border-slate-700/80"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-800 text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Fit Bounds Button */}
        <button
          type="button"
          onClick={handleResetBounds}
          className="p-2.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 text-white shadow-xl hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
          title="Fit Selected Spots in View"
        >
          <Maximize2 className="w-4 h-4 text-pine-400" />
        </button>

        {/* Layer Mode Toggle */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 p-1 flex flex-col gap-1 shadow-xl">
          <button
            type="button"
            onClick={() => setMapStyle('topo')}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
              mapStyle === 'topo' ? 'bg-pine-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏔️ Topo
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('dark')}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
              mapStyle === 'dark' ? 'bg-pine-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛰️ Dark
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
              mapStyle === 'streets' ? 'bg-pine-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌲 Trails
          </button>
        </div>
      </div>

      {/* Dynamic Route Info Legend Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-10 max-w-sm p-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white text-xs space-y-1 shadow-2xl pointer-events-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-extrabold text-xs">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>Interactive Terrain Route</span>
          </div>
          <span className="text-[10px] font-mono bg-pine-900 px-2 py-0.5 rounded-full text-pine-200">
            {sites.length} Active Spot(s)
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          Pinch or scroll to zoom. Drag to explore high-pass mountain routes across Himachal Pradesh.
        </p>
      </div>

      {/* Selected Pin Detail Modal Pill if Clicked */}
      {activeSitePopup && (
        <div className="absolute top-4 left-4 z-10 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/60 shadow-2xl text-white text-xs max-w-xs space-y-2 animate-fadeIn">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">{activeSitePopup.regionName}</span>
              <strong className="text-sm font-extrabold text-white block">{activeSitePopup.name}</strong>
              <span className="text-[10px] text-slate-300">{activeSitePopup.type}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-pine-950 text-pine-300 border border-pine-800 font-mono font-bold text-[10px]">
              {activeSitePopup.altitude}m
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {activeSitePopup.altitude > 3500 
              ? 'High Altitude Alpine Pass. Acclimatization and warm layers required.' 
              : 'Sub-Alpine Pine Valley stop with comfortable mountain climate.'}
          </p>
          <button
            type="button"
            onClick={() => setActiveSitePopup(null)}
            className="w-full py-1 text-center font-bold text-[10px] bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
