# eSIM Voucher Redemption Website — Implementation Plan

## Goal
Build a complete, modern Next.js 14 website that allows OTA customers to redeem eSIM voucher codes. The site supports 4 languages (EN/VI/ZH/JA), has 6 pages, and proxies all booking/redemption calls to an existing backend API via a BFF layer.

> [!IMPORTANT]
> The backend API (booking lookup, QR generation, email sending) is expected to already exist. This plan covers **frontend only**. API endpoint URLs must be provided before implementation begins.

---

## Proposed Changes

### Project Scaffold
#### [NEW] Next.js 14 project at `h:/My Drive/Webavit/esim/`

Initialize with:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```

Additional packages:
```bash
npm install next-intl lucide-react qrcode.react axios
npx shadcn@latest init
```

---

### i18n Layer

#### [NEW] `middleware.ts`
- Locale detection from browser headers
- Redirect root `/` to `/{locale}/`
- Supported: `en`, `vi`, `zh`, `ja`

#### [NEW] `messages/en.json`, `vi.json`, `zh.json`, `ja.json`
- All UI strings for every page
- Keys: `nav.*`, `home.*`, `redeem.*`, `products.*`, `faq.*`, `about.*`, `contact.*`, `errors.*`

---

### Layout & Shared Components

#### [NEW] `app/[locale]/layout.tsx`
- `next-intl` provider wrapper
- Import `Navbar` and `Footer`

#### [NEW] `components/layout/Navbar.tsx`
- Logo (left), nav links (center), language switcher (right)
- Mobile responsive hamburger menu

#### [NEW] `components/layout/Footer.tsx`
- Company info, quick links, social links, language list

---

### Pages

#### [NEW] `app/[locale]/page.tsx` — Home
- Hero section with gradient background + CTA ("Redeem Your eSIM")
- Features section (how it works: 3 steps)
- Trust badges (OTA partners logos)

#### [NEW] `app/[locale]/redeem/page.tsx` — Redeem
- Orchestrates 5 UI states (see `RedeemFlow` components below)

#### [NEW] `app/[locale]/products/page.tsx` — Products
- Grid of eSIM plan cards (static content or API-driven)

#### [NEW] `app/[locale]/faq/page.tsx` — FAQ
- Accordion-style Q&A (static content)
- Redemption guide section

#### [NEW] `app/[locale]/about/page.tsx` — About Us
- Company story, team, OTA partnership description

#### [NEW] `app/[locale]/contact/page.tsx` — Contact
- Hotline, email, contact form
- Google Maps embed (optional)

---

### Redemption Components

#### [NEW] `components/redeem/RedeemForm.tsx`
- Booking code input + "Redeem" button (State 1)
- Calls `GET /api/booking?code=XXX`

#### [NEW] `components/redeem/BookingCard.tsx`
- Displays booking details (State 2)
- Quantity selector (1 to remaining)
- Email input
- "Confirm & Get eSIM" button → calls `POST /api/redeem`

#### [NEW] `components/redeem/RedemptionHistory.tsx`
- Table showing past redemptions (date, quantity, masked email)

#### [NEW] `components/redeem/SuccessView.tsx`
- QR code display via `qrcode.react` (State 3)
- Download button per QR
- Email confirmation notice

#### [NEW] `components/redeem/ErrorView.tsx`
- Handles: Not Found, Expired, API Error (States 4 & 5)
- Hotline link/button

---

### BFF API Routes

#### [NEW] `app/api/booking/route.ts`
```
GET /api/booking?code=XXX
→ Calls backend: GET {BACKEND_URL}/bookings/{code}
→ Returns: booking details or error
```

#### [NEW] `app/api/redeem/route.ts`
```
POST /api/redeem
Body: { code, quantity, email }
→ Calls backend: POST {BACKEND_URL}/redeem
→ Returns: QR code data array or error
```

Environment variable: `BACKEND_API_URL`, `BACKEND_API_KEY` (stored in `.env.local`)

---

### Deployment

#### [NEW] `Dockerfile`
- Multi-stage build: build → production image
- Next.js standalone output mode

#### [NEW] `docker-compose.yml`
- Service: `esim-web` (Next.js container)
- Nginx reverse proxy with SSL config

#### [NEW] `nginx.conf`
- Route all traffic to Next.js container
- SSL termination (Let's Encrypt)

---

## Verification Plan

### Manual Browser Verification (via Antigravity browser tool)
After starting the dev server (`npm run dev`), verify:

1. **Home page loads** at `http://localhost:3000/en/`
   - Hero section is visible, CTA button present
   - Language switcher switches to `/vi/`, `/zh/`, `/ja/` correctly

2. **Redeem page — State 1** at `http://localhost:3000/en/redeem`
   - Booking code input field and Redeem button visible

3. **Redeem page — State 4 (Not Found):**
   - Enter an invalid code (e.g. `INVALID999`), click Redeem
   - Error message and hotline link should appear

4. **Redeem page — State 2 (Booking Found):**
   - Enter a valid test booking code (provided by user)
   - Booking card shows product, date, quantity, remaining count

5. **Redeem page — State 3 (Success):**
   - Fill in quantity + email, click "Confirm & Get eSIM"
   - QR code(s) display on screen
   - Download button functional

6. **All other pages load** without errors: `/products`, `/faq`, `/about`, `/contact`

> [!IMPORTANT]
> A valid test booking code from the backend API is needed before redemption flow testing (States 2 & 3) can be verified. Please provide one before verification begins.

### Build Verification
```bash
npm run build
```
Must complete with zero errors and zero TypeScript errors.
