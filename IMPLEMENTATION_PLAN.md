# Barber Shop Management System — Implementation Plan

## 1. Outcome

Build a production-ready, mobile-first web application for a barber shop to manage staff, customers, services, availability, and appointments, plus a public customer booking flow.

Source PRD: [PRD: Barber Shop Management System](https://app.notion.com/p/3c642c42eb6981f183dde14b3bed8434)

The repository currently contains no application code, so this plan treats the project as a greenfield build.

## 2. PRD Review

### Confirmed MVP requirements

- Staff dashboard for daily appointments and staff availability.
- Create, reschedule, cancel, and update appointment status.
- Customer records with contact details and private notes.
- Service catalog with duration and indicative pricing.
- Staff profiles and basic working availability.
- A basic public customer booking flow.
- Search and filtering for customers and appointments.
- Conflict and availability validation.

### Explicitly deferred

- Payments and point of sale.
- SMS/email reminders beyond a future-ready notification interface.
- Payroll, inventory, loyalty, and advanced reporting.
- Native mobile applications.
- Complex resource scheduling, overlapping services, or multiple barbers on one appointment.

### Working assumptions requiring product confirmation

1. The MVP serves one shop location, but all business data is scoped by `organization_id` and the schema includes `location_id` so multi-branch support does not require a rewrite.
2. Staff roles are `owner`, `manager`, `receptionist`, and `barber`.
3. Staff must sign in; customers can book as guests without creating accounts.
4. An appointment has one assigned barber and one or more services performed sequentially.
5. Duration and price are snapshotted on the appointment so later service edits do not alter history.
6. Times are stored in UTC; each location has an IANA timezone used for display and slot calculation.
7. Buffers default to zero but are supported per service.
8. Active booking statuses block time; cancelled and no-show appointments do not.

The highest-impact decision is whether one appointment can involve multiple staff members. If yes, the scheduling model must use appointment segments rather than a single `staff_id`.

## 3. Proposed Architecture

### Application

- Next.js App Router with TypeScript.
- React Server Components for authenticated reads and initial page rendering.
- Server Actions for staff-side form mutations.
- Route Handlers for public booking/availability endpoints and future webhooks.
- Client Components only for interactive calendar, slot picker, dialogs, and optimistic status updates.
- Tailwind CSS and an accessible component library such as shadcn/ui for a consistent responsive interface.
- Zod schemas shared at server boundaries for input validation.

### Supabase

- Supabase Postgres as the system of record.
- Supabase Auth with cookie-based SSR sessions for staff accounts.
- Row Level Security on every exposed table, with grants limited by operation.
- SQL migrations in `supabase/migrations`; generated TypeScript database types committed to the repository.
- Supabase Realtime only for the daily appointment board after the core flow is stable.
- Supabase Edge Functions and Cron reserved for future reminders or asynchronous integrations.

### Deployment

- Vercel for the Next.js application.
- Separate local, staging, and production Supabase projects.
- CI runs lint, typecheck, unit tests, database tests, and Playwright smoke tests.
- Secrets remain in environment variables; the Supabase service-role key is server-only and is never exposed to the browser.

### Security boundary

Authentication and authorization are checked in three layers:

1. Next.js data-access functions and every mutation verify the current user and required role.
2. Supabase RLS restricts every row to organizations the user belongs to.
3. Database functions and constraints enforce scheduling invariants even under concurrent requests.

The public booking flow must not grant anonymous users direct read access to customer or appointment tables. Public availability returns only non-sensitive slot data, and booking creation goes through a narrow server endpoint or security-definer database function with validation, rate limiting, and bot protection.

## 4. Repository Structure

```text
app/
  (auth)/login/
  (staff)/dashboard/
  (staff)/appointments/
  (staff)/customers/
  (staff)/services/
  (staff)/staff/
  (staff)/settings/
  book/[shopSlug]/
  api/public/availability/
  api/public/bookings/
components/
  appointments/
  booking/
  customers/
  layout/
  services/
  staff/
lib/
  auth/
  dal/
  supabase/
  validation/
  time/
supabase/
  migrations/
  seed.sql
tests/
  e2e/
  integration/
```

Feature folders own their UI and validation. `lib/dal` is the authorization-aware data access layer; pages should not scatter raw Supabase queries throughout the component tree.

## 5. Data Model

| Table | Purpose | Important fields |
| --- | --- | --- |
| `organizations` | Tenant/shop boundary | `id`, `name`, `slug`, `status` |
| `locations` | Physical location and timezone | `organization_id`, `name`, `timezone`, `address`, `is_active` |
| `profiles` | Auth user display profile | `id` = `auth.users.id`, `full_name`, `phone` |
| `organization_members` | Role and tenant membership | `organization_id`, `user_id`, `role`, `is_active` |
| `staff` | Bookable employee record | `organization_id`, `location_id`, optional `user_id`, `display_name`, `is_bookable` |
| `services` | Service catalog | `organization_id`, `name`, `duration_minutes`, `buffer_minutes`, `price_minor`, `currency`, `is_active` |
| `staff_services` | Services each barber can perform | `staff_id`, `service_id` |
| `location_hours` | Normal weekly opening hours | `location_id`, `weekday`, `opens_at`, `closes_at` |
| `staff_working_hours` | Normal weekly barber schedule | `staff_id`, `weekday`, `starts_at`, `ends_at` |
| `staff_time_off` | Breaks, leave, and schedule exceptions | `staff_id`, `starts_at`, `ends_at`, `reason` |
| `customers` | Customer identity and contact details | `organization_id`, `full_name`, `phone`, `email`, `notes` |
| `appointments` | Booking lifecycle and reserved time | `organization_id`, `location_id`, `customer_id`, `staff_id`, `starts_at`, `ends_at`, `status`, `source`, `notes` |
| `appointment_services` | Immutable service snapshots | `appointment_id`, `service_id`, `name_snapshot`, `duration_minutes`, `price_minor`, `sort_order` |
| `appointment_events` | Audit trail of lifecycle changes | `appointment_id`, `event_type`, `from_status`, `to_status`, `actor_user_id`, `metadata` |
| `booking_tokens` | Hashed public manage/cancel token | `appointment_id`, `token_hash`, `expires_at`, `used_at` |

Recommended appointment statuses:

```text
pending -> confirmed -> checked_in -> in_progress -> completed
pending|confirmed -> cancelled
confirmed -> no_show
```

All money uses integer minor units. Customer and appointment search indexes should cover normalized phone, lower-cased name, date, staff, status, and `organization_id`.

## 6. Scheduling and Conflict Rules

Availability is calculated from:

```text
location opening hours
∩ staff working hours
− staff time off/breaks
− active appointment ranges
− service buffers
= bookable slots
```

Implement a transactional database function such as `create_appointment(...)` that:

1. Resolves the selected services and snapshots price/duration.
2. Locks or validates the relevant scheduling data.
3. Confirms the barber offers every selected service.
4. Confirms the requested range is inside shop and staff working hours.
5. Confirms it does not intersect time off.
6. Inserts the appointment and service snapshots atomically.

Use a PostgreSQL `tstzrange` exclusion constraint keyed by staff to reject overlapping active appointments at the database level. Application-side availability checks improve the experience, but the constraint is the final protection against two customers claiming the same slot concurrently.

Rescheduling uses the same transaction and validation path. Store times as half-open ranges `[start, end)` so back-to-back appointments are valid.

## 7. RLS and Permissions

### Role capabilities

| Capability | Owner | Manager | Receptionist | Barber |
| --- | :---: | :---: | :---: | :---: |
| Manage organization/settings | Yes | Limited | No | No |
| Manage staff and availability | Yes | Yes | View | Own only |
| Manage services | Yes | Yes | View | View |
| View all appointments/customers | Yes | Yes | Yes | Assigned only |
| Create/reschedule appointments | Yes | Yes | Yes | Assigned/own |
| Complete appointment | Yes | Yes | Yes | Assigned/own |

RLS helper functions should answer `is_org_member(org_id)`, `has_org_role(org_id, roles[])`, and `is_assigned_staff(staff_id)` without trusting client-supplied role fields. Policies must be tested separately for `anon`, each authenticated role, cross-organization access, and the service role.

## 8. Product Surfaces

### Staff application

- Login and password reset.
- Today dashboard: appointment timeline, status counts, quick search, and next available staff.
- Calendar: day/week views, filters by staff/status, create and reschedule actions.
- Appointment detail: customer, services, notes, history, status actions.
- Customer directory and profile with appointment history.
- Service catalog with active/archive behavior.
- Staff directory, offered services, weekly hours, breaks, and time off.
- Shop settings: name, slug, location, timezone, opening hours, booking rules.

### Public booking

1. Select service(s).
2. Select a barber or “any available”.
3. Pick an available date/time.
4. Enter name, phone, and optional email/note.
5. Review and confirm.
6. Show a reference number and send/offer a secure management link when a notification channel exists.

The flow must explain timezone, price estimate, duration, cancellation policy, and privacy notice. It must revalidate availability during final submission.

## 9. Implementation Phases

| Phase | Scope | Estimate | Exit gate |
| --- | --- | ---: | --- |
| 0. Product decisions | Confirm roles, booking auth, statuses, buffers, cancellation rules, location model, and data retention | 2–3 days | Decision record approved; wireframes cover staff and public flows |
| 1. Foundation | Scaffold Next.js, Supabase local project, CI, environments, auth SSR, shared layout, observability | 3–4 days | Staff can sign in/out; protected routes and CI pass |
| 2. Tenant and catalog | Organizations, locations, memberships, staff, services, hours, RLS, seed data | 4–5 days | Each role sees only permitted tenant data; CRUD flows pass |
| 3. Scheduling core | Customers, appointments, service snapshots, slot calculation, conflict constraint, rescheduling, status state machine | 6–8 days | Concurrent overlap test proves only one booking succeeds |
| 4. Staff operations | Today dashboard, calendar, filters/search, appointment detail, customer history, time-off management | 5–6 days | Receptionist and barber end-to-end workflows pass |
| 5. Public booking | Shop landing/booking wizard, public availability, secure booking submission, rate limiting, management token | 5–6 days | Anonymous booking works without exposing private rows |
| 6. Hardening and launch | Accessibility, responsive QA, audit trail, performance, backups, security review, staging UAT, production deployment | 4–6 days | All release gates pass in staging and production smoke tests |

Expected MVP duration: approximately 5–7 weeks for one experienced full-time engineer, consistent with the PRD's 5–8 week range. Product/design review availability and notification integrations can extend this.

## 10. Ticket Breakdown

Each ticket should fit in one to two engineering days.

### Foundation

- Scaffold Next.js, TypeScript, linting, formatting, and component system.
- Initialize Supabase local development, migrations, seed, and generated types.
- Implement browser/server Supabase clients and cookie refresh flow.
- Implement staff login, logout, reset flow, and protected shell.
- Add CI and environment validation.

### Data and authorization

- Create organization/location/profile/membership schema.
- Create RLS helpers, grants, and membership policies.
- Create staff/services/staff-services CRUD and policies.
- Create opening hours, working hours, and time-off model.
- Add role-aware navigation and data-access layer.

### Appointments

- Create customers and searchable customer directory.
- Create appointment/service snapshot/event schema.
- Implement availability SQL function and tests.
- Implement active-range exclusion constraint and concurrency test.
- Implement appointment create/reschedule transaction.
- Implement cancellation and validated status transitions.
- Build daily dashboard and day/week calendar.
- Build appointment details, filters, and customer history.

### Public booking and release

- Build shop/service/staff selection steps.
- Build slot picker backed by public-safe availability output.
- Build protected booking submission with rate limiting/bot defense.
- Build confirmation/reference and secure management token.
- Add accessibility, timezone, responsive, and error-state QA.
- Run staging UAT, backup/restore check, migration rehearsal, and production smoke test.

## 11. Test Strategy and Acceptance Gates

### Automated tests

- Unit: duration composition, slot generation, timezone/DST cases, allowed status transitions, permission mapping.
- Database: constraints, functions, RLS for every role, cross-tenant denial, service snapshots, transaction rollback.
- Integration: Server Actions/Route Handlers, validation errors, idempotent booking submission.
- End-to-end: staff login, create/reschedule/cancel/complete, public booking, conflict handling, search/filter, responsive viewport.

### Release gates

- Two simultaneous requests for one staff/time slot produce exactly one appointment.
- No user can read or mutate another organization's data.
- Anonymous users cannot query customer or appointment records.
- Barber access is limited to assigned/owned operational data as defined.
- All appointment changes create an audit event.
- Core flows work on current mobile and desktop browsers with keyboard navigation.
- No high-severity dependency, RLS, or secret-scanning findings.
- Staging migration and rollback/recovery procedure are rehearsed.
- Production smoke verifies authenticated staff and anonymous booking flows, not only a health page.

Proposed non-functional targets, pending product approval:

- p95 authenticated page response below 2 seconds under expected MVP load.
- Public availability response below 500 ms p95 for a 14-day search window.
- WCAG 2.2 AA for core flows.
- Daily database backups and documented recovery steps.

## 12. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Booking races create double bookings | High | Database exclusion constraint plus transactional booking function and concurrency tests |
| Multi-branch decision arrives late | High | Tenant/location keys from day one; activate one location in MVP UI |
| Customer booking becomes an abuse or privacy path | High | Server-only write path, minimal response DTOs, rate limiting, bot protection, RLS denial for anonymous table reads |
| Timezone/DST errors | High | UTC storage, IANA timezone per location, explicit DST tests, half-open ranges |
| Role requirements drift | Medium | Central permission matrix, DAL checks, and RLS tests rather than UI-only authorization |
| Calendar/realtime complexity delays launch | Medium | Ship server-rendered day/week views first; add Realtime only after correctness |
| Payments/reminders/POS expand scope | High | Preserve extension points but exclude integrations from MVP acceptance |

## 13. Decisions Needed Before Phase 2

1. Is MVP truly single-location, and is multi-branch expected within twelve months?
2. Can receptionists see all customer notes, and can barbers edit them?
3. Is guest booking acceptable, or must customers verify phone/email or create an account?
4. Are appointments automatically confirmed or placed in `pending` for staff approval?
5. What are the cancellation window, minimum lead time, maximum advance window, and slot interval?
6. Can one appointment use multiple barbers or contain parallel services?
7. What currency, tax, locale, and phone-number format are required?
8. Are walk-ins represented as appointments, and may staff create bookings outside normal hours with an override reason?
9. What customer-data retention, export, and deletion rules apply?

Until answered, implementation should use the working assumptions in Section 2 and keep them recorded as reversible product decisions.
