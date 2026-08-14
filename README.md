# Grace Community Church website

React, TypeScript, Tailwind CSS, Firebase, and Cloudinary foundation for the public church site and role-based portal.

## Get running

1. Copy `.env.example` to `.env.local` and supply the Firebase web-app values.
2. In Firebase Authentication, enable Google (or replace the starter sign-in flow with your preferred provider).
3. Deploy `firestore.rules` using the Firebase CLI, or paste the contents into the Firestore Rules editor. The rules deliberately require a `super_admin` custom claim for writing user profiles, preventing browser clients from giving themselves a role. Create initial profiles through the Firebase Admin SDK, a Cloud Function, or the Firebase console while developing.
4. New users can sign up with Google or email/password, then provide full name, phone number, and a requested role. Their actual role is always created as `member`; a trusted administrator must approve or assign an elevated role.
5. Install dependencies with `npm install`, then run `npm run dev`.

Allowed roles: `super_admin`, `pastor`, `secretary`, `choir_president`, `youth_leader`, `finance`, `media`, `event_manager`, `member`.

## Dashboard areas

- All members: dashboard overview, announcements, events, sermons, prayer care, and personal profile.
- Super admin, pastor, and secretary: people directory; the super admin can assign roles.
- Event managers: announcements and events.
- Media: sermons.
- Choir presidents and youth leaders: ministries.
- Finance: giving records.

Announcements, events, and sermons are published to the corresponding public pages. Deploy `firestore.rules` after any role or data-access change.

Cloudinary values are optional for this foundation. `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are safe client-side delivery/upload settings. Do not expose `CLOUDINARY_API_SECRET`; perform signed uploads through a trusted server or Firebase Cloud Function.
