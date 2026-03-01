# THE FORGE — Core Contact & Resume Tickets

> These belong in the **MAIN BUILD PHASE**, not future features.
> They are conversion-critical and must ship with v1.

---

## FORGE-028: Contact Form & Email Delivery

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Critical |
| **Branch** | `feat/FORGE-028-contact-form` |
| **Depends On** | FORGE-010 (Hearth Zone), FORGE-020 (Detail Panel), FORGE-019 (Interaction System), FORGE-027 (Deployment) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/hud/ContactModal.tsx`, `src/hud/ContactForm.tsx`, `src/objects/ContactAnvil.tsx`, `app/api/contact/route.ts`, `src/utils/validation.ts`, `src/store/useContactStore.ts` |
| **Modified Files** | `src/zones/HearthZone.tsx`, `src/hud/HudCompositor.tsx`, `src/types/index.ts` |

**Summary:** A contact form accessible both from a 3D anvil object in the Hearth zone and from a persistent HUD button. Submissions send an email to Robert via Resend (or Nodemailer/SendGrid) and store a copy in the database for backup.

### Why This Is Core

Your old portfolio had this. Recruiters and clients expect it. If someone explores The Forge and can't reach you, that's a lost opportunity. This is the #1 conversion feature — everything else (AI assistant, resume builder, testimonials) supports THIS action.

### Acceptance Criteria

**3D Object (Hearth Zone):**
- [ ] `ContactAnvil.tsx` renders a glowing anvil on a pedestal in the Hearth zone
- [ ] Anvil positioned prominently near the Hearth center at (2, 0, -1)
- [ ] Subtle pulse animation (emissive intensity oscillates 0.3–0.6, 2s cycle)
- [ ] Interaction prompt on proximity: "Send a message to the smith"
- [ ] Interacting opens `ContactModal.tsx`

**Persistent HUD Access:**
- [ ] Floating "✉ Contact" button in bottom-right HUD (always visible, all zones)
- [ ] Styled as forge UI: dark background, `#c4813a` border, Rajdhani font
- [ ] Button has subtle glow on hover
- [ ] Clicking opens the same `ContactModal.tsx`

**Contact Modal:**
- [ ] Full-screen overlay with semi-transparent backdrop (click outside to close)
- [ ] Forge-themed: dark parchment `#1a1511` background, `#c4813a` accents, Cinzel heading
- [ ] Heading: "Send a Message to the Smith" or "Let's Build Something Together"
- [ ] Close button (X) top-right + Escape key to close

**Contact Form Fields:**
- [ ] Name (required, max 100 chars)
- [ ] Email (required, validated with regex + format check)
- [ ] Subject dropdown: "Hiring Inquiry", "Freelance Project", "Collaboration", "Just Saying Hi", "Other"
- [ ] Message (required, min 10 chars, max 2000 chars, textarea)
- [ ] All fields have visible labels (not just placeholders)
- [ ] Real-time validation with inline error messages
- [ ] Character count on message field

**Submission Flow:**
- [ ] Submit button: "Send Message" with loading spinner state
- [ ] Button disabled while submitting (prevent double-submit)
- [ ] On success: form replaced with confirmation message + ember animation
  - "Message received! Robert will get back to you soon. 🔥"
  - "Return to The Forge" button closes modal
- [ ] On error: inline error message, form stays populated (no data loss)
- [ ] Rate limiting: max 3 submissions per IP per hour

**API Route (`app/api/contact/route.ts`):**
- [ ] POST endpoint accepting JSON body: `{ name, email, subject, message }`
- [ ] Server-side validation (mirrors client-side rules)
- [ ] Sanitize all inputs (strip HTML, trim whitespace)
- [ ] Send email to Robert via Resend API (or SendGrid fallback)
  - From: `noreply@rblaylock.dev`
  - To: Robert's email
  - Subject: `[The Forge] ${subject} from ${name}`
  - Body: formatted HTML email with all form fields + timestamp
- [ ] Store submission in database (Supabase or Vercel KV) as backup
  - Fields: `id`, `name`, `email`, `subject`, `message`, `ip_hash`, `created_at`
  - IP is hashed (SHA-256), never stored in plaintext
- [ ] Auto-reply email to visitor: "Thanks for reaching out! Robert will respond within 24-48 hours."
- [ ] Rate limiting middleware: 3 per hour per IP, return 429 on excess
- [ ] Honeypot field (hidden input) to catch bots

**Security:**
- [ ] CSRF protection (Next.js handles via same-origin)
- [ ] Input sanitization on server (DOMPurify or similar)
- [ ] Honeypot spam trap (hidden field, reject if filled)
- [ ] No PII logged (email/name not in server logs)
- [ ] API key (Resend) stored as env var only
- [ ] Rate limiting enforced server-side (not just client)

**Accessibility:**
- [ ] All form fields have associated `<label>` elements
- [ ] Error messages announced to screen readers via `aria-live`
- [ ] Focus trapped inside modal when open
- [ ] Tab order: Name → Email → Subject → Message → Submit
- [ ] Escape closes modal, returns focus to trigger element
- [ ] Works fully with keyboard only

**2D Fallback:**
- [ ] Contact form renders as a standard page section in 2D mode
- [ ] Same form, same validation, same API — just flat layout

### Testing

- `validation.test.ts` — email regex, name length, message length, sanitization
- `ContactForm.test.tsx` — renders fields, validates inline, submits, shows success/error
- `ContactModal.test.tsx` — opens, closes, focus trap, escape key
- `api/contact/route.test.ts` — valid submission, invalid data rejection, rate limiting, honeypot
- `ContactAnvil.test.tsx` — renders, interaction triggers modal

