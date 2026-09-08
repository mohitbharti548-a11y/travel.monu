const isValidEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'The Himachal Nomad';

  if (!apiKey || !isValidEmail(senderEmail)) {
    return res.status(500).json({ error: 'Brevo email is not configured' });
  }

  const {
    travelerEmail,
    travelerName,
    requestRef,
    price
  } = req.body || {};

  if (!isValidEmail(travelerEmail) || !requestRef || !travelerName) {
    return res.status(400).json({ error: 'Missing or invalid approval email details' });
  }

  const safePrice = Number(price);
  if (!Number.isFinite(safePrice) || safePrice <= 0) {
    return res.status(400).json({ error: 'Invalid quoted price' });
  }

  const formattedPrice = safePrice.toLocaleString('en-IN');
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: travelerEmail.trim(), name: travelerName.trim() }],
      subject: `Your Himachal Nomad itinerary ${requestRef} is approved`,
      textContent: `Namaste ${travelerName}. Your request ${requestRef} was approved. Quoted price: INR ${formattedPrice}. Sign in to the website to review the itinerary and continue to payment.`,
      htmlContent: `<h2>Your itinerary is approved</h2><p>Namaste <strong>${travelerName}</strong>.</p><p>Your request <strong>${requestRef}</strong> was approved.</p><p>Quoted price: <strong>₹${formattedPrice}</strong></p><p>Sign in to the website to review the itinerary and continue to payment.</p>`
    })
  });

  if (!response.ok) {
    console.error('Brevo approval email failed with status', response.status);
    return res.status(502).json({ error: 'Brevo email delivery failed' });
  }

  return res.status(200).json({ success: true });
}
