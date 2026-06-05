---
title: "Safe Pramaan — A Professional Certificate Management Platform Built From the Ground Up"
date: "2026-06-05"
description: "Safe Pramaan is a full-stack certificate management platform that lets engineers upload, organize, and share their professional credentials with granular privacy controls, credential grouping, and public verification pages — all built on a custom auth microservice and a decoupled backend API."
author: "Aaqil Khan"
tags: ["nextjs", "typescript", "redux-toolkit", "rtk-query", "tailwindcss", "full-stack", "auth", "certificate-management", "engineering"]
coverImage: "/certshare.png"
---

# Safe Pramaan — A Professional Certificate Management Platform Built From the Ground Up

Pramaan. The Sanskrit word for *proof*, *evidence*, *verification*. It is not a word most developers would reach for when naming an app. I chose it deliberately.

The problem this platform solves is a quiet one. Every engineer I know accumulates certifications at a pace that outstrips their ability to organize them. AWS here, Google Cloud there, a Kubernetes cert from last quarter, a security certification from a bootcamp that actually changed how you think about software — and all of it ends up in the same graveyard: the LinkedIn certifications section, a flat scroll of logos that no one reads past the third entry.

There is no structure. There is no narrative. There is no way to hand someone a single link and say: *here is my cloud work, as a curated collection, with the originals attached.*

**Safe Pramaan** exists to solve that exact problem.

---

## 1. The Problem in Concrete Terms

A recruiter lands on a candidate's profile and wants to understand their infrastructure credentials. The certifications are real — AWS Solutions Architect, GCP Associate Cloud Engineer, Terraform Associate, CKA — but they live in a flat list with no grouping, no images of the actual documents, and no verification links. The recruiter has no way to distinguish what matters from what is filler.

A developer wants to share their security certifications with a prospective employer without exposing their entire portfolio. There is no privacy control. It is all public or nothing.

A freelancer wants to send a client a page that shows only the certifications relevant to the engagement. No platform for this exists. They paste a LinkedIn URL and hope for the best.

Safe Pramaan addresses all three scenarios. Each certificate can be set to public or private. Certificates can be grouped into named collections — Cloud, Security, Frontend, DevOps — and each group can be shared independently with a single link. Public certificates render on a clean, branded verification page that any third party can open without an account.

---

## 2. Feature Walkthrough

### Certificate Upload and Management

The upload flow is intentionally thorough. A certificate record captures:

- **Title** — the credential name as it appears on the document
- **Issuer** — the organization that issued it
- **Issue Date** — required, used for chronological ordering
- **Expiry Date** — optional, surfaced on the certificate detail page
- **Credential ID** — the unique identifier assigned by the issuing body, validated against existing records in real time via a debounced API call so duplicates are caught before submission
- **Description** — free-text context about what the certification represents
- **Image** — the certificate document itself, stored in S3 via the Auth Pro media service

File uploads are validated client-side before any network request is initiated. The allowed MIME types are an explicit allowlist — `image/jpeg`, `image/png`, `image/webp`, `image/gif` — checked against both the MIME type and file extension simultaneously. Maximum file size is 10 MB. Drag-and-drop and click-to-select both route through the same validation path.

### Per-Certificate Privacy Controls

Every certificate has a binary visibility state: public or private. The toggle on the preview page calls a dedicated `PATCH /certificate/visibility/:id` endpoint and is disabled while the request is in flight, preventing race conditions from rapid clicks. The dashboard and group views reflect the current state immediately via RTK Query cache invalidation.

### Certificate Groups

Groups are the feature that separates Safe Pramaan from a basic file store. A group is a named collection with its own description, its own public/private state, and its own shareable link. When a group is made public, anyone with the link can view a branded collection page that lists every certificate in the group with its title, issuer, issue date, and a link to the individual certificate's verification page.

This is what makes the platform useful in practice. Instead of sharing a LinkedIn profile, I share a link to my Cloud group when interviewing for an infrastructure role, and a link to my Security group when engaging a client that cares about compliance credentials. The audience sees exactly what is relevant — nothing more.

