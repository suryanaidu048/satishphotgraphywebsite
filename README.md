# Satish Photography

Luxury photography portfolio starter built with Next.js, TypeScript, custom shadcn-compatible UI primitives, and Firebase adapters.

## Run locally

1. Copy `.env.example` to `.env.local` and provide the Firebase web app credentials.
2. Run `npm install`.
3. Run `npm run dev`.

The homepage listens to `homepageSections` in Firestore and renders published, visible sections in `order` sequence. It uses a local visual fixture only when no Firebase data is connected, so the initial design can be reviewed without credentials.

`/admin` contains the initial Homepage Builder UI. Wire its actions to authenticated Firestore writes after Firebase Authentication and custom admin claims are configured. Deploy `firestore.rules` and `storage.rules` through the Firebase CLI before production.
