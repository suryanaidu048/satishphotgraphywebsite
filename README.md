# Satish Photography

Luxury photography portfolio starter built with Next.js, TypeScript, custom shadcn-compatible UI primitives, and Firebase adapters.

## Run locally

1. Copy `.env.example` to `.env.local` and provide the Firebase web app credentials.
2. Run `npm install`.
3. Run `npm run dev`.

The homepage listens to `homepageSections` in Firestore and renders published, visible sections in `order` sequence. It uses a local visual fixture only when no Firebase data is connected, so the initial design can be reviewed without credentials.

## Production setup

This application is a static Firebase Hosting build. Public inquiries are stored in Firebase Realtime Database. Administrative image uploads and email notifications require a protected backend; private Cloudinary or mail credentials must never be placed in browser-accessible environment variables.

1. Enable Email/Password in Firebase Authentication and create the studio user.
2. Give that user the Firebase custom claim `{ admin: true }` using the Admin SDK, then have the user sign out and back in. The admin interface and all content writes require this claim.
3. Register a reCAPTCHA v3 site for the production domain, set `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY`, and enable Firebase App Check enforcement for Realtime Database before enabling public inquiry submissions.
4. Implement a Firebase Cloud Function (or equivalent backend) that verifies the Firebase administrator token before issuing a short-lived signed Cloudinary upload. Keep browser-side uploads disabled until it is available.
5. Send email notifications from a database-triggered Cloud Function or Firebase Extension; do not expose an Apps Script mail endpoint to browsers.
6. Deploy Hosting and Realtime Database rules together: `npx firebase-tools deploy --only hosting,database`.

For a separate email notification workflow, use a Firebase Extension or Cloud Function triggered by new `bookings` and `messages` documents. Do not put mail or media secrets in browser-accessible environment variables.