### Public Verification Pages

Two unauthenticated routes handle public access:

- `/public/[shareToken]` — renders a single certificate with its image, metadata, and a verification badge
- `/public/groups/[id]` — renders a full group collection as a responsive card grid

Both pages are fully standalone, requiring no account and no prior context. They carry the Safe Pramaan branding and a footer credit. A hiring manager or a client can open either link in any browser and see exactly what was shared.

### Dashboard and Account Statistics

The dashboard aggregates the user's full certificate collection and group list in a single view, with live statistics derived from the fetched data:

- Total certificates
- Public certificates (those actively shareable)
- Total views across all public certificates

### Profile Management

The profile page handles name, phone, and avatar. Avatar uploads go to the Auth Pro media service and are immediately persisted to the user's metadata without requiring a separate form save. All inputs carry maxLength constraints — 100 characters for name, 20 for phone — to prevent oversized payloads from reaching the backend.

### Authentication

The full auth flow covers signup, login, password recovery, and password update. Signup collects name, email, phone, and password, with a live password strength checker that evaluates length, uppercase, lowercase, numeric, and special character conditions in real time before the form can be submitted. Password reset is token-based via an email link.

---

## 3. Tech Stack — Complete Breakdown

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack React, SSR + client routing |
| Language | TypeScript 5 | End-to-end type safety |
| UI Library | React 19 | Component model, hooks |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| State Management | Redux Toolkit | Global auth and app state |
| API Layer | RTK Query | Server state, caching, cache invalidation |
| Auth Service | Auth Pro | JWT sessions, user metadata, media uploads |
| Backend API | Custom REST API | Certificates, groups, sync |
| Object Storage | AWS S3 (via Auth Pro) | Certificate images, user avatars |
| Icons | Lucide React | Consistent icon system |
| Package Manager | pnpm | Fast dependency management |
| Hosting | Vercel | Edge deployment, preview environments |

---

## 4. Architecture — How the Pieces Fit Together

Safe Pramaan uses a deliberately decoupled architecture with three distinct services. Understanding why each boundary exists matters more than the boundary itself.

### Auth Pro — The Auth and Media Microservice

Auth Pro is a standalone authentication and media management service. It owns:

- User identity (signup, login, password management)
- User metadata (name, phone, avatar)
- Media storage (certificate images, avatars — proxied to S3)
- JWT issuance and validation

The rationale for a dedicated auth service rather than embedding auth in the main backend is operational: authentication is a solved problem that should not be coupled to the application's domain logic. If the certificate backend needs to be replaced or scaled independently, auth remains stable. If the auth service needs a security patch, it deploys independently without touching the certificate data layer.

### Backend API — Domain Logic

The backend handles certificates and groups. It does not manage users directly — on login, the frontend calls a `/sync` endpoint that creates or updates the user record in the backend database based on the JWT claims from Auth Pro. This keeps user records consistent without duplicating the auth layer.

### Frontend — The RTK Query Routing Layer

The most interesting engineering decision in the frontend is the `baseQueryWithAuthHandling` function in `lib/api/baseQuery.ts`. A single RTK Query base query handles routing to two different API services transparently:

```ts
const isAuthPro = url.includes('/users/me');

let result = isAuthPro
  ? await authProQuery(args, api, extraOptions)
  : await backendQuery(args, api, extraOptions);
```

Any endpoint that targets `/users/me` is routed to the Auth Pro base URL. Everything else goes to the backend. Components and API slice definitions do not need to be aware of which service they are calling — the routing is centralized in one place. The same function handles 401 responses globally: on any unauthorized response, it dispatches `logout()` and redirects to `/login`, so individual API slices do not need to repeat that logic.

### Request Flow Diagram

