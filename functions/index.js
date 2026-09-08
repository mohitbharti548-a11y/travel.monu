const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const nodemailer = require('nodemailer');

initializeApp();

const smtpHost = defineSecret('SMTP_HOST');
const smtpPort = defineSecret('SMTP_PORT');
const smtpUser = defineSecret('SMTP_USER');
const smtpPassword = defineSecret('SMTP_PASSWORD');
const emailFrom = defineSecret('EMAIL_FROM');
const whatsappAccessToken = defineSecret('WHATSAPP_ACCESS_TOKEN');
const whatsappPhoneNumberId = defineSecret('WHATSAPP_PHONE_NUMBER_ID');
const adminWhatsappNumber = defineSecret('ADMIN_WHATSAPP_NUMBER');
const whatsappTemplateName = defineSecret('WHATSAPP_TEMPLATE_NAME');

const readChunkedCatalog = async (database, key, manifestSnapshot) => {
  const manifest = manifestSnapshot.data() || {};
  if (manifest.format === 'json_chunks' && typeof manifest.chunkCount === 'number') {
    const snapshots = await Promise.all(
      Array.from({ length: manifest.chunkCount }, (_, index) =>
        database.doc(`catalog_v1/${key}_${index}`).get()
      )
    );
    return JSON.parse(snapshots.map((snapshot) => snapshot.data()?.chunk || '').join(''));
  }

  const snapshot = await database.doc(`catalog_v1/${key}`).get();
  return snapshot.data()?.payload || [];
};

const claimNotification = async (database, notificationId) => {
  try {
    await database.doc(`notification_delivery/${notificationId}`).create({
      createdAt: new Date().toISOString(),
      channel: 'whatsapp'
    });
    return true;
  } catch (error) {
    if (error.code === 6 || error.code === 'already-exists') return false;
    throw error;
  }
};

const formatBookingDetails = (booking) => [
  `Booking: ${booking.bookingRef || booking.id}`,
  `Type: ${booking.itemType || 'booking'}`,
  `Item: ${booking.title || 'N/A'}`,
  `Destination: ${booking.destination || 'N/A'}`,
  `Travel date: ${booking.travelDate || 'N/A'}`,
  `Travelers: ${booking.passengers || 0}`,
  `Amount paid: INR ${Number(booking.paidAmount || 0).toLocaleString('en-IN')}`,
  `Payment: ${booking.paymentMethod || 'N/A'}`,
  `Name: ${booking.primaryTraveler || 'N/A'}`,
  `Email: ${booking.contactEmail || 'N/A'}`,
  `Phone: ${booking.contactPhone || 'N/A'}`
].join('\n');

const formatRequestDetails = (request) => [
  `Request: ${request.requestRef || request.id}`,
  `Type: ${request.requestType || 'custom trip'}`,
  `Stay: ${request.stayName || 'N/A'}`,
  `Destination: ${request.destination || request.stayLocation || 'N/A'}`,
  `Dates: ${request.checkInDate || request.startDate || 'N/A'} to ${request.checkOutDate || 'N/A'}`,
  `Guests: ${request.guestCount || request.travelers || 0}`,
  `Name: ${request.travelerName || request.userName || 'N/A'}`,
  `Email: ${request.travelerEmail || request.email || request.userEmail || 'N/A'}`,
  `Phone: ${request.travelerPhone || request.phone || request.userPhone || 'N/A'}`
].join('\n');

const sendAdminWhatsApp = async (database, notificationId, details) => {
  if (!(await claimNotification(database, notificationId))) return;

  try {
    const templateName = whatsappTemplateName.value();
    const response = await fetch(`https://graph.facebook.com/v22.0/${whatsappPhoneNumberId.value()}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${whatsappAccessToken.value()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: adminWhatsappNumber.value(),
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [{
            type: 'body',
            parameters: [{ type: 'text', text: details }]
          }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API returned ${response.status}: ${await response.text()}`);
    }
  } catch (error) {
    await database.doc(`notification_delivery/${notificationId}`).delete();
    throw error;
  }
};