---

## FORGE-029: Resume Download

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Critical |
| **Branch** | `feat/FORGE-029-resume-download` |
| **Depends On** | FORGE-010 (Hearth Zone), FORGE-019 (Interaction System), FORGE-027 (Deployment) |
| **Effort** | 0.5–1 session |
| **New Files** | `src/objects/ResumeScroll.tsx`, `src/hud/ResumePreview.tsx`, `public/resume/robert-blaylock-resume.pdf` |
| **Modified Files** | `src/zones/HearthZone.tsx`, `src/hud/HudCompositor.tsx` |

**Summary:** A glowing scroll artifact in the Hearth zone that lets visitors preview and download Robert's resume as a branded PDF. Also accessible from the HUD.

### Why This Is Core

This was on your old portfolio for a reason — recruiters want to download a resume immediately. Making them hunt for it or ask for it is friction. The 3D scroll is the experience layer; the download button is the conversion layer.

### Acceptance Criteria

**3D Object (Hearth Zone):**
- [ ] `ResumeScroll.tsx` renders a glowing rolled parchment/scroll on a display stand
- [ ] Positioned in the Hearth at (-1, 0.8, -2) — visible but not blocking main navigation
- [ ] Scroll has subtle hover animation: gentle unroll preview (10% open on proximity)
- [ ] Ember particles trail from the scroll edges
- [ ] Interaction prompt: "View the Smith's Record" (or "Download Resume")
- [ ] Interacting opens `ResumePreview.tsx`

**Persistent HUD Access:**
- [ ] Small "📄 Resume" button in the HUD nav bar (next to Contact button)
- [ ] Forge-themed styling consistent with other HUD elements
- [ ] Clicking opens the same preview overlay

**Resume Preview (`ResumePreview.tsx`):**
- [ ] Full-screen overlay with the PDF embedded (`<iframe>` or `<embed>` with PDF.js fallback)
- [ ] Forge-themed frame: dark border, Cinzel heading "The Smith's Record"
- [ ] Prominent "Download PDF" button — primary CTA, forge amber styling
- [ ] "Open in New Tab" secondary link
- [ ] Close button (X) + Escape key
- [ ] On mobile: skip preview, trigger direct download

**PDF File:**
- [ ] `public/resume/robert-blaylock-resume.pdf` — Robert's current, branded resume
- [ ] PDF is < 300KB (optimized for fast download)
- [ ] PDF metadata: title, author, keywords set properly
- [ ] File named for SEO + professionalism: `robert-blaylock-resume.pdf`
- [ ] PDF is the single source of truth — update the file to update the resume everywhere

**Download Behavior:**
- [ ] Download link uses `<a href="..." download>` for native browser download
- [ ] Track download count (anonymous) via lightweight API endpoint or Vercel Analytics custom event
- [ ] Download works on all browsers (Chrome, Safari, Firefox, Edge, mobile)

**Accessibility:**
- [ ] Preview overlay is keyboard navigable
- [ ] Download button is clearly labeled for screen readers
- [ ] Focus management on open/close
- [ ] 2D fallback: standard download link/button on the page

**Future-Proofing:**
- [ ] Data structure ready for F-010 (Interactive Resume Builder) to replace static PDF
- [ ] Preview component accepts either static PDF URL or dynamic content
- [ ] `useForgeStore` tracks `resumeDownloaded: boolean` for Codex/achievement system integration

### Testing

- `ResumeScroll.test.tsx` — renders, hover animation, interaction triggers preview
- `ResumePreview.test.tsx` — opens, displays PDF, download button works, closes properly
- Manual: verify PDF download on Chrome, Safari, Firefox, mobile Safari, mobile Chrome

---

## Updated Tracker Entries

Add to the **MAIN BUILD PHASE** in the AI Build Guide:

```
### PHASE CORE: Conversion Essentials
| ID | Ticket | Status | Branch | Depends On |
|----|--------|--------|--------|------------|
| FORGE-028 | Contact Form & Email | TODO | `feat/FORGE-028-contact-form` | FORGE-010, 019, 020, 027 |
| FORGE-029 | Resume Download | TODO | `feat/FORGE-029-resume-download` | FORGE-010, 019, 027 |
```

---

## How These Connect to the Bigger Picture

```
CORE (v1 — must ship)
├── FORGE-028: Contact Form ← the conversion endpoint
├── FORGE-029: Resume Download ← the credibility shortcut
│
ENGAGEMENT (Phase B-E hooks)
├── UX-022: Contextual CTAs ← "Need this stack?" → opens FORGE-028
├── E-027: Resume as Forge Artifact ← themed wrapper around FORGE-029
│
FUTURE (F-* tickets)
├── F-001: AI Assistant ← "Want to work with Robert?" → opens FORGE-028
├── F-005: Testimonials ← builds trust → visitor clicks FORGE-028
├── F-010: Interactive Resume Builder ← evolves FORGE-029 into dynamic tool
```

**FORGE-028 (Contact) and FORGE-029 (Resume) are the conversion foundation.** Every other feature in The Forge exists to funnel visitors toward one of these two actions: "reach out" or "download resume." They must ship in v1.

---

## Build Order Recommendation

**Session 1:** FORGE-029 (Resume Download) — fastest win, drop PDF in public folder + build scroll object + preview overlay. Half a session.

**Session 2:** FORGE-028 (Contact Form) — form UI + validation + API route + email delivery. 1–1.5 sessions.

Both should be built in Sprint 4 (Conversion) alongside UX-022 (Contextual CTAs) per the engagement strategy's recommended build order.
