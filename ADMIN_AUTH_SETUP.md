# Admin Auth Setup

Do not commit passwords, API keys, or email-provider secrets.

1. In Firebase Authentication, enable **Email/Password**.
2. Create the admin user with the email that will be used in Creator Ops.
3. Set that same email in Vercel as `VITE_ADMIN_EMAIL` and redeploy.
4. Replace `REPLACE_WITH_ADMIN_EMAIL` in `firestore.rules` with the exact lowercase admin email.
5. Deploy rules with `firebase deploy --only firestore:rules`.
6. Store the admin password only in Firebase Auth. It is never written to this repository.

## Vercel Stay Requests

The public stay-booking form submits to `/api/custom-requests`. That Vercel function writes requests to the `catalog_v1/custom_requests` Firestore catalog using Firebase Admin credentials, because public browser clients are not allowed to write directly by `firestore.rules`.

Create a Firebase service-account key in the Firebase Console, then add the entire JSON value to Vercel as a production environment variable named `FIREBASE_SERVICE_ACCOUNT_JSON`. Keep this value secret and never commit it.

```powershell
vercel env add FIREBASE_SERVICE_ACCOUNT_JSON production
npx vercel --prod --yes --scope me1-7120
```

Paste the service-account JSON only into the terminal prompt. After redeployment, verify:

```powershell
curl.exe -i https://travelmonu1.vercel.app/api/custom-requests
```

The endpoint should return HTTP 200 instead of HTTP 503.

Approval emails are sent by a Vercel serverless function through the Brevo HTTP API. Configure these environment variables in Vercel under Project Settings -> Environment Variables:

- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME` (optional)

The sender address must be verified in Brevo. Do not put these values in `VITE_*` variables or commit them to the repository. The approval flow calls `/api/send-approval-email` after a custom request changes to `approved`. Redeploy Vercel after adding or changing the variables. The old Firebase Functions SMTP integration should remain disabled to avoid duplicate messages and does not need Secret Manager.

## Admin WhatsApp Alerts

The Firebase Functions WhatsApp pipeline uses the Meta WhatsApp Cloud API. Configure these Firebase Functions secrets:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `ADMIN_WHATSAPP_NUMBER` (international digits only, for example `919653240540`)
- `WHATSAPP_TEMPLATE_NAME`

Create and approve a WhatsApp template in Meta Business Manager before deploying. Use a template named `admin_new_booking` or set the exact approved name as `WHATSAPP_TEMPLATE_NAME`. The template should contain one body variable:

`New Himachal Nomad booking/request received:\n{{1}}`

The function sends the full booking or request details as variable `{{1}}`. It watches `bookings_manifest` for new confirmed bookings and `custom_requests_manifest` for new stay/custom-trip requests. A Firestore delivery record prevents duplicate alerts when a trigger retries.

Set the secrets interactively so they never enter Git:

```powershell
firebase functions:secrets:set WHATSAPP_ACCESS_TOKEN
firebase functions:secrets:set WHATSAPP_PHONE_NUMBER_ID
firebase functions:secrets:set ADMIN_WHATSAPP_NUMBER
firebase functions:secrets:set WHATSAPP_TEMPLATE_NAME
firebase deploy --only functions
```

Do not implement this with a browser `wa.me` link: that only opens WhatsApp and cannot securely send an automatic admin notification.