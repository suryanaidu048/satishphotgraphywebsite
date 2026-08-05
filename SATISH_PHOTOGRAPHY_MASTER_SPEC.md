SATISH_PHOTOGRAPHY_MASTER_SPEC.md

Satish Photography --- Master Project Specification

1. Project Overview

Build a production-ready luxury photography portfolio website forSatish Photography.

The website should feel cinematic, premium, editorial, modern, elegant,and fast. It should communicate craftsmanship through restrained design,beautiful photography, smooth motion, and excellent usability.

Use the reference website only for inspiration regarding overallexperience and visual quality. Do not copy code or copyrightedassets.

Reference: https://luxury-frames-47.preview.emergentagent.com/

2. Core Objectives

Award-quality user experience

Minimal yet luxurious UI

Fully responsive

Fast (95+ Lighthouse)

SEO optimized

Accessible

Production-ready

Fully editable from an Admin Dashboard

Firebase-powered Headless CMS

No hardcoded content

3. Tech Stack

Next.js 15

React 19

TypeScript

Tailwind CSS

shadcn/ui (customized)

Framer Motion

GSAP + ScrollTrigger

Lenis

Three.js + React Three Fiber

Firebase Authentication

Cloud Firestore

Firebase Storage

Vercel Deployment

4. Design Guidelines

Luxury black theme

Editorial layouts

Large typography

Minimal interface

Massive whitespace

Elegant serif headings

Clean sans-serif body

Warm gold accents (subtle)

No clutter

Motion should enhance storytelling

5. Public Website Pages

Home

Portfolio

Gallery

Services

Pricing

About

Testimonials

Awards

FAQ

Booking

Contact

Privacy Policy

Terms

404

6. Homepage Sections

Homepage must be fully dynamic.

Render sections from Firestore.

Sections:

Hero

Featured Gallery

Latest Work

About

Services

Awards

Pricing

Testimonials

FAQ

Booking CTA

Contact

Footer

Admin can:

Reorder

Hide

Publish

Preview

7. Firebase Architecture

Firebase is the complete backend.

Use:

Firebase Authentication

Cloud Firestore

Firebase Storage

Everything is loaded from Firebase.

No hardcoded content.

8. Firestore Collections

homepageSections

hero

gallery

galleryCategories

featuredProjects

latestProjects

services

pricingPlans

about

awards

testimonials

faq

bookings

messages

contact

navigation

footer

socialLinks

websiteSettings

seo

analytics

9. Firebase Storage

/gallery /gallery/wedding /gallery/prewedding /gallery/candid/gallery/events /gallery/portrait /gallery/drone /gallery/commercial/videos /hero /logos /testimonials

10. Admin Dashboard

Professional SaaS-style UI using customized shadcn/ui.

Modules:

Dashboard

Homepage Builder

Hero Manager

Gallery Manager

Album Manager

Services

Pricing

Testimonials

Awards

FAQ

Bookings

Messages

Contact

Navigation

Footer

SEO

Analytics

Settings

Profile

11. Homepage Builder

Create a visual page builder.

Drag & Drop sections.

Toggle visibility.

Configure layouts.

Publish instantly.

Realtime sync with Firestore.

12. Gallery Manager

Upload

Replace

Delete

Rename

Crop

Drag & Drop Reordering

Feature Image

Hide Image

Albums

Categories

Store media in Firebase Storage.

Store metadata in Firestore.

13. Pricing Manager

CRUD pricing plans.

Editable:

Title

Subtitle

Price

Features

Badge

CTA

Visibility

Order

Public website updates automatically.

14. Booking System

Firestore backed.

Admin receives bookings instantly.

Track booking status.

15. Contact System

Firestore backed contact messages.

Dashboard inbox.

Editable contact information.

16. Animations

Use:

Lenis

GSAP

Framer Motion

Keep animations premium and restrained.

Three.js only where it enhances the experience.

17. Reusable Architecture

Every page section is an independent React component.

Each component fetches data from Firebase.

Avoid duplicated logic.

18. Folder Structure

src/ app/ components/ ui/ sections/ admin/ firebase/ hooks/ lib/services/ contexts/ animations/ types/ utils/

19. Performance

Lighthouse 95+

Lazy loading

Code splitting

Image optimization

Responsive

Accessible

20. Security

Protected admin routes.

Firebase Auth.

Firestore Rules.

Storage Rules.

Environment variables.

21. Future Scalability

Architecture must support:

Blog

Client Portal

Password-Protected Galleries

Print Store

AI Search

Multiple Photographers

Multi-language

Multi-theme

Multiple Admin Roles

22. Acceptance Criteria

No hardcoded content

Every section editable from admin

Homepage reorderable

Images stored in Firebase Storage

Metadata stored in Firestore

Pricing editable

Hero editable

Gallery editable

SEO editable

Fully responsive

Production-ready

Clean architecture

TypeScript strict mode

Optimized for deployment on Vercel









Set up production Firebase environment

Configure Auth, Firestore, Storage, and app settings.
Add required environment variables and verify all services connect.
Secure the admin area

Restrict admin access to authenticated users only.
Add role-based checks and protect Firestore write operations.
Replace JSON editing with a real admin UI

Build structured forms for homepage section content.
Add validation and save feedback for each field.
Implement content persistence for all major sections

Extend the CMS beyond the homepage to gallery, services, pricing, testimonials, and booking content.
Fix and finalize the booking/inquiry flow

Connect the form to a real submission pipeline.
Send confirmations and store inquiries safely.
Add SEO and metadata

Implement page titles, descriptions, Open Graph tags, and structured data.
Generate a sitemap and robots file.
Improve performance and image handling

Optimize images, add responsive sizing, and reduce unnecessary client rendering.
Audit Core Web Vitals and fix the biggest issues.
Improve accessibility and UX polish

Check keyboard navigation, contrast, form labels, and screen-reader support.
Refine motion and mobile behavior.
Add testing and CI

Add unit and integration tests for core flows.
Set up linting, type checking, and automated checks in CI.
Prepare deployment and monitoring

Configure staging/production deployment flow.
Add logging, analytics, and error monitoring for production reliability.