import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CloudSnow, 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  FileText,
  Mountain,
  Calculator,
  Compass
} from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'weather' | 'roads' | 'medical'>('matrix');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Official Refund & Weather Security Policy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground-level, transparent creator protections tailored for the unique unpredictability of Himachal Pradesh.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'matrix', label: '1. Tiered Refund Timelines' },
            { id: 'weather', label: '2. Weather & Landslide Guarantee' },
            { id: 'roads', label: '3. Pass & Tunnel Closures' },
            { id: 'medical', label: '4. AMS & Medical Protocols' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-pine-700 text-pine-800 dark:text-pine-400 font-extrabold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6 overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          
          {/* TAB 1: Tiered Timeline */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                    Tier 1: &gt; 7 Days Notice
                  </span>
                  <strong className="text-xl font-extrabold text-emerald-950 dark:text-emerald-200 block">100% Full Refund</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    If you cancel more than 7 full days prior to departure, 100% of your paid amount is refunded to your original payment source (UPI/Card) within 48–72 hours, minus a nominal ₹500 bank gateway processing fee.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    Tier 2: 48 Hours – 7 Days
                  </span>
                  <strong className="text-xl font-extrabold text-amber-950 dark:text-amber-200 block">50% Partial Refund</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Cancellations made between 48 hours and 7 days receive a 50% refund. The remaining 50% covers mandatory non-refundable advance allocations for local 4x4 drivers and tribal homestay rooms.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
                  <span className="text-xs font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
                    Tier 3: &lt; 48 Hours Notice
                  </span>
                  <strong className="text-xl font-extrabold text-rose-950 dark:text-rose-200 block">Non-Refundable</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    Due to vehicles and high-altitude supplies being fully mobilized and dispatched, cancellations within 48 hours cannot be refunded. However, you may transfer your booking to a friend at zero fee.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Weather & Landslide Guarantee */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-pine-900 dark:bg-pine-950 text-white space-y-3 border border-pine-800">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                  <CloudSnow className="w-5 h-5 text-sky-300" />
                  <span>The Creator 365-Day Weather Security Guarantee</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm">
                  Himachal weather can be unpredictable. If an official travel advisory or natural weather event prevents the tour from taking place:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  <li><strong>100% Credit Voucher:</strong> You receive an instant digital credit voucher for the entire 100% paid value.</li>
                  <li><strong>365 Days Validity:</strong> The credit can be utilized on any date, season, or alternative destination in Himachal over the next 12 months.</li>
                  <li><strong>Free Date Modifications:</strong> Date changes requested due to early weather warnings carry zero rescheduling fees.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Road & Pass Closures */}
          {activeTab === 'roads' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Specific Pass & Route Disruption Rules</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <strong className="text-slate-900 dark:text-white">Kunzum Pass / Spiti Valley Closure:</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    If Kunzum Pass (4,551m) is closed by the Lahaul-Spiti administration due to sudden snowfall, the tour is automatically rerouted via the Shimla-Kinnaur all-weather circuit at no extra vehicle surcharge, or you may claim the full 1-year credit voucher.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <strong className="text-slate-900 dark:text-white">Atal Tunnel / Sissu Road Blockades:</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    If Atal Tunnel traffic is temporarily halted by police due to heavy ice/avalanche clearance, itineraries are seamlessly swapped for Sethan, Hampta Valley, or Old Manali cultural trails until the tunnel reopens.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <strong className="text-slate-900 dark:text-white">River Swell & Flooding:</strong>
                  <p className="text-slate-600 dark:text-slate-300">
                    During heavy monsoon periods in July/August, if highway advisory blocks NH-3 (Chandigarh-Manali), full rescheduling or credit notes are granted immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AMS & Medical */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">High Altitude Acclimatization & Medical Descent</h4>
              <p className="text-slate-600 dark:text-slate-300">
                In destinations above 3,000 meters (Spiti, Kaza, Chandratal, Kunzum), traveler safety is our highest priority:
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <strong className="text-amber-950 dark:text-amber-300">Immediate Descent Protocol:</strong>
                <p className="text-amber-900 dark:text-amber-200">
                  If a traveler exhibits symptoms of severe Acute Mountain Sickness (AMS) verified by our oxygen monitors, our guides immediately arrange prioritized descent to lower altitudes (Kaza Community Health Centre or Tabo).
                </p>
                <p className="text-amber-800 dark:text-amber-400 text-[11px]">
                  Unutilized lodging nights due to emergency medical evacuation are credited as future travel vouchers.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Questions? Contact Monu directly on WhatsApp (+91 96532 40540)</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold bg-pine-700 hover:bg-pine-800 text-white cursor-pointer"
          >
            I Acknowledge Policy
          </button>
        </div>

      </div>
    </div>
  );
};
