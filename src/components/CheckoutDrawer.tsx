import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookingItem, TourPackage, ItineraryDay, TransitOption } from '../types';
import { generateNomadTicketPDF } from '../utils/pdfGenerator';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  QrCode, 
  CheckCircle2, 
  Download, 
  Lock, 
  Sparkles, 
  Ticket, 
  ArrowRight,
  Send,
  Heart,
  Compass,
  Mountain,
  FileCheck,
  Copy,
  Check,
  MessageSquare,
  Percent
} from 'lucide-react';
import { UserProfile } from '../types';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutData: {
    itemType: 'package' | 'transit';
    title: string;
    destination: string;
    totalAmount: number;
    travelers: number;
    travelDate: string;
    customizedDays?: ItineraryDay[];
    packageItem?: TourPackage;
    transitItem?: TransitOption;
  } | null;
  onBookingSuccess: (newBooking: BookingItem) => void;
  userProfile?: UserProfile | null;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  checkoutData,
  onBookingSuccess,
  userProfile
}) => {
  const [step, setStep] = useState<'details' | 'nomadCode' | 'payment' | 'processing' | 'confirmed'>('details');
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'split'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('ramesh@okaxis');
  const [travelerName, setTravelerName] = useState(() => userProfile?.name || 'Ramesh Sharma');
  const [travelerEmail, setTravelerEmail] = useState(() => userProfile?.email || 'ramesh.traveler@example.com');
  const [travelerPhone, setTravelerPhone] = useState(() => userProfile?.phone ? `+91 ${userProfile.phone.replace(/^91/, '')}` : '+91 98765 43210');
  const [isCopied, setIsCopied] = useState(false);
  
  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setTravelerName(userProfile.name);
      if (userProfile.email) setTravelerEmail(userProfile.email);
      if (userProfile.phone) {
        const clean = userProfile.phone.replace(/\D/g, '');
        const formatted = clean.length === 12 && clean.startsWith('91') ? `+91 ${clean.substring(2)}` : `+91 ${clean}`;
        setTravelerPhone(formatted);
      }
    }
  }, [userProfile]);

  // The Nomad Code Accord Checkboxes
  const [agreedZeroPlastic, setAgreedZeroPlastic] = useState(false);
  const [agreedCulturalRespect, setAgreedCulturalRespect] = useState(false);
  const [agreedAltitudeSafety, setAgreedAltitudeSafety] = useState(false);
  const [agreedWeatherFlexibility, setAgreedWeatherFlexibility] = useState(false);

  const [completedBooking, setCompletedBooking] = useState<BookingItem | null>(null);

  if (!isOpen || !checkoutData) return null;

  const isNomadCodeComplete = agreedZeroPlastic && agreedCulturalRespect && agreedAltitudeSafety && agreedWeatherFlexibility;

  // Split Payment Calculations
  const effectivePayableNow = paymentPlan === 'split' ? Math.round(checkoutData.totalAmount * 0.5) : checkoutData.totalAmount;
  const balanceDueOnArrival = checkoutData.totalAmount - effectivePayableNow;

  const handleProceedToNomadCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('nomadCode');
  };

  const handleProceedToPayment = () => {
    if (isNomadCodeComplete) {
      setStep('payment');
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    try {
      // 1. Call Backend Order Gateway (Simulated + Live Razorpay Key)
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: effectivePayableNow,
          destination: checkoutData.destination,
          traveler: travelerName
        })
      });
      const orderData = await orderRes.json();
      console.log('💳 Razorpay Order Created:', orderData.orderId);

      setTimeout(() => {
        const generatedRef = `HN-${Math.floor(100000 + Math.random() * 900000)}`;
        const newBooking: BookingItem = {
          id: `book-${Date.now()}`,
          bookingRef: generatedRef,
          itemType: checkoutData.itemType,
          title: checkoutData.title,
          destination: checkoutData.destination,
          travelDate: checkoutData.travelDate,
          passengers: checkoutData.travelers,
          totalAmount: checkoutData.totalAmount,
          paidAmount: effectivePayableNow,
          paymentMethod: paymentPlan === 'split' 
            ? `${paymentMethod.toUpperCase()} (50% Advance Deposit)` 
            : `${paymentMethod.toUpperCase()} (Full 100% Payment)`,
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'Confirmed',
          customizationDetails: {
            upgrades: checkoutData.customizedDays 
              ? checkoutData.customizedDays.filter(d => d.selectedStay === 'luxury').map(d => `Day ${d.dayNumber}: ${d.stayOption.luxuryUpgrade}`)
              : [],
            addOns: checkoutData.customizedDays
              ? checkoutData.customizedDays.flatMap(d => d.activities.filter(a => !a.included && a.selected).map(a => a.name))
              : []
          },
          contactEmail: travelerEmail,
          contactPhone: travelerPhone,
          primaryTraveler: travelerName
        };

        setCompletedBooking(newBooking);
        setStep('confirmed');
        onBookingSuccess(newBooking);

        // Trigger Confetti Celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 1500);
    } catch (err) {
      console.warn('Payment gateway fallback:', err);
    }
  };

  const handleDownloadPDF = () => {
    if (completedBooking) {
      generateNomadTicketPDF(completedBooking);
    }
  };

  const handleCopyConfirmationLink = () => {
    if (!completedBooking) return;
    const confirmUrl = `${window.location.origin}/#pass-${completedBooking.bookingRef}`;
    navigator.clipboard.writeText(confirmUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slatehimachal-900 text-slate-900 dark:text-white h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Drawer Header with Step Indicator */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slatehimachal-950 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-pine-700 text-white shadow">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {step === 'details' && 'Step 1: Traveler Details'}
                {step === 'nomadCode' && 'Step 2: The Nomad Code (Accord)'}
                {step === 'payment' && 'Step 3: Direct Seamless Payment'}
                {step === 'processing' && 'Authorizing Transaction...'}
                {step === 'confirmed' && 'Booking Confirmed! 🎉'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {step === 'nomadCode' ? 'Mandatory Traveler Pledge before Payment' : 'Razorpay Encrypted • Zero Redirect'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slatehimachal-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Traveler Information Form */}
        {step === 'details' && (
          <form onSubmit={handleProceedToNomadCode} className="p-6 space-y-6 flex-1">
            {/* Order Summary Card */}
            <div className="p-4 rounded-2xl bg-pine-50 dark:bg-pine-950/50 border border-pine-200 dark:border-pine-800">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800">
                  {checkoutData.itemType === 'package' ? 'Custom Itinerary' : 'Direct Transit'}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {checkoutData.travelDate}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {checkoutData.title}
              </h4>
              <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-pine-200/60 dark:border-pine-800/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {checkoutData.travelers} Traveler{checkoutData.travelers > 1 ? 's' : ''} (All Inclusive)
                </span>
                <span className="text-xl font-extrabold text-pine-800 dark:text-pine-400">
                  ₹{checkoutData.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Traveler Contact Details */}
            <div className="space-y-3.5 text-xs">
              <h5 className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Contact Information
              </h5>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slatehimachal-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-pine-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email (For Ticket PDF)</label>
                  <input
                    type="email"
                    required
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slatehimachal-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-pine-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    required
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slatehimachal-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-pine-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn-3d w-full py-4 rounded-2xl font-extrabold text-sm bg-pine-700 hover:bg-pine-800 text-white shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue to Nomad Code & Ethics Accord</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: THE NOMAD CODE (Traveler Ethics Accord) */}
        {step === 'nomadCode' && (
          <div className="p-6 space-y-5 flex-1 animate-fadeIn text-xs">
            <div className="p-4 rounded-2xl bg-pine-900 dark:bg-pine-950 text-white space-y-2 shadow-md border border-pine-800">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>The Nomad Code • Conscious Travel Accord</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">
                Before confirming your booking, every traveler pledges to uphold the local sacred ethics of Himachal Pradesh. Please review and check each clause below.
              </p>
            </div>

            {/* Checklist of 4 Nomad Code Pillars */}
            <div className="space-y-3">
              {/* Pillar 1: Zero Plastic */}
              <div 
                onClick={() => setAgreedZeroPlastic(!agreedZeroPlastic)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  agreedZeroPlastic ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-700 dark:border-pine-500 shadow-sm' : 'bg-slate-50 dark:bg-slatehimachal-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={agreedZeroPlastic}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-pine-700 cursor-pointer"
                />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-extrabold">1. Leave No Trace & Zero-Plastic Pledge</strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">I agree not to dispose single-use plastics or trash on trails, mountain rivers, or passes, and will use refillable flasks.</p>
                </div>
              </div>

              {/* Pillar 2: Sacred Monasteries & Devta */}
              <div 
                onClick={() => setAgreedCulturalRespect(!agreedCulturalRespect)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  agreedCulturalRespect ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-700 dark:border-pine-500 shadow-sm' : 'bg-slate-50 dark:bg-slatehimachal-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={agreedCulturalRespect}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-pine-700 cursor-pointer"
                />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-extrabold">2. Respect Sacred Monasteries & Devta Lore</strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">I will respect local traditions, walk clockwise around Stupas and Mani stones, and seek permission before photography.</p>
                </div>
              </div>

              {/* Pillar 3: High-Altitude Health & AMS */}
              <div 
                onClick={() => setAgreedAltitudeSafety(!agreedAltitudeSafety)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  agreedAltitudeSafety ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-700 dark:border-pine-500 shadow-sm' : 'bg-slate-50 dark:bg-slatehimachal-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={agreedAltitudeSafety}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-pine-700 cursor-pointer"
                />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-extrabold">3. High Altitude & Physical Acclimatization</strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">I understand high altitudes (above 3,000 meters) require hydration and acclimatization, and will follow the mountain guide's instructions.</p>
                </div>
              </div>

              {/* Pillar 4: Weather Flexibility */}
              <div 
                onClick={() => setAgreedWeatherFlexibility(!agreedWeatherFlexibility)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  agreedWeatherFlexibility ? 'bg-pine-50 dark:bg-pine-950/60 border-pine-700 dark:border-pine-500 shadow-sm' : 'bg-slate-50 dark:bg-slatehimachal-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={agreedWeatherFlexibility}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-pine-700 cursor-pointer"
                />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-extrabold">4. Mountain Weather Flexibility & Policy</strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">I acknowledge the tiered cancellation terms and the 365-day Creator Weather Guarantee for road closures.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 py-3.5 rounded-2xl font-bold bg-slate-100 dark:bg-slatehimachal-800 hover:bg-slate-200 dark:hover:bg-slatehimachal-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!isNomadCodeComplete}
                onClick={handleProceedToPayment}
                className={`btn-3d w-2/3 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                  isNomadCodeComplete
                    ? 'bg-pine-700 hover:bg-pine-800 text-white shadow-xl cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isNomadCodeComplete ? 'Pledge Accepted • Pay Now' : 'Check All 4 to Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method & Razorpay Checkout */}
        {step === 'payment' && (
          <form onSubmit={handlePayNow} className="p-6 space-y-6 flex-1 animate-fadeIn">
            {/* Payment Plan Selector (Full vs 50% Split) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Choose Payment Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentPlan('full')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentPlan === 'full'
                      ? 'border-pine-700 bg-pine-50/70 dark:bg-pine-950/50 dark:border-pine-500 shadow-sm ring-2 ring-pine-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">100% Full Payment</span>
                    {paymentPlan === 'full' && <CheckCircle2 className="w-4 h-4 text-pine-700 dark:text-emerald-400" />}
                  </div>
                  <div className="text-base font-black text-pine-800 dark:text-pine-300">
                    ₹{checkoutData.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Zero balance on arrival
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentPlan('split')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentPlan === 'split'
                      ? 'border-pine-700 bg-pine-50/70 dark:bg-pine-950/50 dark:border-pine-500 shadow-sm ring-2 ring-pine-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-amber-500" />
                      50% Advance Deposit
                    </span>
                    {paymentPlan === 'split' && <CheckCircle2 className="w-4 h-4 text-pine-700 dark:text-emerald-400" />}
                  </div>
                  <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                    ₹{effectivePayableNow.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
                    Pay ₹{balanceDueOnArrival.toLocaleString('en-IN')} on arrival
                  </span>
                </button>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {paymentPlan === 'split' ? 'Advance Deposit Due Now' : 'Total Payable'}
                </span>
                <span className="text-2xl font-extrabold text-pine-800 dark:text-pine-400">
                  ₹{effectivePayableNow.toLocaleString('en-IN')}
                </span>
                {paymentPlan === 'split' && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    (Remaining ₹{balanceDueOnArrival.toLocaleString('en-IN')} payable directly upon check-in)
                  </span>
                )}
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nomad Code Signed
              </span>
            </div>

            {/* Seamless Payment Methods */}
            <div className="space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Seamless Payment Method
              </h5>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-pine-700 bg-pine-50 dark:bg-pine-950/60 dark:border-pine-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-pine-700 dark:text-amber-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-pine-700 bg-pine-50 dark:bg-pine-950/60 dark:border-pine-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-pine-700 dark:text-amber-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-pine-700 bg-pine-50 dark:bg-pine-950/60 dark:border-pine-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 text-pine-700 dark:text-amber-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">NetBanking</span>
                </button>
              </div>

              {/* UPI Custom Form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Instant UPI QR / Virtual ID</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Auto-Verify</span>
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Enter UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <QrCode className="w-4 h-4 text-pine-700 dark:text-amber-400" />
                    <span>Google Pay, PhonePe, Paytm, BHIM, Cred UPI</span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8892"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="12/28"
                      placeholder="MM/YY"
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="password"
                      defaultValue="•••"
                      placeholder="CVV"
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* NetBanking Form */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Select Bank</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slatehimachal-900 font-bold text-slate-900 dark:text-white">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="btn-3d w-full py-4 rounded-2xl font-extrabold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{effectivePayableNow.toLocaleString('en-IN')} Securely</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Processing State */}
        {step === 'processing' && (
          <div className="p-12 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-pine-700 border-t-transparent animate-spin"></div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Confirming with Himalayan Gateway...</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Securing room allotments, generating QR boarding pass, and dispatching reservation details to Monu.
            </p>
          </div>
        )}

        {/* STEP 5: Booking Confirmed & Pass Issued */}
        {step === 'confirmed' && completedBooking && (
          <div className="p-6 space-y-6 flex-1 animate-fadeIn text-xs">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">Expedition Confirmed!</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                Pass reference <strong className="font-mono text-pine-800 dark:text-pine-300">{completedBooking.bookingRef}</strong> has been issued and stored.
              </p>
            </div>

            {/* Boarding Pass Preview Card */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Boarding Pass</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{completedBooking.title}</strong>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
                  CONFIRMED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block font-medium">Primary Traveler</span>
                  <strong className="text-slate-900 dark:text-white">{completedBooking.primaryTraveler}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date of Journey</span>
                  <strong className="text-slate-900 dark:text-white">{completedBooking.travelDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nomad Passengers</span>
                  <strong className="text-slate-900 dark:text-white">{completedBooking.passengers} Traveler(s)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Amount Paid Now</span>
                  <strong className="text-pine-800 dark:text-pine-400 font-extrabold">₹{completedBooking.paidAmount.toLocaleString('en-IN')}</strong>
                </div>
                {paymentPlan === 'split' && (
                  <div className="col-span-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>Balance Due on Arrival:</span>
                    <strong className="font-extrabold">₹{balanceDueOnArrival.toLocaleString('en-IN')}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Instant Confirmation Links & Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleDownloadPDF}
                className="btn-3d w-full py-3.5 rounded-2xl font-extrabold text-xs bg-pine-700 hover:bg-pine-800 text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Verified PDF Boarding Pass</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/919653240540?text=${encodeURIComponent(
                    `Hi Monu! I just booked my expedition: ${completedBooking.title} (Ref: ${completedBooking.bookingRef}) for ${completedBooking.travelDate}. Paid: ₹${completedBooking.paidAmount.toLocaleString('en-IN')}${paymentPlan === 'split' ? ` (50% Deposit, Balance Due: ₹${balanceDueOnArrival})` : ' (Full)'}. Please confirm local guide & itinerary coordinates.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d py-3 px-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp Monu</span>
                </a>

                <a
                  href={`sms:+919653240540?body=${encodeURIComponent(
                    `Hi Monu, my Himachal Nomad booking is confirmed: ${completedBooking.bookingRef} - ${completedBooking.title} on ${completedBooking.travelDate}. Traveler: ${completedBooking.primaryTraveler}.`
                  )}`}
                  className="btn-3d py-3 px-3 rounded-2xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS Instant Link</span>
                </a>
              </div>

              <button
                onClick={handleCopyConfirmationLink}
                className="w-full py-3 rounded-2xl font-bold text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slatehimachal-800 hover:bg-slate-100 dark:hover:bg-slatehimachal-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Confirmation Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Official Expedition Link</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Close & View in Travel Hub
              </button>
            </div>
          </div>
        )}

        {/* Security Footer Note */}
        <div className="p-4 bg-slate-50 dark:bg-slatehimachal-950 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Protected under Monu's 365-Day Weather & Road Guarantee</span>
        </div>

      </div>
    </div>
  );
};
