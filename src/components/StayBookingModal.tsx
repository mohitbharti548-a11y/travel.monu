import React, { useState } from 'react';
import { 
  X, Calendar, Users, Home, MapPin, Sparkles, ShieldCheck, 
  CheckCircle2, Clock, Utensils, AlertCircle, ChevronRight, Phone
} from 'lucide-react';
import { Stay, UserProfile } from '../types';

interface StayBookingModalProps {
  stay: Stay;
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile | null;
  onOpenAuth: () => void;
  onBookingSubmitted?: (bookingData: any) => void;
}

export const StayBookingModal: React.FC<StayBookingModalProps> = ({
  stay,
  isOpen,
  onClose,
  activeProfile,
  onOpenAuth,
  onBookingSubmitted
}) => {
  if (!isOpen) return null;

  const [checkIn, setCheckIn] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  
  const [checkOut, setCheckOut] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  });

  const [rooms, setRooms] = useState<number>(1);
  const [guests, setGuests] = useState<number>(2);
  const [mealPlan, setMealPlan] = useState<'ep' | 'cp' | 'map'>('cp');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [travelerName, setTravelerName] = useState<string>(activeProfile?.name || '');
  const [travelerPhone, setTravelerPhone] = useState<string>(activeProfile?.phoneNumber || activeProfile?.phone || '');
  const [travelerEmail, setTravelerEmail] = useState<string>(activeProfile?.email || '');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Meal Plan add-ons
  const mealMultiplier = mealPlan === 'ep' ? 0 : mealPlan === 'cp' ? 350 : 850;
  const estimatedTotal = (stay.pricePerNight * nights * rooms) + (mealMultiplier * guests * nights);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const phoneToUse = activeProfile?.phoneNumber || activeProfile?.phone || travelerPhone;
    if (!phoneToUse || phoneToUse.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number for booking confirmations & WhatsApp voucher.');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailToUse = activeProfile?.email || travelerEmail || (phoneToUse + '@nomad.in');
      const nameToUse = activeProfile?.name || travelerName || 'Nomad Traveler';

      const bookingPayload = {
        requestType: 'stay_only',
        stayId: stay.id,
        stayName: stay.name,
        stayLocation: stay.location,
        stayImage: (stay.imageUrl || stay.image),
        destination: stay.location,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        durationDays: nights,
        roomsCount: rooms,
        guestCount: guests,
        travelerCount: guests,
        mealPlan,
        specialNotes,
        estimatedPrice: estimatedTotal,
        budget: '₹' + estimatedTotal.toLocaleString('en-IN') + ' (Estimated)',
        phone: phoneToUse,
        userPhone: phoneToUse,
        name: nameToUse,
        userName: nameToUse,
        email: emailToUse,
        userEmail: emailToUse,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (!res.ok) {
        throw new Error('Failed to submit stay booking request.');
      }

      const resData = await res.json();
      setSubmitSuccess(true);
      if (onBookingSubmitted) {
        onBookingSubmitted(resData);
      }
    } catch (err: any) {
      setError(err.message || 'Error sending stay booking request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Header with Cover */}
        <div className="relative h-44 sm:h-52 bg-stone-950 overflow-hidden">
          <img
            src={(stay.imageUrl || stay.image)}
            alt={stay.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-black/60" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white p-2 rounded-full backdrop-blur-md transition border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40 mb-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handpicked Nomad Stay</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {stay.name}
              </h3>
              <p className="text-xs text-stone-300 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{stay.location}</span>
                <span className="text-stone-500">•</span>
                <span className="capitalize text-stone-400">{stay.type}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">Starting from</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                ₹{stay.pricePerNight.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-stone-400"> / night</span>
            </div>
          </div>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Booking Request Sent for Approval!</h4>
              <p className="text-sm text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
                Your stay request at <strong className="text-emerald-400">{stay.name}</strong> has been sent to Monu & the local host for dates validation. You'll receive a WhatsApp confirmation quote within 15–30 minutes!
              </p>
            </div>
            
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-left max-w-md mx-auto text-xs space-y-2 text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-500">Duration:</span>
                <span className="font-semibold">{nights} Nights ({checkIn} to {checkOut})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Guests & Rooms:</span>
                <span className="font-semibold">{guests} Guests, {rooms} Room(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Host Contact:</span>
                <span className="font-semibold text-emerald-400">+91 96532 40540</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {error && (
              <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Check-In / Check-Out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Check-In Date</span>
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Check-Out Date ({nights} Nights)</span>
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Rooms, Guests & Meal Plan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center space-x-1.5">
                  <Home className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rooms Required</span>
                </label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 outline-none"
                >
                  <option value={1}>1 Room</option>
                  <option value={2}>2 Rooms</option>
                  <option value={3}>3 Rooms</option>
                  <option value={4}>4+ Entire Property</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Guests</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 outline-none"
                >
                  <option value={1}>1 Solo Nomad</option>
                  <option value={2}>2 Guests / Couple</option>
                  <option value={3}>3 Friends</option>
                  <option value={4}>4 Family / Group</option>
                  <option value={6}>6+ Large Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center space-x-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pahadi Meal Plan</span>
                </label>
                <select
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value as any)}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 outline-none"
                >
                  <option value="cp">Breakfast Included (CP)</option>
                  <option value="map">Breakfast + Pahadi Dinner (MAP)</option>
                  <option value="ep">Room Only (EP)</option>
                </select>
              </div>
            </div>

            {/* Traveler Contact Details if not logged in */}
            {!activeProfile && (
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Contact for WhatsApp Voucher</span>
                  </h4>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    required
                    className="w-full bg-stone-900 text-stone-100 border border-stone-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp Number"
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    required
                    className="w-full bg-stone-900 text-stone-100 border border-stone-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Special Request / Custom Note */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Special Host Requests / Mountain View Preference (Optional)
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="E.g., High-speed WiFi needed for remote work, bonfire setup, pet friendly room, late check-in..."
                rows={2}
                className="w-full bg-stone-950 text-stone-200 placeholder-stone-600 border border-stone-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Price Breakdown Footer & Submit */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-stone-400 block">
                  Estimated Total ({nights} Nights • {rooms} Room{rooms > 1 ? 's' : ''})
                </span>
                <span className="text-xl font-bold text-white">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-400 ml-2 font-medium">
                  • Admin Approved Guarantee
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs text-stone-400 hover:text-white bg-stone-800/80 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Booking Request</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
