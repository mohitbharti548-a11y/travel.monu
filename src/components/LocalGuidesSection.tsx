import React from 'react';
import { LocalGuide } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { 
  Compass, 
  Award, 
  Languages, 
  MessageCircle 
} from 'lucide-react';

interface LocalGuidesSectionProps {
  guides: LocalGuide[];
}

export const LocalGuidesSection: React.FC<LocalGuidesSectionProps> = ({ guides }) => {

  return (
    <section id="guides" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Background Subtle Pine Woods Imagery Canvas */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-3xl opacity-20 dark:opacity-15">
        <img
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=80"
          alt="Himachal Pine Forest & Cedar Woods"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-snowpeak via-snowpeak/90 to-snowpeak dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950"></div>
        <div className="absolute inset-0 bg-topo-pattern opacity-50"></div>
      </div>

      {/* Header with 3D Scroll Reveal */}
      <ScrollReveal direction="up">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-pine-700 dark:text-pine-400 animate-spin-slow" />
            <span>The Pahadi Custodians</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading text-3d-depth">
            Meet Your Local Mountain Guides
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
            Instead of anonymous tour operators, explore with generational locals who know every high mountain pass, monastic lore, and avalanche-safe route.
          </p>

          {/* Monu Assignment Notice Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2.5 shadow-sm text-left sm:text-center">
            <span className="text-base">🛡️</span>
            <span>
              <strong>Personal Guide Matching:</strong> Certified local guides are vetted, hand-picked, and <strong>assigned directly by Monu</strong> to match your bespoke itinerary and altitude pacing upon reservation.
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Guide Cards with 3D Hover Depth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-container">
        {guides.map((guide, idx) => (
          <ScrollReveal key={guide.id} delay={idx * 0.1} direction="up">
            <div className="card-3d group bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
              {/* Guide Avatar & Video Preview */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                {/* Destination & Assignment Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 shadow">
                    📍 {guide.destination}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-pine-900/90 text-pine-200 text-[10px] font-extrabold border border-pine-700 backdrop-blur-md">
                    ⚡ Assigned by Monu
                  </span>
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-extrabold mb-0.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{guide.badge}</span>
                  </div>
                  <h3 className="text-xl font-extrabold">{guide.name}</h3>
                  <p className="text-xs text-slate-200 font-kalam">"{guide.nickname}"</p>
                </div>
              </div>

              {/* Guide Bio & Specs */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {guide.bio}
                </p>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Compass className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" /> Experience
                    </span>
                    <strong className="text-slate-900 dark:text-white font-bold">{guide.experienceYears}+ Years in Himachal</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Languages className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" /> Languages
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {guide.languages.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      🛡️ Booking Safety
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Directly Matched by Monu
                    </span>
                  </div>
                </div>

                {/* Direct Connect Action (Coordinated by Monu) */}
                <a
                  href={`https://wa.me/919653240540?text=Hi%20Monu!%20I%20would%20like%20to%20request%20guide%20${encodeURIComponent(guide.name)}%20allocation%20for%20my%20Himachal%20tour.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slatehimachal-800 hover:bg-pine-50 dark:hover:bg-slatehimachal-700 text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Request {guide.name.split(' ')[0]} via Monu</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