exports.sendCustomRequestApprovalEmail = onDocumentWritten(
  {
    document: 'catalog_v1/custom_requests_manifest',
    secrets: [smtpHost, smtpPort, smtpUser, smtpPassword, emailFrom],
    region: 'asia-south1'
  },
  async (event) => {
    const database = getFirestore();

    const readCatalog = async (manifestSnapshot) => {
      const manifest = manifestSnapshot.data() || {};
      if (manifest.format === 'json_chunks' && typeof manifest.chunkCount === 'number') {
        const snapshots = await Promise.all(
          Array.from({ length: manifest.chunkCount }, (_, index) =>
            database.doc(`catalog_v1/custom_requests_${index}`).get()
          )
        );
        return JSON.parse(snapshots.map((snapshot) => snapshot.data()?.chunk || '').join(''));
      }

      const snapshot = await database.doc('catalog_v1/custom_requests').get();
      return snapshot.data()?.payload || [];
    };

    const before = event.data?.before?.exists ? await readCatalog(event.data.before) : [];
    const after = event.data?.after?.exists ? await readCatalog(event.data.after) : [];
    const previous = new Map(before.map((request) => [request.id, request]));
    const approved = after.filter((request) => {
      const old = previous.get(request.id);
      return request.status === 'approved' && old?.status !== 'approved' && request.travelerEmail;
    });

    if (approved.length === 0) return;

    const transporter = nodemailer.createTransport({
      host: smtpHost.value(),
      port: Number(smtpPort.value() || 587),
      secure: Number(smtpPort.value() || 587) === 465,
      auth: {
        user: smtpUser.value(),
        pass: smtpPassword.value()
      }
    });

    for (const request of approved) {
      try {
        await transporter.sendMail({
          from: emailFrom.value(),
          to: request.travelerEmail,
          subject: `Your Himachal Nomad itinerary ${request.requestRef} is approved`,
          text: `Your request ${request.requestRef} was approved. Quoted price: INR ${Number(request.adminQuotedPrice || 0).toLocaleString('en-IN')}. Sign in to the website to review the itinerary and continue to payment.`,
          html: `<h2>Your itinerary is approved</h2><p>Your request <strong>${request.requestRef}</strong> was approved.</p><p>Quoted price: <strong>₹${Number(request.adminQuotedPrice || 0).toLocaleString('en-IN')}</strong></p><p>Open the website and sign in with the same account to review the itinerary and continue to payment.</p>`
        });
      } catch (error) {
        logger.error('Approval email failed', { requestRef: request.requestRef, error });
      }
    }
  }
);

const whatsappTriggerOptions = {
  secrets: [whatsappAccessToken, whatsappPhoneNumberId, adminWhatsappNumber, whatsappTemplateName],
  region: 'asia-south1'
};

const processBookingWhatsAppAlert = async (event) => {
  const database = getFirestore();
  const before = event.data?.before?.exists
    ? await readChunkedCatalog(database, 'bookings', event.data.before)
    : [];
  const after = event.data?.after?.exists
    ? await readChunkedCatalog(database, 'bookings', event.data.after)
    : [];
  const previous = new Map(before.map((booking) => [booking.id, booking]));

  for (const booking of after) {
    const old = previous.get(booking.id);
    if (booking.status === 'Confirmed' && old?.status !== 'Confirmed') {
      await sendAdminWhatsApp(database, `booking_${booking.id}_confirmed`, formatBookingDetails(booking));
    }
  }
};

const processStayWhatsAppAlert = async (event) => {
  const database = getFirestore();
  const before = event.data?.before?.exists
    ? await readChunkedCatalog(database, 'custom_requests', event.data.before)
    : [];
  const after = event.data?.after?.exists
    ? await readChunkedCatalog(database, 'custom_requests', event.data.after)
    : [];
  const previous = new Map(before.map((request) => [request.id, request]));

  for (const request of after) {
    const old = previous.get(request.id);
    const isNewStayRequest = request.requestType === 'stay_only'
      && request.status === 'pending'
      && !old;
    const isNewCustomRequest = request.requestType !== 'stay_only'
      && request.status === 'pending_review'
      && !old;

    if (isNewStayRequest || isNewCustomRequest) {
      await sendAdminWhatsApp(database, `request_${request.id}_created`, formatRequestDetails(request));
    }
  }
};

exports.sendBookingWhatsAppAlert = onDocumentWritten(
  { ...whatsappTriggerOptions, document: 'catalog_v1/bookings_manifest' },
  processBookingWhatsAppAlert
);

exports.sendStayRequestWhatsAppAlert = onDocumentWritten(
  { ...whatsappTriggerOptions, document: 'catalog_v1/custom_requests_manifest' },
  processStayWhatsAppAlert
);