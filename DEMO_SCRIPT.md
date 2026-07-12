# SmartVendingOS — 60‑Second System Walkthrough

**Product:** SmartVendingOS — global, hardware‑agnostic vending management platform
**Demo account:** Peak Vending Solutions · 8 machines · 5 locations · Oklahoma City · USD
**Runtime:** ~60 seconds · **Voiceover:** ~155 words (~2.5 wps)
**Purpose:** Explain what the system does — feature walkthrough only (no pricing, no sales pitch).
**Tone:** Calm, clear, informative. Light background music, smooth screen transitions.

---

## ⚠ Pre‑record checklist (do this first)
- Sign in once so the session is active (all app routes require login).
- Verify these three detail pages show the **correct** screen before filming — they are currently rendering the wrong page and must be fixed first:
  - `/routes/[id]` → should be **Route Detail + Optimizer** (not Reports)
  - `/locations/[id]` → should be **Location Detail** (not Inventory)
  - `/trips/[id]` → should be **Trip results‑entry** (not Create Trip)
- If a beat's page isn't fixed in time, use the safe fallbacks noted inline.

---

## Timeline

### 0:00 – 0:08 · Intro + Executive Dashboard
**On screen:** Sign in; dashboard loads. Pan the KPI row — Gross Revenue $18,430, Net Income, Active Machines 7/8, Pending Restocks — then the revenue chart and top‑product tables.
**VO:** "This is SmartVendingOS — one platform to run an entire vending operation. The dashboard opens on your live numbers: revenue, net income, machine health, and what needs restocking."

### 0:08 – 0:18 · Live Fleet Map
**On screen:** Open **Live Map**. Colored pins across the metro. Click the red pin (CD003) → "Offline." Click an amber pin (WF002) → "Low stock."
**VO:** "Every machine sits on a live map, color‑coded by status — green for healthy, amber for low stock, red for offline. Click any pin for today's revenue, fill level, and last service."

### 0:18 – 0:28 · Machines + Visual Planogram
**On screen:** Open a machine (`/machines/CD001`). Step through the tabs — General, then **Planogram**: the visual slot grid with fill bars, prices, and expiry.
**VO:** "Open any machine for the full picture. The visual planogram lays out every slot — current stock, price, and expiry — so you manage inventory exactly as it sits in the cabinet."

### 0:28 – 0:38 · AI Insights
**On screen:** **AI Insights → Demand Forecast** (red "stockout in 2 days" rows), then **Restock Recommendations**, then **Anomaly Detection** cards.
**VO:** "Built‑in AI forecasts demand machine by machine, recommends exactly what to load on the next trip, and flags anomalies — like a sudden revenue drop — automatically."

### 0:38 – 0:48 · Routes & Trips
**On screen:** Open a **Route**, click **Optimize** — the map line redraws, toast: "58 mi → 41 mi, saving 29%." Cut to a Trip's results‑entry screen.
**VO:** "Plan routes and trips on the map, and optimize them in one click to cut drive time. Drivers record restocks and cash collected right in the trip, slot by slot."
**Fallback (if `/routes/[id]` or `/trips/[id]` not fixed):** show `/trips/create` — adding machine stops to the live map — and say "Build trips visually on the map, then optimize the route for the shortest run."

### 0:48 – 0:60 · The Rest of the Platform
**On screen:** Quick, smooth flashes — Locations, Inventory & Purchases, Promotions & Loyalty, Team roles, Configuration, then settle back on the dashboard.
**VO:** "Beyond that: locations, inventory and purchasing, promotions and a loyalty program, team roles, full financial reports, and configuration for any hardware — all in one connected system."

---

## Shot List (quick reference)
1. Login → `/dashboard` KPI sweep (0:00)
2. `/map` — click red CD003, amber WF002 (0:08)
3. `/machines/CD001` — General → Planogram tab (0:18)
4. `/insights/forecast` → `/insights/recommendations` → `/insights/anomalies` (0:28)
5. `/routes/[id]` Optimize → `/trips/[id]` results entry — *(verify these render correctly; else use `/trips/create` fallback)* (0:38)
6. Montage: `/locations`, `/inventory`, `/purchases`, `/promotions`, `/team`, `/configuration` → back to `/dashboard` (0:48)

## Production notes
- Use the seeded **Peak Vending Solutions** demo data — every screen is pre‑filled (no empty states).
- Keep cuts to 2–3 seconds; let the **offline‑pin popup** and the **Optimize** distance‑savings toast linger ~1s — they read best on screen.
- Record at 1440p, app at ~90% zoom so KPI cards and charts stay legible.
- Captions on for silent autoplay.
