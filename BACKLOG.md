# Backlog

## Guiding principle
Build in the order that unlocks revenue flow first:
1. traffic conversion
2. lead capture
3. lead handling
4. internal efficiency
5. polish and automation

## Phase 1: Marketing foundation
- Replace temporary landing page copy with real brand messaging.
- Define service architecture:
  - kitchen remodeling
  - bathroom remodeling
  - whole-home remodeling
  - additions and conversions
- Add trust sections:
  - service area
  - process
  - testimonial placeholders
  - FAQ
- Add clear CTAs across all sections.

## Phase 2: Lead capture
- Add lead capture form schema and server action or route handler.
- Persist incoming leads to MySQL.
- Validate fields with `zod`.
- Store source and service interest on every lead.
- Add success and failure UX states.

## Phase 3: Admin MVP
- Build lead table in `/admin`.
- Add lead detail page.
- Add lead status changes.
- Add notes per lead.
- Add manager assignment.
- Add “next follow-up date” support.

## Phase 4: Auth and user management
- Seed first admin.
- Add manager creation flow.
- Limit sensitive admin actions by role.
- Add password reset strategy or magic-link flow.

## Phase 5: Sales workflow
- Add activity timeline per lead.
- Add filters by status, source, manager, service.
- Add dashboard metrics tied to real data.
- Add estimate tracking fields.
- Add won/lost reason capture.

## Phase 6: Production readiness
- Finalize Hostinger env vars.
- Run schema sync on production MySQL.
- Seed production admin.
- Confirm auth cookies and HTTPS behavior.
- Add error boundaries and empty states.
- Add metadata and SEO defaults for public pages.

## Nice-to-have later
- File attachments for inspiration photos or estimate docs.
- Email notifications for new leads.
- SMS/call logging integration.
- Calendar integration for consultations.
- Marketing analytics dashboard.

## Default execution order for future work
When choosing the next task, prefer:
1. anything that improves lead capture
2. anything that makes `/admin` usable for a real manager
3. anything needed for deployment
4. visual polish after the above
