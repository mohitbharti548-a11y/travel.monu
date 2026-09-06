import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CloudSnow, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator,
  ArrowRight
} from 'lucide-react';

interface WeatherSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherSecurityModal: React.FC<WeatherSecurityModalProps> = ({
  isOpen,
  onClose
}) => {
  const [calcAmount, setCalcAmount] = useState<number>(25000);
  const [daysBeforeTrip, setDaysBeforeTrip] = useState<number>(10);
  const [isWeatherDisruption, setIsWeatherDisruption] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate refund
  const getRefundResult = () => {
    if (isWeatherDisruption) {
      return {
        type: '100% Creator Weather Credit Voucher',
        amount: calcAmount,
        note: 'Valid for 365 days across any Himachal Nomad package or stay.'
      };
    }
    if (daysBeforeTrip > 7) {
      return {
        type: '100% Cash Refund (Minus ₹500 processing fee)',
        amount: Math.max(0, calcAmount - 500),
        note: 'Direct refund credited back to your original UPI/Card account in 48 hours.'
      };
    }
    if (daysBeforeTrip >= 2 && daysBeforeTrip <= 7) {
      return {
        type: '50% Partial Refund',
        amount: calcAmount * 0.5,
        note: '50% covers vehicle pre-allocation and homestay advance deposits.'
      };
    }
    return {
      type: 'No Cash Refund (<48 Hours)',
      amount: 0,
      note: 'Transport & mountain camps are already dispatched. You may transfer ticket to a friend.'
    };
  };

  const refundCalc = getRefundResult();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slatehimachal-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-goldenhour-950 text-amber-900 dark:text-goldenhour-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Smart Refund & Creator Weather Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear, transparent, creator-friendly policies built for Himalayan terrain unpredictability.
            </p>
          </div>
        </div>

        {/* Tiered Policy Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
            <span className="font-extrabold text-emerald-800 dark:text-emerald-400 block text-sm">100% Refund</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">&gt; 7 Days Before</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Minus nominal ₹500 bank fee.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-goldenhour-950/30 border border-amber-200 dark:border-goldenhour-800/60 space-y-1">
            <span className="font-extrabold text-amber-800 dark:text-goldenhour-400 block text-sm">50% Refund</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">48h – 7 Days</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Covers homestay blockades.</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1">
            <span className="font-extrabold text-rose-800 dark:text-rose-400 block text-sm">Non-Refundable</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">&lt; 48 Hours</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ticket transferrable to friend.</p>
          </div>
        </div>

        {/* The Creator Weather Security Clause */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-pine-900 to-pine-800 dark:from-slatehimachal-900 dark:to-slatehimachal-850 text-white border border-pine-700/80 dark:border-goldenhour-800/60 space-y-2">
          <div className="flex items-center gap-2 text-goldenhour-300 text-xs font-extrabold uppercase tracking-wider">
            <CloudSnow className="w-4 h-4 text-sky-300" />
            <span>The Creator Weather Security Clause</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-light">
            If government authorities shut Kunzum Pass, Rohtang Pass, or the Atal Tunnel due to sudden landslides or heavy blizzards, you are <strong>100% protected</strong>. You receive an instant credit voucher for the full booking value, redeemable anytime within <strong>1 full year (365 days)</strong>.
          </p>
        </div>

        {/* Interactive Refund Simulator */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Calculator className="w-4 h-4 text-pine-600 dark:text-goldenhour-400" />
              <span>Interactive Cancellation & Credit Estimator</span>
            </div>
            <span className="text-[10px] text-slate-400">Try before cancelling</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Booking Value (₹)</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Days Prior to Trip</label>
              <input
                type="number"
                min={0}
                max={30}
                value={daysBeforeTrip}
                onChange={(e) => setDaysBeforeTrip(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="weatherDisrupt"
              checked={isWeatherDisruption}
              onChange={(e) => setIsWeatherDisruption(e.target.checked)}
              className="rounded text-pine-700 dark:text-goldenhour-500 cursor-pointer"
            />
            <label htmlFor="weatherDisrupt" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
              Road closed due to government weather/landslide advisory
            </label>
          </div>

          {/* Calculator Output */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{refundCalc.type}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{refundCalc.note}</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-pine-700 dark:text-goldenhour-400">
                ₹{refundCalc.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          I Understand the Policy
        </button>

      </div>
    </div>
  );
};
