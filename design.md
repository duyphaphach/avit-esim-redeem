# eSIM Voucher Redemption Website — Final Design Document

## Understanding Summary
- **What:** Full Next.js 14 website (Home, Products, Redeem, FAQ, About, Contact) with fresh modern design
- **Why:** Allow customers from OTA partners to redeem eSIM voucher codes for QR-based eSIMs
- **Who:** International travelers — English, Vietnamese, Chinese (Simplified), Japanese
- **Core Flow:** Enter booking code → View booking info → Choose quantity → Provide email → Get QR on-screen + email
- **Redemption Window:** Any time before date of use, up to 7 days after date of use; expired after that
- **Partial Redemption:** Customers can redeem 1-by-1 across multiple visits; system tracks remaining count
- **Non-Goals:** No direct eSIM sales, no backend/inventory management, no QR code generation (all handled by API)

---

## Assumptions
1. **API Readiness:** Backend API handles: booking lookup, partial redemption tracking, QR generation, email delivery
2. **Traffic:** Low (<1,000/day) — no CDN or complex scaling needed for MVP
3. **Hosting:** Own VPS server — Docker container behind Nginx reverse proxy
4. **Security:** Basic rate-limiting on redemption endpoint to prevent brute-force on booking codes
5. **Email:** Backend API sends the email — frontend only passes the customer's email to the API

---

## Architecture

```
[Customer Browser]
       ↓
[Nginx Reverse Proxy]   ← SSL termination, static assets
       ↓
[Next.js 14 App Router] ← Docker container on own server
       ↓
[Next.js API Route Handlers (BFF)] ← Proxies calls, hides backend credentials
       ↓
[Existing Backend API]  ← Booking lookup, redemption, QR generation, email
```

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| i18n | next-intl |
| Icons | Lucide React |
| QR Display | `qrcode.react` |
| HTTP client | `axios` or native `fetch` |
| Deployment | Docker → Nginx on own server |

---

## Page Structure

| Route | Page | Purpose |
|---|---|---|
| `/[locale]/` | Home | Hero banner, intro to service, CTA to redeem |
| `/[locale]/redeem` | Redeem | Core voucher redemption flow |
| `/[locale]/products` | Products | Showcase available eSIM plans |
| `/[locale]/faq` | FAQ | Redemption guide, common questions |
| `/[locale]/about` | About Us | Company info and OTA partnerships |
| `/[locale]/contact` | Contact | Hotline, email, support form |

Root `/` → auto-detects browser language → redirects to appropriate locale prefix.

**Supported locales:** `en`, `vi`, `zh`, `ja`

---



### State 1: Entry
- Input field for booking code
- "Redeem" button
- Link to contact/hotline for help

### State 2: Booking Found
- Booking details card:
  - Product name (e.g. "Vietnam 5GB/day · 7 days")
  - Date of use
  - Total eSIMs / Already redeemed / Remaining
  - Redemption history table (if any prior redemptions): date, quantity, masked email
- Quantity selector (1 to remaining count)
- Email input field
- "Confirm & Get eSIM" button

### State 3: Success
- QR code(s) displayed on screen (one per eSIM red## Redemption Flow — 5 UI Stateseemed)
- "Download QR Code" button for each
- Confirmation notice: "Also sent to: jo***@g**.com"
- Link back to redeem another / contact support

### State 4: Not Found Error
> "We couldn't find a booking with this code. Please double-check or contact our hotline: [number]."

### State 5: Expired Error
> "This voucher expired on [date+7 days]. Please contact our hotline for assistance."

---

## Component Tree

```
app/
├── [locale]/
│   ├── layout.tsx              ← Navbar, Footer, locale provider
│   ├── page.tsx                ← Home page
│   ├── redeem/
│   │   └── page.tsx            ← Redemption page (orchestrates states)
│   ├── products/page.tsx
│   ├── faq/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
│
components/
├── layout/
│   ├── Navbar.tsx              ← Logo, nav links, language switcher
│   └── Footer.tsx
├── redeem/
│   ├── RedeemForm.tsx          ← Booking code input (State 1)
│   ├── BookingCard.tsx         ← Booking details + qty + email (State 2)
│   ├── RedemptionHistory.tsx   ← Past redemption table
│   ├── SuccessView.tsx         ← QR codes display (State 3)
│   └── ErrorView.tsx           ← Not found / expired (States 4 & 5)
└── ui/                         ← shadcn/ui primitives (Button, Input, Card...)

app/api/
├── redeem/
│   └── route.ts                ← BFF: POST /api/redeem → calls backend
└── booking/
    └── route.ts                ← BFF: GET /api/booking?code=XXX → calls backend
```

---

## i18n Strategy

Using **next-intl** with file-based translations:

```
messages/
├── en.json
├── vi.json
├── zh.json
└── ja.json
```

- All UI strings externalized to translation files
- URL-based locale: `/en/redeem`, `/vi/redeem`, `/zh/redeem`, `/ja/redeem`
- Language switcher in Navbar updates locale without page reload
- `middleware.ts` handles locale detection + redirect from root `/`

---

## Error Handling Design

| Case | Trigger | UI Response |
|---|---|---|
| **Not Found** | API returns 404 for booking code | Error message + hotline link |
| **Expired** | Date of use + 7 days < today | Error message with expired date + hotline |
| **Already Fully Redeemed** | Remaining count = 0 | Show full redemption history with timestamps |
| **Partially Redeemed** | 0 < remaining < total | Show remaining count + redemption history |
| **API Error / Network** | API call fails / timeout | Generic error + retry suggestion + hotline |
| **Rate Limited** | Too many redemption attempts | "Too many attempts, please try again later" |

---

## Decision Log

| # | Decision | Alternatives | Reason |
|---|---|---|---|
| 1 | Next.js 14 App Router | Pages Router, Static Export | Modern standard, server components, BFF capability |
| 2 | BFF API proxy layer | Direct browser → backend | Hides backend credentials from client |
| 3 | next-intl for i18n | next-i18next, i18next | Best suited for App Router, URL-based locales |
| 4 | Tailwind CSS + shadcn/ui | Plain CSS, Chakra UI | Rapid development, premium component quality |
| 5 | Docker on own server | Vercel, GCP Cloud Run | User specified own server hosting |
| 6 | Quantity selector (partial redeem) | All-at-once only | User specified customers can redeem one by one |
| 7 | QR code from backend API | Frontend QR generation | Backend controls eSIM provisioning and assignment |
