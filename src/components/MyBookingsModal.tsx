import React, { useState } from 'react';
import { BookingItem, CustomTripRequest } from '../types';
import { generateNomadTicketPDF } from '../utils/pdfGenerator';
import { notificationEngine } from '../services/notificationEngine';
import { 
  X, 
  Ticket, 
  Download, 
  Send, 
  Calendar, 
  MapPin, 
  Users,
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Check,
  MessageCircle,
  Car,
  Home,
  FileText,
  BellRing
} from 'lucide-react';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  customRequests: CustomTripRequest[];
  onCancelBooking: (bookingId: string) => void;
  onPayCustomTrip: (request: CustomTripRequest) => void;
  onCancelCustomRequest: (request: CustomTripRequest) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  customRequests,
  onCancelBooking,
  onPayCustomTrip,
  onCancelCustomRequest
}) => {
  const [activeTab, setActiveTab] = useState<'passes' | 'custom_requests'>('passes');
  const [pingedIds, setPingedIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Helper to format start date to end date
  const formatTripDateRange = (startDateStr: string, days: number, nights: number) => {
    if (!startDateStr) return `${days} Days / ${nights} Nights`;
    try {
      const start = new Date(startDateStr);
      if (isNaN(start.getTime())) return `${startDateStr} (${days}D / ${nights}N)`;
      const end = new Date(start);
      end.setDate(start.getDate() + Math.max(1, days - 1));

      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      const startFormatted = start.toLocaleDateString('en-IN', options);
      const endFormatted = end.toLocaleDateString('en-IN', options);
      return `${startFormatted} – ${endFormatted} (${days} Days / ${nights} Nights)`;
    } catch {
      return `${startDateStr} (${days}D / ${nights}N)`;
    }
  };

  // Dual Ping Monu: WhatsApp + Website Real-Time Alert Engine
  const handlePingMonu = (req: CustomTripRequest) => {
    // 1. Trigger in-app Website Notification Alert
    notificationEngine.addNotification({
      type: 'custom_request_created',
      title: '🚨 Ping Received by Monu',
      message: `${req.travelerName} pinged for update on Ticket #${req.requestRef} (${req.selectedSpots.join(', ')}).`,
      priority: 'urgent',
      data: {
        requestRef: req.requestRef,
        travelerName: req.travelerName,
        destination: req.selectedSpots.join(', '),
        linkAction: 'open_custom_requests'
      }
    });

    // 2. Mark pinged locally
    setPingedIds(prev => ({ ...prev, [req.id]: true }));

    // 3. Open WhatsApp Direct Message
    const msg = encodeURIComponent(
      `Hi Monu! Following up on my Custom Trip Request (Ticket #${req.requestRef}).\nTraveler: ${req.travelerName}\nRoute: ${req.selectedSpots.join(' → ')}\nDates: ${formatTripDateRange(req.startDate, req.days, req.nights)}\nTravelers: ${req.travelers} Nomads.\nPlease share the curated itinerary update!`
    );
    window.open(`https://wa.me/919653240540?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slatehimachal-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300 shadow-sm">
              <Ticket className="w-6 h-6 text-pine-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Nomad Travel Hub
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track custom itinerary approvals from Monu, make payments, and download official PDF boarding passes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slatehimachal-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('passes')}
            className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'passes'
                ? 'border-pine-700 text-pine-800 dark:text-pine-400 font-extrabold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Confirmed Passes & Tickets ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_requests')}
            className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'custom_requests'
                ? 'border-pine-700 text-pine-800 dark:text-pine-400 font-extrabold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Custom Trip Requests ({customRequests.length})</span>
          </button>
        </div>

        {/* TAB 1: Confirmed Passes */}
        {activeTab === 'passes' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {bookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Ticket className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No active confirmed passes yet</p>
                <p className="text-xs">Book an expedition or design a custom trip with Monu to get started.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="card-3d p-5 rounded-3xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 border border-pine-200 dark:border-pine-800">
                        {booking.bookingRef}
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{booking.title}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${
                      booking.status === 'Confirmed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Traveler</span>
                      <strong className="text-slate-900 dark:text-white text-xs">{booking.primaryTraveler}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Date of Journey</span>
                      <strong className="text-slate-900 dark:text-white text-xs">{booking.travelDate}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Party Size</span>
                      <strong className="text-slate-900 dark:text-white text-xs">{booking.passengers} Nomad(s)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid Amount</span>
                      <strong className="text-pine-800 dark:text-pine-400 text-sm">₹{booking.paidAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {booking.customDaySchedule && booking.customDaySchedule.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-[10px] font-extrabold text-pine-800 dark:text-pine-400 uppercase tracking-wider block">
                        ★ Monu's Tailored Day-by-Day Schedule:
                      </span>
                      <div className="space-y-1.5 pl-1 text-[11px]">
                        {booking.customDaySchedule.map(s => (
                          <p key={s.dayNumber} className="text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-white">Day {s.dayNumber} ({s.title}):</strong> {s.plan} (Stay: {s.stay})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => generateNomadTicketPDF(booking)}
                        className="btn-3d px-4 py-2 rounded-xl font-extrabold text-xs bg-pine-700 hover:bg-pine-800 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Official PDF Boarding Pass</span>
                      </button>

                      <a
                        href={`https://wa.me/919653240540?text=Hi%20Monu!%20Checking%20in%20for%20my%20booking%20${booking.bookingRef}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow"
                      >
                        <Send className="w-3 h-3" />
                        <span>WhatsApp Monu</span>
                      </a>
                    </div>

                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                      >
                        Cancel Booking (Claim Credit Voucher)
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Simplified Custom Trip Requests */}
        {activeTab === 'custom_requests' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {customRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Sliders className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No custom trip requests submitted yet</p>
                <p className="text-xs">Use the Custom Trip Studio on the home page to design your bespoke expedition.</p>
              </div>
            ) : (
              customRequests.map((req) => (
                <div
                  key={req.id}
                  className="card-3d p-5 rounded-3xl bg-slate-50 dark:bg-slatehimachal-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-xs transition-all"
                >
                  {/* 1. Ticket Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl font-mono text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
                        Ticket #{req.requestRef}
                      </span>
                      <strong className="text-slate-900 dark:text-white text-sm sm:text-base font-extrabold">
                        {req.selectedSpots.join(' → ')}
                      </strong>
                    </div>

                    {req.status === 'pending_review' && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin-slow" />
                        <span>UNDER REVIEW BY MONU</span>
                      </span>
                    )}

                    {req.status === 'approved' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-700 animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>APPROVED & QUOTED • READY FOR PAYMENT</span>
                      </span>
                    )}

                    {req.status === 'paid_finalized' && (
                      <span className="px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-950 text-pine-900 dark:text-pine-200 font-extrabold text-[10px] border border-pine-200 dark:border-pine-800">
                        FINALIZED & PASS ISSUED
                      </span>
                    )}
                  </div>

                  {/* 2. Overview of Trip Details & Start-to-End Dates (No Budget Section) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white dark:bg-slatehimachal-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-pine-700 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Trip Dates</span>
                        <strong className="text-slate-900 dark:text-white text-xs">
                          {formatTripDateRange(req.startDate, req.days, req.nights)}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Users className="w-4 h-4 text-pine-700 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Party Size</span>
                        <strong className="text-slate-900 dark:text-white text-xs">
                          {req.travelers} Nomad Traveler{req.travelers > 1 ? 's' : ''} ({req.travelerName})
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Car className="w-4 h-4 text-pine-700 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Stay & Transit</span>
                        <strong className="text-slate-900 dark:text-white text-xs">
                          {req.preferredStayType} • {req.preferredTransit}
                        </strong>
                      </div>
                    </div>

                    {req.specialWishes && (
                      <div className="sm:col-span-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-800 dark:text-slate-200">Special Notes:</strong> {req.specialWishes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. Clean Visual Progress Tracker */}
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slatehimachal-900/70 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="uppercase tracking-wider">Itinerary Curation Progress</span>
                      <span className="font-mono text-pine-700 dark:text-pine-300 font-extrabold">
                        {req.status === 'paid_finalized' ? 'Step 4 of 4 (Complete)' : req.status === 'approved' ? 'Step 3 of 4 (Ready to Pay)' : 'Step 2 of 4 (Under Review)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white">1. Submitted</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center space-y-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs ${
                          req.status === 'approved' || req.status === 'paid_finalized'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-500/30'
                        }`}>
                          {req.status === 'approved' || req.status === 'paid_finalized' ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white">2. Monu Curation</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center space-y-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs ${
                          req.status === 'paid_finalized'
                            ? 'bg-emerald-600 text-white'
                            : req.status === 'approved'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 animate-bounce'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}>
                          {req.status === 'paid_finalized' || req.status === 'approved' ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span>3</span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold ${req.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                          3. Approved & Quoted
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center space-y-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs ${
                          req.status === 'paid_finalized'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}>
                          {req.status === 'paid_finalized' ? <Check className="w-3 h-3 stroke-[3]" /> : <span>4</span>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">4. Confirmed Pass</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Action Area */}
                  {/* Case A: Approved by Monu -> Display Quote + Schedule + Pay Now */}
                  {req.status === 'approved' && (
                    <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-emerald-950 dark:text-emerald-300 font-extrabold text-sm">
                            <Sparkles className="w-4 h-4 text-emerald-700 dark:text-amber-400" />
                            <span>Monu's Tailored Itinerary & Direct Quote</span>
                          </div>
                          {req.adminNotes && <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 italic">"{req.adminNotes}"</p>}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase">Approved Total Quote</span>
                          <strong className="text-xl font-black text-emerald-950 dark:text-emerald-300">
                            ₹{req.adminQuotedPrice.toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>

                      {req.adminCuratedSchedule && req.adminCuratedSchedule.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                          {req.adminCuratedSchedule.map((day) => (
                            <div key={day.dayNumber} className="p-2.5 rounded-xl bg-white dark:bg-slatehimachal-900 border border-emerald-200 dark:border-emerald-800 text-[11px]">
                              <div className="flex justify-between items-center mb-0.5 font-bold">
                                <span className="text-slate-900 dark:text-white">Day {day.dayNumber}: {day.title}</span>
                                <span className="text-pine-800 dark:text-pine-300 text-[10px]">Stay: {day.stay}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{day.plan}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onPayCustomTrip(req)}
                          className="btn-3d px-6 py-3 rounded-xl font-extrabold text-xs bg-pine-700 hover:bg-pine-800 text-white shadow-xl flex items-center gap-2 cursor-pointer"
                        >
                          <span>Review & Pay Now (Split 50% or Full ₹{req.adminQuotedPrice.toLocaleString('en-IN')})</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onCancelCustomRequest(req)}
                          className="px-4 py-3 rounded-xl font-extrabold text-xs border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case B: Pending Review -> Dual Ping Monu (WhatsApp + Real-Time Website Alert) */}
                  {req.status === 'pending_review' && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin-slow" />
                        <span>Monu is actively curating your custom route, vehicle allocations, and homestay availability.</span>
                      </div>

                      <button
                        onClick={() => handlePingMonu(req)}
                        className={`btn-3d px-4 py-2 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                          pingedIds[req.id]
                            ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title="Ping Monu via WhatsApp and Trigger Instant System Alert"
                      >
                        {pingedIds[req.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Pinged Monu ✓ (Alert Sent)</span>
                          </>
                        ) : (
                          <>
                            <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                            <span>Ping Monu (WhatsApp & Site Alert)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