```
Browser
  │
  ├─ Authentication (signup/login/password)
  │    └─► Auth Pro (/auth/*)
  │
  ├─ User profile reads/writes
  │    └─► Auth Pro (/users/me)
  │
  ├─ Image and avatar uploads
  │    └─► Auth Pro (/media/*, /users/avatar)
  │
  └─ Certificates and groups
       └─► Backend API (/certificate/*, /groups/*)
                         │
                         └─► S3 (image URLs resolved at read time)
```

---

## 5. The Auth Pro Migration — Why We Moved Off Supabase

The application was originally built on Supabase. The migration to Auth Pro is still in progress on a dedicated branch (`auth-pro-migration`), and the experience of that migration surfaces a common architectural tension worth documenting.

Supabase is an excellent product for teams that want to move fast and stay within its opinionated boundaries. The moment you need to run Auth Pro alongside a custom backend that manages relational data outside Supabase's row-level security model, the integration points multiply. Auth token formats, session management, and user metadata shapes all become coordination points between two systems that were not designed to be separated.

Auth Pro gives us full control over the auth contract. We define the token shape, the metadata structure, and the media handling behaviour. The tradeoff is operational ownership — but for a platform where the auth layer is a first-class product concern rather than infrastructure boilerplate, that tradeoff is correct.

The migration also revealed a specific class of bug worth naming: **split-write duplication**. During the transition, the profile update path called both a direct `fetch` to Auth Pro (with the correct `{ metadata: {} }` payload shape) and an RTK Query mutation (with the wrong bare payload shape) on every save. Both calls targeted the same endpoint, one with the correct structure and one without. The correct one persisted the data. The incorrect one silently failed or was ignored by the server. The symptom was invisible — saves appeared to work — but the redundancy created a double-request on every profile update and left the mutation in a state where it could never work correctly in isolation.

The consolidated version removes the direct `fetch` entirely and fixes the mutation's payload shape. One call, correct structure, cache invalidation handled by RTK Query's `invalidatesTags`.

---

## 6. Security and Defensive Engineering

Building a platform where users upload files and share links publicly requires deliberate attention to a set of failure modes that are easy to defer and expensive to fix later.

### File Upload Validation

The certificate upload accepts only raster image formats. The allowed list is explicit, not inferred:

```ts
export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])
```

Both the MIME type and the file extension are checked. MIME type alone is insufficient — browsers can be lied to about file type through the `Content-Type` header on a `<input type="file">` interaction, and a file named `payload.svg` will report `image/svg+xml` regardless of what the Accept attribute says. SVG is excluded deliberately: SVG files can embed arbitrary JavaScript and, if served without a strict `Content-Type` policy, can execute in a browser context.

Avatar uploads have their own 5 MB size limit. Drag-and-drop events route through the same validation function as click-to-select.

### Submission Guards

Every form that triggers a network request has a `disabled` state on its submit button that activates the moment the submission begins and clears only in the `finally` block — covering both success and failure paths. The profile form uses a dedicated `isSubmitting` boolean rather than relying on the RTK mutation's `isLoading`, because the submission function calls a service function before the mutation is invoked, leaving a window where `isLoading` is false but a request is already in flight.

The credential ID validation uses a proper `useRef`-based debounce that cancels the previous timer on every keystroke:

```ts
const credentialValidationTimer = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  if (credentialValidationTimer.current) {
    clearTimeout(credentialValidationTimer.current)
  }
  credentialValidationTimer.current = setTimeout(async () => {
    // API call
  }, 500)

  return () => {
    if (credentialValidationTimer.current) {
      clearTimeout(credentialValidationTimer.current)
    }
  }
}, [credentialId])
```

The naive implementation — a bare `setTimeout` without clearing the previous timer — fires one API call per keystroke after a 500 ms delay. For a ten-character credential ID, that is ten concurrent requests to the same endpoint, resolving in arbitrary order and overwriting state with stale responses. The `useRef` pattern ensures at most one request is pending at any time.

### Input Constraints

