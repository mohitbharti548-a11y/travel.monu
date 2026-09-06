import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Compass, 
  Heart, 
  Mountain
} from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300">
              <FileText className="w-6 h-6 text-pine-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Terms & Conditions • The Nomad Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground rules for respectful, safe, and conscious travel in Himachal Pradesh.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slatehimachal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          
          {/* 1. Eco Pledge */}
          <div className="p-4 rounded-2xl bg-pine-50 dark:bg-pine-950/40 border border-pine-200 dark:border-pine-800 space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-pine-900 dark:text-pine-300 text-sm">
              <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. Zero-Plastic & Leave No Trace Himalayan Pledge</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              All travelers agree not to litter single-use plastic bottles, snack wrappers, or waste along trails, rivers, or high passes. We encourage bringing a reusable thermal flask for water refilling at homestays and natural mountain springs.
            </p>
          </div>

          {/* 2. Cultural Respect */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white text-sm">
              <Compass className="w-4 h-4 text-pine-700 dark:text-amber-400" />
              <span>2. Sacred Monasteries, Temples & Devta Customs</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Himachal is known as Devbhumi (Land of the Gods). When visiting ancient Gompas in Spiti or Kathkuni temples in Kullu:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-2">
              <li>Always walk clockwise around Stupas, Chortens, and Mani stone walls.</li>
              <li>Remove footwear before entering inner sanctums where requested.</li>
              <li>Seek permission before photographing monks or sacred rituals.</li>
            </ul>
          </div>

          {/* 3. High Altitude & Physical Health */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white text-sm">
              <Mountain className="w-4 h-4 text-pine-700 dark:text-amber-400" />
              <span>3. Physical Fitness & Medical Responsibility</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              High-altitude regions (above 3,000 meters) have lower oxygen levels. Travelers are advised to consult their physician if they have cardiovascular or pulmonary conditions. Acclimatization schedules provided by our team must be followed.
            </p>
          </div>

          {/* 4. Permits & Border Protocols */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white text-sm">
              <ShieldCheck className="w-4 h-4 text-pine-700 dark:text-amber-400" />
              <span>4. Green Permits & Identification</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Travelers must carry valid government-issued photo ID (Aadhaar / Passport). Special eco-permits for Rohtang Pass or Inner Line Permits for foreign nationals traveling past Spiti border zones are arranged by our operations team upon receiving valid ID copies.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>The Himachal Nomad • Registered Tourism Project Manali, HP</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold bg-pine-700 hover:bg-pine-800 text-white cursor-pointer"
          >
            Agree & Close
          </button>
        </div>

      </div>
    </div>
  );
};
