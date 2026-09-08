const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');

initializeApp();

const resendApiKey = defineSecret('RESEND_API_KEY');
const emailFrom = defineSecret('EMAIL_FROM');

exports.sendCustomRequestApprovalEmail = onDocumentWritten(
  {
    document: 'catalog_v1/custom_requests_manifest',
    secrets: [resendApiKey, emailFrom],
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

    for (const request of approved) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.value()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: emailFrom.value(),
          to: [request.travelerEmail],
          subject: `Your Himachal Nomad itinerary ${request.requestRef} is approved`,
          html: `<h2>Your itinerary is approved</h2><p>Your request <strong>${request.requestRef}</strong> was approved.</p><p>Quoted price: <strong>₹${Number(request.adminQuotedPrice || 0).toLocaleString('en-IN')}</strong></p><p>Open the website and sign in with the same account to review the itinerary and continue to payment.</p>`
        })
      });

      if (!response.ok) {
        logger.error('Approval email failed', { requestRef: request.requestRef, status: response.status });
      }
    }
  }
);