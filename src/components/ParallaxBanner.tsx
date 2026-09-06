import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mountain, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ParallaxBannerProps {
  onExplorePackages: () => void;
}

// Multi-destination 3D cinematic visual reels across Himachal with custom curated photography
const CINEMATIC_EXPERIENCES = [
  {
    id: 'spiti-kaza',
    title: 'Spiti Valley & 1000-Yr Key Gompa',
    region: 'Kaza & Spiti (3,800m)',
    circuit: 'Spiti • Kaza',
    imageUrl: 'https://cdn1.matadornetwork.com/blogs/1/2021/03/Dhankar-Gompa-monastery-1200x853.jpg',
    description: 'At 4,166m, time stands still. Watch morning clouds dance over Key Monastery, cross Asia highest suspension bridge at Chicham, and touch 50-million-year-old marine fossils in Langza.',
    accentColor: 'from-amber-400 via-amber-200 to-emerald-200'
  },
  {
    id: 'dharamshala-triund',
    title: 'Dharamshala, McLeodGanj & Triund Ridge',
    region: 'Kangra & Dhauladhar (2,828m)',
    circuit: 'Dharamshala • Kangra',
    imageUrl: 'https://anthilladventures.com/wp-content/uploads/2018/07/2.png',
    description: 'Misty pine ridges, Tibetan chanting bowls, and the sheer granite walls of the Dhauladhar. Trek through rhododendron forests to camp under the Milky Way on Triund top.',
    accentColor: 'from-sky-300 via-teal-200 to-emerald-300'
  },
  {
    id: 'manali-passes',
    title: 'Manali, Solang & Rohtang Heights',
    region: 'Kullu & Pir Panjal (3,978m)',
    circuit: 'Manali • Solang',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrYGRuLVn-ZIXoxJPIRMGHQsR-HyrseGmcWSXcwFZQ9Q&s=10',
    description: 'Ancient deodar forests in Old Manali, engineering wonders through the Atal Tunnel, and majestic snow walls at Rohtang Pass connecting green valleys with cold deserts.',
    accentColor: 'from-emerald-300 via-emerald-100 to-amber-200'
  },
  {
    id: 'chamba-khajjiar',
    title: 'Chamba, Khajjiar & Saach Pass',
    region: 'Chamba & Ravi Canyon (4,414m)',
    circuit: 'Chamba • Khajjiar',
    imageUrl: 'https://s7ap1.scene7.com/is/image/incredibleindia/manimahesh-lake-chamba-himachal-pradesh-1-attr-hero?qlt=82&ts=1726730465417',
    description: 'The Mini Switzerland of India, 10th-century royal shikhara temples, emerald waters of Chamera Lake, and the extreme high-altitude cliff roads of Saach Pass.',
    accentColor: 'from-amber-300 via-rose-200 to-amber-100'
  }
];

export const ParallaxBanner: React.FC<ParallaxBannerProps> = ({ onExplorePackages }) => {
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const activeExp = CINEMATIC_EXPERIENCES[activeExpIndex];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // 3D scale, rotation and opacity transformations for deep zoom depth
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 1.18]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -6]);
  const yText = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

  return (
    <ScrollReveal direction="up">
      <div 
        ref={containerRef} 
        className="perspective-container relative min-h-[620px] sm:min-h-[720px] w-full overflow-hidden my-16 flex flex-col items-center justify-between p-6 sm:p-10 rounded-3xl max-w-7xl mx-auto shadow-2xl border border-slate-700/80"
      >
        {/* Zooming Background Image with 3D Depth */}
        <motion.div 
          style={{ scale, rotateX }}
          className="absolute inset-0 w-full h-full z-0 origin-center overflow-hidden"
        >
          <img
            key={activeExp.id}
            src={activeExp.imageUrl}
            alt={activeExp.title}
            className="w-full h-full object-cover object-center filter brightness-[0.75] animate-fadeIn transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/70"></div>
          <div className="absolute inset-0 bg-topo-pattern opacity-30"></div>
        </motion.div>

        {/* Top Destination Fast Switcher Pills */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl">
          {CINEMATIC_EXPERIENCES.map((exp, idx) => {
            const isSelected = activeExpIndex === idx;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveExpIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer backdrop-blur-md border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-105'
                    : 'bg-black/60 text-white hover:bg-black/80 border-white/20'
                }`}
              >
                <span>{exp.region}</span>
              </button>
            );
          })}
        </div>

        {/* Center Floating 3D Content Box with High Contrast Glass Card */}
        <motion.div 
          style={{ y: yText }}
          className="card-3d relative z-10 max-w-3xl mx-auto text-center px-6 py-8 sm:py-10 bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-white/25 text-white shadow-2xl my-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Cinematic Discovery • {activeExp.circuit}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 leading-tight text-3d-heavy">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeExp.accentColor} font-heading`}>
              {activeExp.title}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto mb-6 font-normal leading-relaxed">
            {activeExp.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExplorePackages}
              className="btn-3d px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore {activeExp.region.split('&')[0]} Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom Circuit & Elevation Meta Indicator */}
        <div className="relative z-10 flex items-center justify-between w-full max-w-4xl text-[11px] text-slate-300 font-bold border-t border-white/10 pt-3">
          <span className="text-amber-400 text-sm font-extrabold tracking-widest uppercase">{activeExp.circuit}</span>
          <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            3D Elevation & Pass Discovery
          </span>
        </div>

      </div>
    </ScrollReveal>
  );
};
