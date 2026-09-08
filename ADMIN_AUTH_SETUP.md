# Admin Auth Setup

Do not commit passwords, API keys, or email-provider secrets.

1. In Firebase Authentication, enable **Email/Password**.
2. Create the admin user with the email that will be used in Creator Ops.
3. Set that same email in Vercel as `VITE_ADMIN_EMAIL` and redeploy.
4. Replace `REPLACE_WITH_ADMIN_EMAIL` in `firestore.rules` with the exact lowercase admin email.
5. Deploy rules with `firebase deploy --only firestore:rules`.
6. Store the admin password only in Firebase Auth. It is never written to this repository.

The approval email function uses these Firebase Functions secrets/config values:

- `RESEND_API_KEY`
- `EMAIL_FROM`

Deploy functions with `firebase deploy --only functions`. The function watches `catalog_v1/custom_requests` and sends email when a request changes to `approved`.