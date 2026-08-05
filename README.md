# Satish Photography

Luxury photography portfolio starter built with Next.js, TypeScript, custom shadcn-compatible UI primitives, and Firebase adapters.

## Run locally

1. Copy `.env.example` to `.env.local` and provide the Firebase web app credentials.
2. Run `npm install`.
3. Run `npm run dev`.

The homepage listens to `homepageSections` in Firestore and renders published, visible sections in `order` sequence. It uses a local visual fixture only when no Firebase data is connected, so the initial design can be reviewed without credentials.

## Production setup

This application is a static Firebase Hosting build. Public inquiries and content are stored in Firebase Realtime Database; images are uploaded to Cloudinary using an unsigned upload preset. It does not require Next.js API routes or private Cloudinary credentials in the browser.

1. Enable Email/Password in Firebase Authentication and create the studio user.
2. Give that user the Firebase custom claim `{ admin: true }` using the Admin SDK, then have the user sign out and back in. The admin interface and all content writes require this claim.
3. Create a restricted unsigned Cloudinary upload preset and set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`.
4. Deploy Hosting and Realtime Database rules together: `npx firebase-tools deploy --only hosting,database`.

For a separate email notification workflow, use a Firebase Extension or Cloud Function triggered by new `bookings` and `messages` documents. Do not put mail or media secrets in browser-accessible environment variables.
