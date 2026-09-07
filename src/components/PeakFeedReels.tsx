import React, { useState } from 'react';
import { ReelPost, DestinationId } from '../types';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Music, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Play, 
  Film,
  Volume2,
  VolumeX,
  ExternalLink
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface PeakFeedReelsProps {
  onOpenUploadModal: () => void;
  onNavigateToDestination: (destId: DestinationId) => void;
  selectedReelFromMini?: ReelPost | null;
  reels: ReelPost[];
}

export const PeakFeedReels: React.FC<PeakFeedReelsProps> = ({
  onOpenUploadModal,
  onNavigateToDestination,
  selectedReelFromMini,
  reels: liveReels
}) => {
  const [reels, setReels] = useState<ReelPost[]>(liveReels);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [heartBurst, setHeartBurst] = useState<{ id: string; key: number } | null>(null);

  React.useEffect(() => {
    setReels(liveReels);
  }, [liveReels]);

  // Filtered Reels based on location
  const filteredReels = reels.filter((r) => {
    if (selectedLocation === 'all') return true;
    return r.destinationId === selectedLocation || r.location.toLowerCase().includes(selectedLocation.toLowerCase());
  });

  // If user clicked mini card, sync active reel
  React.useEffect(() => {
    if (selectedReelFromMini) {
      const idx = reels.findIndex(r => r.id === selectedReelFromMini.id);
      if (idx !== -1) setActiveReelIndex(idx);
    }
  }, [selectedReelFromMini, reels]);

  const handleLike = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          likes: r.hasLiked ? r.likes - 1 : r.likes + 1,
          hasLiked: !r.hasLiked
        };
      }
      return r;
    }));
  };

  // Double-tap heart animation trigger
  const handleDoubleTap = (reelId: string) => {
    setHeartBurst({ id: reelId, key: Date.now() });
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          likes: r.hasLiked ? r.likes : r.likes + 1,
          hasLiked: true
        };
      }
      return r;
    }));
    setTimeout(() => {
      setHeartBurst(null);
    }, 900);
  };

  const activeReel = filteredReels[activeReelIndex] || filteredReels[0] || reels[0];

  return (
    <section id="peak-feed" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Background Mountain Starry Visual Canvas */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-3xl opacity-25 dark:opacity-20">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Himalayan Night Sky & Ridges"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-snowpeak via-snowpeak/90 to-snowpeak dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950"></div>
        <div className="absolute inset-0 bg-topo-pattern opacity-50"></div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" />
            <span>The Peak Feed • Social Proof Hub</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Live Mountain Reels & Stories
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mt-1.5 font-normal leading-relaxed">
            Real stories, uncensored mountain conditions, and magical moments captured by travelers and local guides across Himachal.
          </p>
        </div>

        {/* Instagram Admin Profile & Post Memory Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <a
            href="https://www.instagram.com/travel_monu?stkn=MWU1YXc0bXZ4ZnBwcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d px-4 py-2.5 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-lg flex items-center gap-2 hover:opacity-95 hover:scale-105 transition-all cursor-pointer"
            title="Follow Admin Monu on Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @travel_monu</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onOpenUploadModal}
            className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-pine-700 hover:bg-pine-800 text-white shadow-md flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Your Mountain Memory</span>
          </button>
        </div>
      </div>

      {/* Location Filter Pills ("Show Manali Reels", "Show Spiti Reels", etc.) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-pine-700" /> Filter Region:
        </span>
        {[
          { id: 'all', label: 'All Stories (Himachal)' },
          { id: 'spiti', label: 'Spiti Valley 🏔️' },
          { id: 'manali', label: 'Manali & Solang 🌲' },
          { id: 'dharamshala', label: 'Dharamshala & Kangra 🫖' },
          { id: 'shimla', label: 'Shimla & Mashobra 🏰' },
          { id: 'kaza', label: 'Kaza High Gompas 🛕' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedLocation(tab.id);
              setActiveReelIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedLocation === tab.id
                ? 'bg-pine-700 text-white shadow-md font-extrabold ring-2 ring-pine-700/30'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reels Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 5 Cols: Main Active Vertical Reel Player with Double-Tap Support */}
        <div className="lg:col-span-5 flex justify-center">
          <div 
            onDoubleClick={() => activeReel && handleDoubleTap(activeReel.id)}
            className="relative w-full max-w-[340px] sm:max-w-[360px] h-[580px] sm:h-[620px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-slate-900 bg-black flex flex-col justify-between select-none cursor-pointer group"
          >
            
            {/* Video Canvas / Poster */}
            <div className="absolute inset-0 -z-10">
              <video
                key={activeReel.id}
                src={activeReel.videoUrl}
                poster={activeReel.posterImage}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
            </div>

            {/* Bouncy Double-Tap Heart Burst Animation */}
            {heartBurst && heartBurst.id === activeReel.id && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-ping duration-700">
                <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-[0_10px_25px_rgba(244,63,94,0.9)] transform scale-125" />
              </div>
            )}

            {/* Top Reel Overlay Bar */}
            <div className="p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 border border-white/20">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>The Peak Feed</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* Double Tap Hint Tooltip */}
            <div className="absolute top-16 left-0 right-0 text-center z-10 opacity-0 group-hover:opacity-80 transition-opacity pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md border border-white/10">
                💡 Double-tap to ❤️ like
              </span>
            </div>

            {/* Right Action Icons (Like, Comment, Share) */}
            <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-4">
              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(activeReel.id);
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
                  activeReel.hasLiked
                    ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/50'
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}>
                  <Heart className={`w-5 h-5 ${activeReel.hasLiked ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {activeReel.likes.toLocaleString()}
                </span>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {activeReel.commentsCount}
                </span>
              </div>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Reel link copied to clipboard!");
                }}
                className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Reel Caption & Location Bar */}
            <div className="p-5 text-white z-10 space-y-2.5">
              {/* Creator Info */}
              <div className="flex items-center gap-2.5">
                <img
                  src={activeReel.authorAvatar}
                  alt={activeReel.authorName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs">{activeReel.authorName}</span>
                    {activeReel.isVerifiedTraveler && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                    <a 
                      href="https://www.instagram.com/travel_monu?stkn=MWU1YXc0bXZ4ZnBwcg==" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-amber-300 hover:text-amber-200 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>{activeReel.authorHandle}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>• {activeReel.datePosted}</span>
                  </div>
                </div>
              </div>

              {/* Live Status Pill */}
              {activeReel.liveUpdateStatus && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>{activeReel.liveUpdateStatus}</span>
                </div>
              )}

              {/* Caption */}
              <p className="text-xs text-slate-100 line-clamp-3 leading-relaxed font-light">
                {activeReel.caption}
              </p>

              {/* Location Tag Link */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeReel.destinationId) onNavigateToDestination(activeReel.destinationId);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-800/90 hover:bg-pine-700 text-pine-100 text-[11px] font-bold border border-pine-600/60 backdrop-blur-md transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>📍 {activeReel.location}</span>
                <span className="text-[9px] uppercase underline ml-1 text-amber-300">View Hub</span>
              </button>

              {/* Audio Track */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <Music className="w-3 h-3 animate-spin-slow" />
                <span className="truncate">{activeReel.audioTrack}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Reel Selector List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-lg text-slate-900">
              Trending Mountain Stories ({filteredReels.length})
            </h3>
            <span className="text-xs text-slate-500">
              Click any story to watch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredReels.map((reel, index) => {
              const isActive = reel.id === activeReel.id;
              return (
                <div
                  key={reel.id}
                  onClick={() => setActiveReelIndex(index)}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex gap-4 items-center ${
                    isActive
                      ? 'bg-white border-pine-700 shadow-xl scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 shadow">
                    <img
                      src={reel.posterImage}
                      alt={reel.authorName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {reel.authorName}
                      </span>
                      {reel.isCreator && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold">
                          CREATOR
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                      {reel.caption}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-pine-700" />
                        {reel.location}
                      </span>
                      <span className="font-bold text-rose-500 flex items-center gap-0.5">
                        <Heart className="w-2.5 h-2.5 fill-current" /> {reel.likes}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Official Instagram Feed Callout */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-pink-600 to-amber-500 text-white shadow-md">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">Official Creator Feed • @travel_monu</h4>
                <p className="text-slate-400 text-xs">Watch daily high-altitude trail updates, road statuses & snow conditions.</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/travel_monu?stkn=MWU1YXc0bXZ4ZnBwcg=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>Visit Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-8 p-6 rounded-3xl bg-pine-900 text-white border border-pine-800 flex flex-wrap items-center justify-around gap-4 text-center shadow-lg">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block">4.96/5</span>
              <span className="text-xs text-pine-200">Verified Traveler Rating</span>
            </div>
            <div className="h-8 w-px bg-pine-800 hidden sm:block"></div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 block">3,400+</span>
              <span className="text-xs text-pine-200">Nomads Hosted in Himachal</span>
            </div>
            <div className="h-8 w-px bg-pine-800 hidden sm:block"></div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-300 block">100%</span>
              <span className="text-xs text-pine-200">Weather Guarantee Upheld</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
