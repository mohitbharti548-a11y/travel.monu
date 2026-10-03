import { BookingItem, CustomTripRequest } from '../types';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const telegramBot = {
  /**
   * Sends an instant Telegram alert for a new finalized booking
   */
  async sendBookingAlert(booking: BookingItem) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials missing. Alert skipped.');
      return;
    }

    const text = `🚨 *NEW BOOKING CONFIRMED* 🚨\n\n` +
                 `*Ref:* \`${booking.bookingRef}\`\n` +
                 `*Traveler:* ${booking.primaryTraveler}\n` +
                 `*WhatsApp:* ${booking.contactPhone}\n` +
                 `*Trip:* ${booking.title} (${booking.destination})\n` +
                 `*Date:* ${booking.travelDate}\n` +
                 `*Payment:* ₹${booking.paidAmount.toLocaleString('en-IN')} (Total: ₹${booking.totalAmount.toLocaleString('en-IN')})\n` +
                 `*Method:* ${booking.paymentMethod}\n\n` +
                 `🔗 [Open Admin Panel](https://travelmonu1.vercel.app/admin)`;

    await this.dispatch(text);
  },

  /**
   * Sends an instant Telegram alert for a new custom trip request
   */
  async sendCustomRequestAlert(req: CustomTripRequest) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const dest = Array.isArray(req.selectedSpots) ? req.selectedSpots.join(', ') : req.destination || req.stayName || 'Himachal';
    
    const text = `🏔️ *NEW CUSTOM TRIP REQUEST* 🏔️\n\n` +
                 `*Ref:* \`${req.requestRef}\`\n` +
                 `*Traveler:* ${req.travelerName || 'Nomad'}\n` +
                 `*WhatsApp:* ${req.travelerPhone || 'Not provided'}\n` +
                 `*Duration:* ${req.days} Days / ${req.nights} Nights\n` +
                 `*Destination:* ${dest}\n` +
                 `*Group Size:* ${req.travelers} people\n` +
                 `*Travel Date:* ${req.startDate}\n\n` +
                 `🔗 [Review & Quote in Admin](https://travelmonu1.vercel.app/admin)`;

    await this.dispatch(text);
  },

  /**
   * Core dispatcher function making the secure API call
   */
  async dispatch(text: string) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });

      if (!response.ok) {
        console.error('Failed to send Telegram alert:', await response.text());
      }
    } catch (error) {
      console.error('Network error dispatching Telegram alert:', error);
    }
  }
};
