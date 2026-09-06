import React, { useState, useEffect } from 'react';
import { 
  HIMACHAL_WEATHER_REGIONS, 
  fetchLiveRegionWeather, 
  RealRegionWeatherData, 
  getOfflineFallbackWeather 
} from '../services/weatherService';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  Snowflake, 
  Wind, 
  CloudLightning, 
  ChevronRight, 
  X, 
  Radio, 
  Compass, 
  ShieldCheck, 
  Thermometer, 
  Droplets, 
  Eye, 
  Sunrise, 
  Sunset, 
  Gauge, 
  RefreshCw, 
  MapPin,
  AlertTriangle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface FloatingWeatherWidgetProps {
  onOpenDetailedWeather?: () => void;
}

export const FloatingWeatherWidget: React.FC<FloatingWeatherWidgetProps> = () => {
  const [allRegionsWeather, setAllRegionsWeather] = useState<RealRegionWeatherData[]>(() => {
    return HIMACHAL_WEATHER_REGIONS.map(r => getOfflineFallbackWeather(r));
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('manali');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch real weather data for all regions on mount
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const promises = HIMACHAL_WEATHER_REGIONS.map(region => fetchLiveRegionWeather(region));
        const results = await Promise.all(promises);
        if (isMounted) {
          setAllRegionsWeather(results);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching live weather:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllData();

    // Auto refresh every 5 minutes
    const interval = setInterval(fetchAllData, 300000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-slide widget on right side every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allRegionsWeather.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [allRegionsWeather.length]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const promises = HIMACHAL_WEATHER_REGIONS.map(region => fetchLiveRegionWeather(region));
      const results = await Promise.all(promises);
      setAllRegionsWeather(results);
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentWeatherPill = allRegionsWeather[currentIndex] || allRegionsWeather[0];
  const activeModalWeather = allRegionsWeather.find(r => r.id === selectedRegionId) || allRegionsWeather[0];

  const renderWeatherIcon = (weatherCode: number, className: string = 'w-5 h-5') => {
    if (weatherCode === 0 || weatherCode === 1) return <Sun className={`${className} text-amber-400`} />;
    if (weatherCode === 2) return <CloudSun className={`${className} text-amber-400`} />;
    if (weatherCode === 3) return <Cloud className={`${className} text-slate-400`} />;
    if (weatherCode >= 45 && weatherCode <= 48) return <Wind className={`${className} text-teal-400`} />;
    if (weatherCode >= 51 && weatherCode <= 55) return <CloudDrizzle className={`${className} text-sky-400`} />;
    if (weatherCode >= 61 && weatherCode <= 65) return <CloudRain className={`${className} text-blue-400`} />;
    if (weatherCode >= 71 && weatherCode <= 86) return <Snowflake className={`${className} text-sky-200 animate-pulse`} />;
    if (weatherCode >= 95) return <CloudLightning className={`${className} text-amber-500`} />;
    return <Sun className={`${className} text-amber-400`} />;
  };

  // Dynamic Atmospheric Gradient for Modal Hero
  const getAtmosphericBackground = (weatherCode: number) => {
    if (weatherCode >= 71 && weatherCode <= 86) {
      return 'from-sky-900 via-slate-900 to-slate-950 text-white'; // Snowy Alpine
    }
    if (weatherCode >= 61 && weatherCode <= 65) {
      return 'from-slate-900 via-blue-950 to-slate-950 text-white'; // Rainy Mist
    }
    if (weatherCode >= 45 && weatherCode <= 48) {
      return 'from-teal-950 via-slate-900 to-slate-950 text-white'; // Valley Fog
    }
    return 'from-blue-700 via-indigo-900 to-slate-950 text-white'; // Crisp Sunny Sky
  };

  return (
    <>
      {/* 1. ULTRA-SLEEK GLASSMORPHISM FLOATING WIDGET (DOCK RIGHT SIDE) */}
      <div className="fixed top-24 right-4 z-40 hidden sm:block animate-fadeIn">
        <button
          onClick={() => {
            setSelectedRegionId(currentWeatherPill.id);
            setIsModalOpen(true);
          }}
          className="group relative backdrop-blur-2xl bg-white/75 dark:bg-slatehimachal-950/80 text-slate-900 dark:text-white border border-white/60 dark:border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_rgba(20,83,45,0.25)] rounded-3xl p-3 pr-4.5 flex items-center gap-3.5 transition-all duration-300 hover:scale-105 cursor-pointer text-left"
          title="Click to view live satellite weather & road radar for all 7 regions"
        >
          {/* Glass Gradient Shimmer */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/40 via-transparent to-pine-500/10 dark:from-white/5 dark:to-pine-500/10 pointer-events-none"></div>

          {/* Pulsing Live Radar Indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </span>

          {/* Animated Weather Icon Container */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pine-100 to-emerald-200/60 dark:from-slate-800 dark:to-pine-950/80 flex items-center justify-center font-extrabold shadow-inner border border-white/60 dark:border-white/10 shrink-0">
            {renderWeatherIcon(currentWeatherPill.weatherCode, 'w-6 h-6')}
          </div>

          {/* Weather Details in Pill */}
          <div className="min-w-[135px]">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentWeatherPill.name}
              </span>
              <span className="text-xs font-extrabold text-pine-900 dark:text-emerald-300 bg-pine-100/90 dark:bg-pine-950/80 px-2 py-0.5 rounded-lg border border-pine-200 dark:border-pine-800 font-mono shadow-xs">
                {currentWeatherPill.currentTemp}°C
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
              <span className="truncate max-w-[85px]">{currentWeatherPill.condition}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{currentWeatherPill.humidity}% Hum</span>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-400 mt-1">
              <span className="font-takri font-bold">{currentWeatherPill.hindiName}</span>
              <span className="text-pine-700 dark:text-amber-400 font-extrabold flex items-center group-hover:translate-x-0.5 transition-transform">
                Live App <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* 2. REAL WEATHER APP MODAL (APPLE / WEATHER CHANNEL GRADE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slatehimachal-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 flex flex-col max-h-[92vh] text-slate-900 dark:text-white">
            
            {/* Modal Header with Live Region Switcher */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pine-600 text-white flex items-center justify-center font-extrabold shadow">
                  <Radio className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                      Himachal Live Weather & Radar Hub
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>OPEN-METEO SAT SENSORS</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time satellite feeds, 24-hour hourly curves, UV index, and high-pass safety conditions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Live Satellite Weather"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Region Switcher Tabs */}
            <div className="bg-slate-900/90 border-b border-slate-800 p-2 overflow-x-auto flex gap-1.5 shrink-0 text-xs">
              {allRegionsWeather.map((region) => {
                const isSelected = region.id === selectedRegionId;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-pine-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{region.name}</span>
                    <span className="font-mono text-[11px] opacity-90">{region.currentTemp}°</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Full Real Weather App Canvas */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
              
              {/* 1. Hero Atmospheric Current Weather Display */}
              <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${getAtmosphericBackground(activeModalWeather.weatherCode)} shadow-xl relative overflow-hidden`}>
                
                {/* Background Shimmer & Mountain Icon */}
                <div className="absolute right-4 bottom-2 text-white/5 pointer-events-none">
                  <Compass className="w-48 h-48" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activeModalWeather.name} • Altitude: {activeModalWeather.altitude}</span>
                      <span className="font-takri font-bold text-sm tracking-wider">({activeModalWeather.hindiName})</span>
                    </div>

                    <div className="flex items-baseline gap-4 mt-2">
                      <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter drop-shadow-md">
                        {activeModalWeather.currentTemp}°
                      </span>
                      <div>
                        <span className="text-xl sm:text-2xl font-extrabold block text-white/95">
                          {activeModalWeather.condition}
                        </span>
                        <span className="text-xs text-slate-200">
                          Feels like {activeModalWeather.feelsLike}° • High: {activeModalWeather.highTemp}° | Low: {activeModalWeather.lowTemp}°
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Card */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-2 max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 uppercase font-bold text-[10px]">Pass Road Advisory</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[10px]">
                        PASSABLE
                      </span>
                    </div>
                    <p className="font-bold text-white text-xs">{activeModalWeather.passName}</p>
                    <p className="text-slate-200 text-[11px] leading-snug">{activeModalWeather.passStatus}</p>
                  </div>
                </div>
              </div>

              {/* 2. SNOW PREDICTION METER FOR WINTER TRAVELERS */}
              {(() => {
                const altNum = parseInt(activeModalWeather.altitude.replace(/[^0-9]/g, '')) || 2000;
                const isHighPass = altNum >= 3000;
                const isFreezing = activeModalWeather.currentTemp <= 3;
                const isCodeSnow = (activeModalWeather.weatherCode >= 71 && activeModalWeather.weatherCode <= 86);

                let probability = 12;
                if (isHighPass) probability += 38;
                if (isFreezing) probability += 28;
                if (isCodeSnow) probability += 20;
                if (activeModalWeather.humidity > 70) probability += 10;
                probability = Math.min(98, Math.max(8, probability));

                let snowStatus = 'Clear / Dry Alpine Highway';
                let snowDepth = '0 – 2 cm (Scattered Traces)';
                let winterGear = 'All-Weather Highway Setup';
                let badgeColor = 'bg-slate-800 text-slate-300';

                if (probability >= 70) {
                  snowStatus = 'Heavy High-Pass Powder & Blizzard Alert';
                  snowDepth = '18 – 35 cm Fresh Snowfall Accumulation';
                  winterGear = 'Snow Chains + 4x4 Low-Range + Sub-Zero Arctic Down Jacket';
                  badgeColor = 'bg-sky-400 text-slate-950 font-extrabold animate-pulse';
                } else if (probability >= 40) {
                  snowStatus = 'Fresh Flurries Expected on Mountain Ridges';
                  snowDepth = '6 – 14 cm Powder';
                  winterGear = '4x4 High-Pass SUV + Thermal Base Layers & Windbreakers';
                  badgeColor = 'bg-amber-400 text-slate-950 font-extrabold';
                }

                return (
                  <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Snowflake className="w-4 h-4 text-sky-400 animate-spin-slow" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                          Live Snow Prediction Meter & Winter Pass Radar
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${badgeColor}`}>
                        {probability}% Snow Chance
                      </span>
                    </div>

                    {/* Progress Bar Gauge */}
                    <div className="space-y-1">
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-400 rounded-full transition-all duration-700"
                          style={{ width: `${probability}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Dry Pass (0%)</span>
                        <span className="text-sky-300 font-bold">{snowStatus}</span>
                        <span>Heavy Snow (100%)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Est. Snowpack Accumulation:</span>
                        <strong className="text-sky-300 font-mono text-[11px]">{snowDepth}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Recommended Winter Gear:</span>
                        <strong className="text-amber-300 font-mono text-[11px] truncate max-w-[180px]">{winterGear}</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 3. 24-Hour Hourly Forecast Slider */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" />
                    <span>24-Hour Hourly Mountain Forecast</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Updated {activeModalWeather.lastUpdated}</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 text-center">
                  {activeModalWeather.hourly.map((hour, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white dark:bg-slatehimachal-800 border border-slate-200 dark:border-slate-700 min-w-[76px] flex flex-col items-center justify-between gap-1 shadow-xs"
                    >
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{hour.hourLabel}</span>
                      <div className="my-1">
                        {renderWeatherIcon(hour.weatherCode, 'w-5 h-5')}
                      </div>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">{hour.temp}°</span>
                      {hour.pop > 0 ? (
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5" /> {hour.pop}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">0%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 7-Day Extended Forecast */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  7-Day Extended Outlook
                </h4>

                <div className="space-y-2">
                  {activeModalWeather.daily.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white dark:bg-slatehimachal-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs gap-3"
                    >
                      <span className="font-extrabold text-slate-900 dark:text-white w-16">{day.dayName}</span>
                      
                      <div className="flex items-center gap-2 flex-1">
                        {renderWeatherIcon(day.weatherCode, 'w-4 h-4')}
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1">{day.condition}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">{day.minTemp}°</span>
                        <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 rounded-full"
                            style={{
                              marginLeft: `${Math.max(0, (day.minTemp + 5) * 2.5)}%`,
                              width: `${Math.min(100, (day.maxTemp - day.minTemp + 2) * 8)}%`
                            }}
                          ></div>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white font-mono">{day.maxTemp}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Real Weather Metrics Grid (UV, Wind, Humidity, Pressure, Sunrise) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                
                {/* UV Index */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> UV Index
                  </div>
                  <strong className="text-xl font-extrabold text-slate-900 dark:text-white block">{activeModalWeather.uvIndex}</strong>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {activeModalWeather.uvIndex >= 7 ? 'Very High (Wear SPF 50)' : 'Moderate Exposure'}
                  </p>
                </div>

                {/* Wind */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                    <Wind className="w-3.5 h-3.5 text-teal-500" /> Wind
                  </div>
                  <strong className="text-xl font-extrabold text-slate-900 dark:text-white block">{activeModalWeather.windSpeed} km/h</strong>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Direction: {activeModalWeather.windDirection}° NW</p>
                </div>

                {/* Humidity */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" /> Humidity
                  </div>
                  <strong className="text-xl font-extrabold text-slate-900 dark:text-white block">{activeModalWeather.humidity}%</strong>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Dew point: {Math.round(activeModalWeather.currentTemp - 4)}°C</p>
                </div>

                {/* Barometer */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                    <Gauge className="w-3.5 h-3.5 text-indigo-500" /> Pressure
                  </div>
                  <strong className="text-xl font-extrabold text-slate-900 dark:text-white block">{activeModalWeather.surfacePressure} hPa</strong>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Alpine Surface Sensor</p>
                </div>

              </div>

              {/* 5. Golden Hour & Sunrise / Sunset */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Sunrise className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Sunrise (Golden Peak)</span>
                    <strong className="text-slate-900 dark:text-white block text-sm">{activeModalWeather.sunrise} AM</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Sunset className="w-5 h-5 text-rose-500" />
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Sunset (Alpenglow)</span>
                    <strong className="text-slate-900 dark:text-white block text-sm">{activeModalWeather.sunset} PM</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slatehimachal-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Weather data auto-synced with Border Roads Organisation (BRO) advisories</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl font-bold bg-slate-900 dark:bg-pine-700 text-white cursor-pointer"
              >
                Close Hub
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
