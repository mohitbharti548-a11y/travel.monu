import React from 'react';
import { Compass, MessageCircle, Heart, ShieldCheck, FileText, Radio } from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';
import { DestinationId } from '../types';

interface FooterProps {
  onSelectDestination: (id: DestinationId) => void;
  onOpenWeatherSecurity: () => void;
  onOpenTerms: () => void;
  onOpenWeatherIntelligence: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectDestination,
  onOpenWeatherSecurity,
  onOpenTerms,
  onOpenWeatherIntelligence,
  onOpenAdmin
}) => {
  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12 overflow-hidden">
      {/* Background High-Altitude Snow Ridge Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <img
          src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2000&q=80"
          alt="Himalayan Passes Silhouette"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950"></div>
        <div className="absolute inset-0 bg-topo-pattern opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand Story & Takri Emblem */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pine-700 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 animate-float" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                  The Himachal Nomad
                </span>
                <span className="block text-[11px] text-amber-400 font-extrabold tracking-widest uppercase">
                  Spiti • Manali • Kaza • Dharamshala
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A localized boutique travel project by creator Monu, crafted to share authentic Himalayan soul, secret valley trails, and zero-commission stays with conscious nomads.
            </p>

            <div className="pt-2">
              <a
                href="https://wa.me/919653240540?text=Hi%20Monu!%20I%20have%20a%20question%20about%20Himachal."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Monu on WhatsApp (+91 96532 40540)</span>
              </a>
            </div>
          </div>

          {/* Col 3: The 7 Destination Hubs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              7 Sacred Hubs
            </h4>
            <ul className="space-y-2">
              {DESTINATIONS.map(d => (
                <li key={d.id}>
                  <button
                    onClick={() => onSelectDestination(d.id)}
                    className="hover:text-amber-400 text-slate-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{d.name} ({d.hindiName})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Nomad Experiences */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Curated Expeditions
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#custom-packages" className="hover:text-white transition-colors">6-Day Spiti & Kaza Circuit</a></li>
              <li><a href="#custom-packages" className="hover:text-white transition-colors">Manali Slow Living & Glamping</a></li>
              <li><a href="#homestays" className="hover:text-white transition-colors">Handpicked Mountain Homestays</a></li>
              <li><a href="#peak-feed" className="hover:text-white transition-colors">The Peak Feed (Stories & Reels)</a></li>
            </ul>
          </div>

          {/* Col 5: Security & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={onOpenWeatherSecurity} className="hover:text-amber-300 text-left flex items-center gap-1 text-amber-400 font-semibold cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Refund & Weather Security Policy</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-emerald-300 text-left flex items-center gap-1 text-emerald-400 font-semibold cursor-pointer">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Terms & Conditions (Nomad Code)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenWeatherIntelligence} className="hover:text-sky-300 text-left flex items-center gap-1 text-sky-400 font-semibold cursor-pointer">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Live Road & Pass Intelligence Hub</span>
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button 
                    onClick={onOpenAdmin} 
                    className="hover:text-amber-400 text-left flex items-center gap-1.5 text-slate-400 font-semibold cursor-pointer hover:underline"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Creator Admin & Operations Login</span>
                  </button>
                </li>
              )}
              <li><span>100% Direct Razorpay Checkout</span></li>
              <li className="pt-2 text-slate-500 font-mono text-[10px]">
                Base: Old Manali Village, HP 175131
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 The Himachal Nomad • Rooted in Himalayan Hospitality & Authentic Local Expeditions.</p>
          <div className="flex items-center gap-2 font-kalam text-slate-400 text-sm">
            <span>"पहाड़ों की गोद में, अपनों के संग"</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
};
