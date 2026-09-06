import React, { useState, useEffect } from 'react';
import { AppNotification, NotificationType } from '../types';
import { notificationEngine } from '../services/notificationEngine';
import { 
  Bell, 
  CheckCircle2, 
  Ticket, 
  Sliders, 
  CreditCard, 
  CloudSnow, 
  Radio, 
  X, 
  Check, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Flame,
  Zap,
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface NotificationCenterProps {
  onOpenBookings: () => void;
  onOpenWeather: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onOpenBookings,
  onOpenWeather
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [showTestPanel, setShowTestPanel] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = notificationEngine.subscribe((updatedList, latestToast) => {
      setNotifications(updatedList);
      if (latestToast) {
        setActiveToast(latestToast);
        // Auto-dismiss toast after 6 seconds
        const timer = setTimeout(() => {
          setActiveToast((prev) => (prev?.id === latestToast.id ? null : prev));
        }, 6000);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleActionClick = (notif: AppNotification) => {
    notificationEngine.markAsRead(notif.id);
    setIsOpen(false);
    setActiveToast(null);

    if (notif.data?.linkAction === 'open_bookings' || notif.data?.linkAction === 'open_custom_requests') {
      onOpenBookings();
    } else if (notif.data?.linkAction === 'open_weather') {
      onOpenWeather();
    }
  };

  const renderIcon = (type: NotificationType) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'ticket_generated':
        return <Ticket className="w-4 h-4 text-pine-600 dark:text-amber-400" />;
      case 'custom_request_created':
        return <Sliders className="w-4 h-4 text-amber-500" />;
      case 'custom_request_approved':
        return <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />;
      case 'payment_received':
        return <CreditCard className="w-4 h-4 text-sky-500" />;
      case 'road_weather_alert':
        return <CloudSnow className="w-4 h-4 text-teal-400" />;
      default:
        return <Radio className="w-4 h-4 text-pine-600" />;
    }
  };

  // Test Run Simulator Handlers
  const handleSimulateBooking = () => {
    const mockRef = `HN-${Math.floor(100000 + Math.random() * 900000)}`;
    notificationEngine.notifyBookingConfirmed({
      id: `test-book-${Date.now()}`,
      bookingRef: mockRef,
      itemType: 'package',
      title: 'Spiti Winter Whiteout Expedition',
      destination: 'Spiti Valley',
      travelDate: '2026-10-15',
      passengers: 2,
      totalAmount: 32000,
      paidAmount: 16000,
      paymentMethod: 'UPI (50% Advance Deposit)',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      primaryTraveler: 'Aarav Mehta',
      contactEmail: 'aarav.mehta@example.com',
      contactPhone: '+91 98765 11223'
    });
  };

  const handleSimulateTicket = () => {
    const mockRef = `HN-${Math.floor(100000 + Math.random() * 900000)}`;
    notificationEngine.notifyTicketGenerated({
      id: `test-tkt-${Date.now()}`,
      bookingRef: mockRef,
      itemType: 'package',
      title: 'Manali & Solang Winter Trail',
      destination: 'Manali',
      travelDate: '2026-11-02',
      passengers: 1,
      totalAmount: 14500,
      paidAmount: 14500,
      paymentMethod: 'Razorpay UPI',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      primaryTraveler: 'Priya Sharma',
      contactEmail: 'priya.sharma@example.com',
      contactPhone: '+91 98765 44556'
    });
  };

  const handleSimulateCustomApproved = () => {
    const mockRef = `REQ-HN-${Math.floor(1000 + Math.random() * 9000)}`;
    notificationEngine.notifyCustomRequestApproved({
      id: `test-req-${Date.now()}`,
      requestRef: mockRef,
      travelerName: 'Vikram Sethi',
      travelerEmail: 'vikram@example.com',
      travelerPhone: '+91 98765 00000',
      days: 6,
      nights: 5,
      travelers: 4,
      startDate: '2026-12-10',
      targetBudgetPerPerson: 12000,
      selectedSpots: ['Spiti Valley', 'Kaza', 'Chandratal Lake'],
      preferredStayType: 'On-Site Hotels',
      preferredTransit: 'Rentals with a Guide',
      specialWishes: 'Photography stops at Ki Gompa & Pin Valley',
      status: 'approved',
      adminQuotedPrice: 48000,
      adminCuratedSchedule: [],
      submittedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleSimulatePaymentDeposit = () => {
    notificationEngine.notifyPaymentReceived(
      12500,
      `HN-${Math.floor(100000 + Math.random() * 900000)}`,
      'Rohan Kapoor'
    );
  };

  const handleSimulateSnowPassAlert = () => {
    const alerts = [
      {
        title: '❄️ Snow Advisory: Kunzum Pass',
        msg: 'Light powder snowfall recorded at Kunzum (4,590m). Snow chains recommended for all 4x4s.'
      },
      {
        title: '☀️ Atal Tunnel North Portal Clear',
        msg: 'Zero ice on North Portal road. 4x2 and tourist buses permitted until 18:00 hrs.'
      },
      {
        title: '🏔️ Rohtang Pass Winter Window Open',
        msg: 'Permit slots open for high-altitude photography. Temperature dropping to -4°C tonight.'
      }
    ];
    const chosen = alerts[Math.floor(Math.random() * alerts.length)];
    notificationEngine.notifyRoadWeatherAlert(chosen.title, chosen.msg);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'bookings') return n.type === 'booking_confirmed' || n.type === 'ticket_generated';
    if (filterType === 'custom') return n.type === 'custom_request_created' || n.type === 'custom_request_approved';
    if (filterType === 'payments') return n.type === 'payment_received';
    if (filterType === 'alerts') return n.type === 'road_weather_alert';
    return true;
  });

  return (
    <>
      {/* 1. Header Bell Icon Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slatehimachal-800 dark:hover:bg-slatehimachal-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          title="Real-Time Alerts & Notification Center"
          aria-label="Alerts Center"
        >
          <Bell className="w-4 h-4" />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* 2. Dropdown Drawer / Flyout */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slatehimachal-950 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fadeIn">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slatehimachal-900/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pine-100 dark:bg-pine-950 text-pine-800 dark:text-pine-300">
                  <Bell className="w-4 h-4 text-pine-700 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Alerts & Dispatch Hub</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => notificationEngine.markAllAsRead()}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-pine-700 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slatehimachal-800 transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <Check className="w-3 h-3" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slatehimachal-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Test Run Simulator Bar */}
            <div className="border-b border-slate-100 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/30">
              <button
                type="button"
                onClick={() => setShowTestPanel(!showTestPanel)}
                className="w-full px-3.5 py-2 text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <strong>⚡ Test Run Engine Triggers (Live Simulator)</strong>
                </span>
                {showTestPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTestPanel && (
                <div className="p-3 bg-white/80 dark:bg-slatehimachal-900/80 border-t border-amber-200/50 dark:border-amber-900/50 grid grid-cols-2 gap-1.5 text-[10px] animate-fadeIn">
                  <button
                    onClick={handleSimulateBooking}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Booking Confirmed</span>
                  </button>

                  <button
                    onClick={handleSimulateTicket}
                    className="p-2 rounded-xl bg-pine-50 dark:bg-pine-950/60 border border-pine-200 dark:border-pine-800 text-pine-800 dark:text-pine-300 font-bold hover:bg-pine-100 flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Ticket className="w-3 h-3 text-pine-600 shrink-0" />
                    <span>Ticket Issued</span>
                  </button>

                  <button
                    onClick={handleSimulateCustomApproved}
                    className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Custom Approved</span>
                  </button>

                  <button
                    onClick={handleSimulatePaymentDeposit}
                    className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold hover:bg-sky-100 flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <CreditCard className="w-3 h-3 text-sky-600 shrink-0" />
                    <span>Split Deposit Paid</span>
                  </button>

                  <button
                    onClick={handleSimulateSnowPassAlert}
                    className="col-span-2 p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-bold hover:bg-teal-100 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <CloudSnow className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>❄️ Snow Radar & Pass Advisory</span>
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex gap-1 overflow-x-auto text-[10px] font-bold bg-slate-50/50 dark:bg-slatehimachal-900/40">
              {[
                { id: 'all', label: 'All' },
                { id: 'bookings', label: 'Bookings & Passes' },
                { id: 'custom', label: 'Custom Itineraries' },
                { id: 'payments', label: 'Payments' },
                { id: 'alerts', label: 'Road & Weather' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    filterType === f.id
                      ? 'bg-pine-700 text-white font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1.5">
                  <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No active alerts in this category</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleActionClick(notif)}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer flex gap-3 text-xs ${
                      notif.isRead
                        ? 'hover:bg-slate-50 dark:hover:bg-slatehimachal-900/60 opacity-80'
                        : 'bg-pine-50/60 dark:bg-pine-950/30 hover:bg-pine-50 dark:hover:bg-pine-950/50 border-l-4 border-pine-600'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-slatehimachal-800 border border-slate-200 dark:border-slate-700 shrink-0 h-fit shadow-xs">
                      {renderIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1 mb-0.5">
                        <strong className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {notif.title}
                        </strong>
                        <span className="text-[9px] text-slate-400 shrink-0 font-medium">{notif.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.data?.linkAction && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-extrabold text-pine-700 dark:text-amber-400">
                          <span>Open details</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2.5 bg-slate-50 dark:bg-slatehimachal-900/90 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 px-4">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-pine-600 dark:text-amber-400" />
                  <span>Real-Time Chimes Active</span>
                </span>
                <button
                  onClick={() => notificationEngine.clearAll()}
                  className="text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear list
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 3. Live Animated Toast Stack (Bottom-Right floating notification) */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
          <div 
            onClick={() => handleActionClick(activeToast)}
            className="p-4 rounded-3xl bg-slate-950/95 text-white border-2 border-pine-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden cursor-pointer group"
          >
            {/* Progress Timer Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-pine-500 animate-pulse"></div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-pine-900/80 border border-pine-700 text-white shrink-0 mt-0.5 shadow-md">
                {renderIcon(activeToast.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                    Live Real-Time Alert
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveToast(null);
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h5 className="font-extrabold text-sm text-white mt-0.5 truncate">{activeToast.title}</h5>
                <p className="text-xs text-slate-300 mt-1 leading-snug line-clamp-2">{activeToast.message}</p>

                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Tap to view in Hub
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

