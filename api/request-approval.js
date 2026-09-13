import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const CATALOG = 'catalog_v1';

function getDatabase() {
  const app = getApps().length > 0 ? getApps()[0] : initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
  });
  return getFirestore(app);
}

async function readRequests(database) {
  const manifest = await database.doc(`${CATALOG}/custom_requests_manifest`).get();
  if (!manifest.exists) return [];
  const data = manifest.data() || {};
  if (data.format === 'json_chunks' && Number.isInteger(data.chunkCount)) {
    const chunks = await Promise.all(Array.from({ length: data.chunkCount }, (_, index) => database.doc(`${CATALOG}/custom_requests_${index}`).get()));
    return JSON.parse(chunks.map((chunk) => chunk.data()?.chunk || '').join(''));
  }
  const snapshot = await database.doc(`${CATALOG}/custom_requests`).get();
  return snapshot.data()?.payload || [];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const database = getDatabase();
    const requests = await readRequests(database);
    const requestId = req.query.id;
    const body = req.body || {};
    let found = null;
    const updated = requests.map((request) => {
      if (request.id !== requestId && request.requestRef !== requestId) return request;
      found = {
        ...request,
        status: 'approved',
        adminQuotedPrice: Number(body.price || body.adminQuotedPrice || 0),
        adminCuratedSchedule: Array.isArray(body.schedule) ? body.schedule : (body.adminCuratedSchedule || []),
        adminNotes: body.notes || body.adminNotes || '',
        approvedAt: new Date().toISOString().split('T')[0]
      };
      return found;
    });

    if (!found) return res.status(404).json({ error: 'Request not found' });
    const updatedAt = new Date().toISOString();
    await database.doc(`${CATALOG}/custom_requests`).set({ payload: updated, updatedAt }, { merge: true });
    await database.doc(`${CATALOG}/custom_requests_manifest`).set({ format: 'single', chunkCount: 0, updatedAt });
    return res.status(200).json({ success: true, request: found });
  } catch (error) {
    console.error('Request approval failed:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to approve request.' });
  }
}
