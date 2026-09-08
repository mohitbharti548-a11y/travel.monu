import { AppNotification, NotificationType, BookingItem, CustomTripRequest } from '../types';

type NotificationListener = (notifications: AppNotification[], latestToast?: AppNotification) => void;

class NotificationEngine {
  private notifications: AppNotification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Initial Seed Notifications for realistic experience
    this.notifications = [
      {
        id: 'notif-1',
        type: 'road_weather_alert',
        title: 'Road & Pass Advisory Live',
        message: 'Atal Tunnel North Portal & Kunzum Pass are dry and open. Clear morning transit.',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        timeAgo: '15m ago',
        isRead: false,
        priority: 'normal',
        data: { linkAction: 'open_weather' }
      },
    ];
  }

  // Web Audio Harmonic Crystal Glass Chime (synthesized without external audio files)
  private playChime(type: NotificationType) {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';

      if (type === 'payment_received' || type === 'booking_confirmed') {
        // High upbeat dual harmonic chime
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6
      } else if (type === 'ticket_generated') {
        // Elegant crystal harp ping
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.2); // E6
      } else if (type === 'road_weather_alert') {
        // Attention soft bell
        osc.frequency.setValueAtTime(440.00, now); // A4
        osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.15); // C#5
      } else {
        // Standard notification chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
      }

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      // Audio playback silently suppressed if blocked by browser autoplay policy
    }
  }

  public subscribe(listener: NotificationListener) {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(latestToast?: AppNotification) {
    const list = [...this.notifications];
    this.listeners.forEach((listener) => listener(list, latestToast));
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'timeAgo' | 'isRead'>) {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      isRead: false
    };

    this.notifications = [newNotif, ...this.notifications];
    this.playChime(newNotif.type);
    this.emit(newNotif);
    return newNotif;
  }

  // --- Specialized High-Value Trigger Methods ---

  public notifyBookingConfirmed(booking: BookingItem) {
    return this.addNotification({
      type: 'booking_confirmed',
      title: 'Reservation Confirmed! 🎉',
      message: `Pass #${booking.bookingRef} for ${booking.title} (${booking.passengers} Nomads) is confirmed.`,
      priority: 'urgent',
      data: {
        bookingRef: booking.bookingRef,
        destination: booking.destination,
        travelerName: booking.primaryTraveler,
        amount: booking.paidAmount,
        linkAction: 'open_bookings'
      }
    });
  }

  public notifyTicketGenerated(booking: BookingItem) {
    return this.addNotification({
      type: 'ticket_generated',
      title: 'Official Boarding Pass Issued 📜',
      message: `Verified PDF Boarding Pass #${booking.bookingRef} has been sealed with QR verification.`,
      priority: 'high',
      data: {
        bookingRef: booking.bookingRef,
        destination: booking.destination,
        travelerName: booking.primaryTraveler,
        linkAction: 'open_bookings'
      }
    });
  }

  public notifyCustomRequestCreated(request: CustomTripRequest) {
    return this.addNotification({
      type: 'custom_request_created',
      title: 'Custom Query Sent to Monu 📝',
      message: `Request #${request.requestRef} (${request.days}D/${request.nights}N, ${request.travelers} Nomads) dispatched to creator review.`,
      priority: 'normal',
      data: {
        requestRef: request.requestRef,
        travelerName: request.travelerName,
        destination: request.selectedSpots.join(', '),
        linkAction: 'open_custom_requests'
      }
    });
  }

  public notifyCustomRequestApproved(request: CustomTripRequest) {
    return this.addNotification({
      type: 'custom_request_approved',
      title: "Itinerary Approved by Monu! ✨",
      message: `Bespoke itinerary #${request.requestRef} is approved at ₹${request.adminQuotedPrice.toLocaleString('en-IN')}. Payment is unlocked.`,
      priority: 'urgent',
      data: {
        requestRef: request.requestRef,
        travelerName: request.travelerName,
        amount: request.adminQuotedPrice,
        linkAction: 'open_custom_requests'
      }
    });
  }

  public notifyPaymentReceived(amount: number, ref: string, travelerName: string) {
    return this.addNotification({
      type: 'payment_received',
      title: 'Payment Successfully Processed 💰',
      message: `₹${amount.toLocaleString('en-IN')} received via Razorpay/UPI for ${ref} (${travelerName}).`,
      priority: 'urgent',
      data: {
        amount,
        bookingRef: ref,
        travelerName,
        linkAction: 'open_bookings'
      }
    });
  }

  public notifyRoadWeatherAlert(title: string, message: string) {
    return this.addNotification({
      type: 'road_weather_alert',
      title,
      message,
      priority: 'high',
      data: {
        linkAction: 'open_weather'
      }
    });
  }

  public markAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.emit();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.emit();
  }

  public clearAll() {
    this.notifications = [];
    this.emit();
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }
}

export const notificationEngine = new NotificationEngine();