Every text input carries a `maxLength` attribute. This is a second line of defence, not a primary one — the backend enforces its own limits — but it prevents the construction of large JSON payloads entirely at the client. A certificate title cannot exceed 150 characters. A description cannot exceed 1,000. Group names are capped at 100. These limits are derived from the data model, not invented arbitrarily.

### Error Handling

No automatic retry logic exists anywhere in the application. All errors are surfaced to the user and require manual re-submission. This is a deliberate choice: for an application that writes persistent data (certificates, profile changes, visibility states), automatic retries risk creating duplicate records or applying stale state. A failed request should be a visible event, not a transparent one that the framework silently retries until it works.

---

## 7. What Is Still Being Built

Safe Pramaan is a working platform. There are features in the immediate roadmap:

**Search and filter.** The dashboard search bar is scaffolded in the UI but the backend query parameter is not yet wired. The endpoint already accepts a `search` parameter — the filter logic on the server side is the next piece.

**Certificate view counts.** The data model includes a `viewCount` field and the dashboard UI already aggregates it. The backend increment logic on public certificate page views is the missing piece.

**Skills taxonomy.** The upload form has a skills input that is currently commented out. The intent is to tag certificates with skills that can be used for filtering — AWS certificates tagged with `cloud`, `infrastructure`, `iac` — so the dashboard can be filtered by domain without requiring manual group creation.

**Export.** A shareable PDF export of a certificate or group, suitable for attaching to a job application, is a recurring request worth building into the platform natively.

---

## 8. Why This Stack, Specifically

Every technology choice in this stack was made for one reason: I wanted to spend my cognitive budget on the product problem, not on framework archaeology.

**Next.js** gives me a single codebase for both the authenticated application (SSR, dynamic routes) and the public-facing verification pages (static-renderable, edge-deployable). Without Next.js I would maintain two separate applications.

**Redux Toolkit and RTK Query** eliminate the boilerplate that makes Redux unpleasant and give me normalized caching, cache invalidation, and loading state management essentially for free. The alternative — `useState` and `useEffect` with manual fetch calls — would work, but would require me to reimplement cache invalidation, deduplication, and refetch-on-focus behaviour that RTK Query ships by default.

**TypeScript** is non-negotiable on any project I ship. The Auth Pro migration surfaced the payload shape bug (bare object vs `{metadata: {}}` wrapper) within the first few minutes of reading the code precisely because the type system made the mismatch visible. Without types, that class of bug lives in production until a user reports unexpected behaviour.

**Tailwind CSS** lets me build consistent UI without maintaining a separate stylesheet. The co-location of style and markup is a productivity trade-off that I have validated across enough projects to stop questioning.

**Auth Pro** is the right choice for a platform where auth is a controlled boundary, not infrastructure boilerplate. The cost is operational ownership. The benefit is a clean contract between services.

---

## 9. Reflections on Building It

The most instructive part of building Safe Pramaan was not any single feature — it was the discipline of naming things accurately and resisting the temptation to defer the hard parts.

The credential ID debounce is a small example of that. The naive implementation worked: it validated credential IDs and showed an error when a duplicate was found. But it fired multiple concurrent requests on every keystroke, resolved them in arbitrary order, and set UI state with stale data. It looked correct. It was not. The fix was a ten-line refactor. The lesson is that *working* and *correct* are different standards, and a platform that users trust with their professional credentials should meet the second one.

The Auth Pro migration is a larger example of the same thing. The split-write pattern — calling two functions that hit the same endpoint with different payload shapes — worked in the sense that data persisted. But it fired two requests on every save, one of which was structurally wrong. The correct path was to fix the mutation's payload shape and remove the redundant call. That is not a hard change. It is a small, careful change that requires understanding what both functions actually do before touching either of them.

Safe Pramaan will keep getting more capable. But the discipline of keeping it correct — one call per operation, validated inputs, no silent failures, no deferred security work — is what makes it worth building on.

---

*Questions or want to discuss a project? Reach out via the [contact form](/#contact).*
