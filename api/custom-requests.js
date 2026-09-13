import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const CATALOG_COLLECTION = 'catalog_v1';
const REQUESTS_KEY = 'custom_requests';
const MAX_CATALOG_BYTES = 700_000;

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const rawCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawCredentials) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured in Vercel.');
  }

  const credentials = JSON.parse(rawCredentials);
  return initializeApp({
    credential: cert({
      projectId: credentials.project_id || credentials.projectId,
      clientEmail: credentials.client_email || credentials.clientEmail,
      privateKey: (credentials.private_key || credentials.privateKey || '').replace(/\\n/g, '\n')
    })
  });
}

function requestRef() {
  return `REQ-HN-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function readRequests(database) {
  const manifestSnapshot = await database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}_manifest`).get();
  if (!manifestSnapshot.exists) return [];

  const manifest = manifestSnapshot.data() || {};
  if (manifest.format === 'json_chunks' && Number.isInteger(manifest.chunkCount)) {
    const chunks = await Promise.all(
      Array.from({ length: manifest.chunkCount }, (_, index) =>
        database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}_${index}`).get()
      )
    );
    const serialized = chunks.map((snapshot) => snapshot.data()?.chunk || '').join('');
    return JSON.parse(serialized);
  }

  const snapshot = await database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}`).get();
  return Array.isArray(snapshot.data()?.payload) ? snapshot.data().payload : [];
}

async function writeRequests(database, requests) {
  const serialized = JSON.stringify(requests);
  const updatedAt = new Date().toISOString();

  if (new TextEncoder().encode(serialized).length <= MAX_CATALOG_BYTES) {
    await database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}`).set({ payload: requests, updatedAt }, { merge: true });
    await database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}_manifest`).set({
      format: 'single',
      chunkCount: 0,
      updatedAt
    });
    return;
  }

  const chunks = [];
  for (let offset = 0; offset < serialized.length; offset += MAX_CATALOG_BYTES) {
    chunks.push(serialized.slice(offset, offset + MAX_CATALOG_BYTES));
  }

  await database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}_manifest`).set({
    format: 'json_chunks',
    chunkCount: chunks.length,
    updatedAt
  });
  await Promise.all(chunks.map((chunk, index) =>
    database.doc(`${CATALOG_COLLECTION}/${REQUESTS_KEY}_${index}`).set({ chunk, updatedAt })
  ));
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const database = getFirestore(getAdminApp());
    const requests = await readRequests(database);

    if (req.method === 'GET') {
      return res.status(200).json(requests);
    }

    const body = req.body || {};
    const travelerName = body.travelerName || body.name || body.userName || 'Nomad Traveler';
    const travelerPhone = body.travelerPhone || body.phone || body.userPhone || '';
    const travelerEmail = body.travelerEmail || body.email || body.userEmail || `${travelerPhone}@nomad.in`;

    if (String(travelerPhone).replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'A valid traveler phone number is required.' });
    }

    const newRequest = {
      ...body,
      id: body.id || `req-${Date.now()}`,
      requestRef: body.requestRef || requestRef(),
      requestType: body.requestType || 'custom_circuit',
      travelerName,
      userName: travelerName,
      travelerPhone,
      phone: travelerPhone,
      userPhone: travelerPhone,
      travelerEmail,
      email: travelerEmail,
      userEmail: travelerEmail,
      status: body.requestType === 'stay_only' ? 'pending' : 'pending_review',
      adminQuotedPrice: 0,
      adminCuratedSchedule: [],
      submittedAt: body.submittedAt || new Date().toISOString().split('T')[0],
      createdAt: body.createdAt || new Date().toISOString()
    };

    const nextRequests = [newRequest, ...requests.filter((request) => request.id !== newRequest.id)];
    await writeRequests(database, nextRequests);
    return res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Custom request API failed:', error);
    const message = error instanceof Error ? error.message : 'Unable to save custom request.';
    return res.status(message.includes('not configured') ? 503 : 500).json({ error: message });
  }
}
