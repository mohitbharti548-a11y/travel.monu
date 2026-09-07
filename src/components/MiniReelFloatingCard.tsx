import React, { useState, useEffect } from 'react';
import { ReelPost, DestinationId } from '../types';
import { 
  X, 
  Play, 
  MapPin, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Film 
} from 'lucide-react';

interface MiniReelFloatingCardProps {
  onOpenFullReel: (reel: ReelPost) => void;
  onNavigateToCommunity: () => void;
  reels: ReelPost[];
}

export const MiniReelFloatingCard: React.FC<MiniReelFloatingCardProps> = ({
  onOpenFullReel,
  onNavigateToCommunity,
  reels
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);

  // Show the mini card after user scrolls past 300px
  useEffect(() => {
    const handleScroll = () => {
      if (!isDismissed) {
        if (window.scrollY > 400 && window.scrollY < 3800) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Rotate popular reels every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReelIndex((prev) => (prev + 1) % Math.max(reels.length, 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [reels.length]);

  if (isDismissed || !isVisible) return null;

  const currentReel = reels[currentReelIndex];
  if (!currentReel) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-[280px] sm:max-w-[300px] animate-fadeIn hidden sm:block">
      <div className="relative bg-white/95 dark:bg-slatehimachal-900/95 text-slate-900 dark:text-white border-2 border-pine-700/40 dark:border-pine-500/40 rounded-3xl p-3.5 shadow-2xl backdrop-blur-md hover:shadow-pine-900/20 transition-all">
        
        {/* Dismiss Cross Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-900 dark:bg-slatehimachal-950 text-white hover:bg-black shadow-lg transition-transform hover:scale-110 z-20 cursor-pointer"
          title="Dismiss mini preview"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Mini Reel Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300 text-[9px] font-extrabold uppercase tracking-wider">
            <Film className="w-3 h-3 text-pine-700 dark:text-amber-400" />
            <span>Popular Reel</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
            <Heart className="w-3 h-3 text-rose-500 fill-current" /> {currentReel.likes}
          </span>
        </div>

        {/* Video / Poster Thumbnail Preview */}
        <div 
          onClick={() => {
            onOpenFullReel(currentReel);
            onNavigateToCommunity();
          }}
          className="relative h-32 rounded-2xl overflow-hidden cursor-pointer group mb-2 shadow-inner"
        >
          <img
            src={currentReel.posterImage}
            alt={currentReel.authorName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-slatehimachal-900/90 text-pine-900 dark:text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold truncate">
            📍 {currentReel.location}
          </div>
        </div>

        {/* Caption Snippet & Action */}
        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2">
          "{currentReel.caption}"
        </p>

        <button
          onClick={() => {
            onOpenFullReel(currentReel);
            onNavigateToCommunity();
          }}
          className="w-full py-1.5 rounded-xl bg-pine-700 hover:bg-pine-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <span>Watch in The Peak Feed</span>
          <ArrowRight className="w-3 h-3" />
        </button>

      </div>
    </div>
  );
};
