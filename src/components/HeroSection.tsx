import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Sparkles, 
  Home, 
  Volume2, 
  VolumeX, 
  ArrowRight
} from 'lucide-react';
import { Destination, DestinationId } from '../types';

interface HeroSectionProps {
  onSearch: (params: { destination: string; date: string; travelers: number; category: string }) => void;
  onSelectDestination: (id: DestinationId) => void;
  destinations: Destination[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectDestination,
  destinations
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'stays'>('packages');
  const [selectedDest, setSelectedDest] = useState<string>('spiti');
  const [travelDate, setTravelDate] = useState<string>('2026-09-15');
  const [travelers, setTravelers] = useState<number>(2);
  const [isMuted, setIsMuted] = useState(true);

  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 3D Scroll Depth Fade-Out for Hero Text
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.45, 0.8], [1, 0.6, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.8], [0, -60]);
  const heroTextScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination: selectedDest,
      date: travelDate,
      travelers: travelers,
      category: activeTab
    });
  };

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-8 pb-16 overflow-hidden"
    >
      {/* Background Cinematic Drone Video & Multi-Layer Mountain Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {/* Full-Bleed Looping Mountain Drone Video with Authentic Himachal Loops */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=85"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 brightness-[0.95] dark:brightness-[0.75]"
        >
          <source 
            src="/videos/navbar-loop.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Fallback Image: Authentic Rohtang / Kunzum Snow Pass View */}
        <img
          src="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=85"
          alt="Himachal Snow Passes & Rohtang Heights"
          className="w-full h-full object-cover object-center scale-105 absolute inset-0 -z-10"
        />

        {/* Delicate Cinematic Vignette (Ensures vibrant colors while guaranteeing white text readability) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/65 dark:from-black/75 dark:via-black/40 dark:to-slate-950"></div>
      </div>

      {/* Floating Video Ambient Controls (Mute & Play/Pause) */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleVideoPlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md shadow-md border border-white/20 hover:bg-black/80 transition-all cursor-pointer"
          title={isVideoPlaying ? "Pause background drone video" : "Play background drone video"}
        >
          <span className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
          <span>{isVideoPlaying ? 'Live Reel' : 'Paused'}</span>
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md shadow-md border border-white/20 hover:bg-black/80 transition-all cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isMuted ? 'Muted' : 'Pahadi Audio'}</span>
        </button>
      </div>

      {/* 3D Animated Hero Typography */}
      <motion.div 
        style={{ opacity: heroTextOpacity, y: heroTextY, scale: heroTextScale }}
        className="max-w-4xl mx-auto text-center z-10 pt-6 sm:pt-10"
      >
        {/* Curated Himalayan Circuits Emblem */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/30 shadow-lg mb-6 animate-float">
          <span className="text-amber-300 font-extrabold text-xs tracking-wider uppercase">Spiti • Manali • Kaza</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-100">
            Ground-Level Creator Expertise
          </span>
        </div>

        {/* 3D Dimensional Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-5 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] font-heading">
          Travel Himachal Like a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-emerald-200 font-extrabold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Local, Not a Tourist.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-100 font-medium max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          Handpicked mountain chalets, secret trails, private 4x4 Spiti safaris, and direct WhatsApp access to local creators.
        </p>

        {/* Minimalist Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          {[
            { id: 'packages', label: 'Curated Itineraries', icon: Sparkles },
            { id: 'stays', label: 'Handpicked Homestays', icon: Home }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'packages' | 'stays')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pine-700 text-white shadow-lg scale-105 border border-pine-600'
                    : 'bg-white/90 text-slate-800 hover:bg-white border border-white/40 shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Minimalist Floating Glassmorphism Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-4xl mx-auto bg-white/95 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {/* Destination */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/90 focus-within:ring-2 focus-within:ring-pine-700">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pine-700" />
                Where To?
              </label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none cursor-pointer"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id} className="text-slate-900">
                    {d.name} ({d.hindiName})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Date */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/90 focus-within:ring-2 focus-within:ring-pine-700">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-pine-700" />
                When?
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Travelers */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/90 focus-within:ring-2 focus-within:ring-pine-700">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-pine-700" />
                Travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Solo Nomad</option>
                <option value={2}>2 Wanderers (Duo / Couple)</option>
                <option value={4}>4 Crew (Private 4x4)</option>
                <option value={6}>6+ Group Expedition</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full bg-pine-700 hover:bg-pine-800 text-white font-extrabold text-xs sm:text-sm rounded-xl py-3 px-5 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore Itineraries</span>
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};
