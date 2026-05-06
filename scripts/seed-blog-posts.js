/**
 * Seed initial blog posts for SEO. Empty /blog is a major missed opportunity
 * for a local IT services + e-commerce site \u2014 every post is a chance to rank
 * for high-intent local keywords like "computer repairs Ramsgate".
 *
 * Posts target South Coast KZN long-tail intent. Customise / expand later.
 *
 * Usage: node scripts/seed-blog-posts.js
 */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function loadEnvLocal() {
  const p = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const POSTS = [
  {
    slug: 'computer-repairs-ramsgate-what-to-expect',
    title: 'Computer Repairs in Ramsgate: What to Expect & How Much It Costs',
    excerpt: 'A clear guide to laptop and desktop repair turnaround times, typical pricing in South Africa, and how to tell if your machine is worth fixing.',
    category: 'Repairs',
    tags: ['computer repair', 'Ramsgate', 'KZN', 'laptop repair'],
    coverImage: '/images/blog/computer-repair.jpg',
    content: `
# Computer Repairs in Ramsgate \u2014 What to Expect

Whether your laptop won't boot or your desktop is running slowly, here's what a professional repair looks like in 2026.

## Typical turnaround times
- **Diagnostic:** Same day to 24 hours
- **Software repair (virus removal, Windows reinstall):** 24\u201348 hours
- **Hardware swap (SSD, RAM, screen):** 1\u20133 business days, depending on parts
- **Motherboard / fine soldering:** 3\u20137 business days

## Typical price ranges (Ramsgate / South Coast)
- Diagnostic fee: **Free with repair** at Unlimited IT Solutions
- OS reinstall + driver setup: **R450\u2013R750**
- SSD upgrade (incl. cloning): **R1,200\u2013R2,500**
- Screen replacement: **R1,800\u2013R4,500** depending on model
- Liquid damage / board-level: **From R1,500**

## Should you repair or replace?
A good rule of thumb: if the repair is more than **50% of the cost of an equivalent new machine**, replacement usually wins on long-term value. We'll quote both options before any work starts.

## Book a repair
Call **039 314 4359** or visit us at 202 Marine Drive, Ramsgate \u2014 walk-ins welcome Mon\u2013Fri 8am\u20135pm and Saturday 8am\u20131pm.
`,
  },
  {
    slug: 'cctv-installation-cost-south-africa-2026',
    title: 'CCTV Installation Cost in South Africa (2026 Pricing Guide)',
    excerpt: 'Real prices for 4-channel and 8-channel CCTV systems on the South Coast, including DVR, cameras, cabling, and labour.',
    category: 'Security',
    tags: ['CCTV', 'security', 'Ramsgate', 'South Coast'],
    coverImage: '/images/blog/cctv-installation.jpg',
    content: `
# CCTV Installation Cost in South Africa (2026)

Most South African homeowners overpay for CCTV because installers don't itemise. Here's a transparent breakdown.

## What drives the price
1. **Number of cameras** \u2014 4 vs 8 vs 16 channel
2. **Camera resolution** \u2014 2MP, 4MP, 5MP, 8MP/4K
3. **Cable type & runs** \u2014 longer cable runs add labour and material
4. **Recording days** \u2014 1TB lasts ~7 days at 4MP; 4TB for 30+ days
5. **Remote viewing & alerts** \u2014 mobile app, motion zones, AI detection

## Typical 2026 prices (installed)
| System | Cameras | Recording | Approx. Total |
|---|---|---|---|
| Starter 4ch | 4 \u00d7 2MP bullet | 1TB / 7 days | R6,500\u2013R8,500 |
| Family 4ch | 4 \u00d7 4MP | 2TB / 14 days | R9,500\u2013R12,500 |
| Business 8ch | 8 \u00d7 4MP | 4TB / 30 days | R16,000\u2013R22,000 |
| AI 8ch | 8 \u00d7 5MP + AI | 4TB / 30 days | R22,000\u2013R30,000 |

## Brands we install
HiLook, Hikvision, Dahua, Ezviz, Uniview \u2014 we are a Hikvision-trained installer covering Ramsgate, Margate, Port Shepstone and the broader South Coast.

## Free site survey
Email **info@unlimitedits.co.za** or call **039 314 4359** for a no-obligation quote. We bring the camera samples to your site.
`,
  },
  {
    slug: 'business-it-support-south-coast-kzn',
    title: 'Choosing a Business IT Support Partner on the KZN South Coast',
    excerpt: 'How to choose between in-house IT, a freelancer, and a managed services provider \u2014 and what each really costs per month.',
    category: 'IT Support',
    tags: ['managed IT', 'business', 'KZN', 'support'],
    coverImage: '/images/blog/it-support.jpg',
    content: `
# Choosing a Business IT Support Partner on the KZN South Coast

If your business has more than 5 staff, downtime costs more than IT support does. Here's how to think about it.

## Three common models
1. **Break-fix freelancer** \u2014 pay per call-out. Cheapest until your servers go down on a Friday.
2. **In-house IT** \u2014 great at scale, expensive below 30 staff.
3. **Managed Services Provider (MSP)** \u2014 fixed monthly fee, proactive monitoring.

## What an MSP should include
- Remote monitoring & alerts on every workstation and server
- Patch management (Windows + third-party apps)
- Endpoint antivirus + EDR
- Cloud / on-prem backup with monthly restore tests
- Microsoft 365 / Google Workspace administration
- Quarterly business review

## Typical pricing in 2026
- **5\u201310 users:** R350\u2013R600 per user per month
- **10\u201325 users:** R280\u2013R450 per user per month
- **25+ users:** Custom

## Why local matters
Remote support handles 80% of issues, but when a switch dies you want a technician on-site within an hour, not the next day. We have technicians based in Ramsgate covering Margate, Port Shepstone, Hibberdene, and Scottburgh.

[Contact us](/contact) for a free IT health check.
`,
  },
  {
    slug: 'console-repairs-playstation-xbox-ramsgate',
    title: 'PlayStation and Xbox Repairs in Ramsgate: HDMI Ports, Drives & More',
    excerpt: 'Common console faults we fix every week \u2014 from PS5 HDMI port replacements to Xbox disc drive failures.',
    category: 'Repairs',
    tags: ['console repair', 'PlayStation', 'Xbox', 'gaming'],
    coverImage: '/images/blog/console-repair.jpg',
    content: `
# Console Repairs in Ramsgate (PlayStation, Xbox, Nintendo)

Modern consoles use the same surface-mount components as laptops, which means most "dead" consoles are repairable for a fraction of replacement cost.

## Most common faults we see
- **HDMI port damage** \u2014 #1 fault on PS4 and PS5. Repair cost from **R950**.
- **Disc drive failure** \u2014 dust, worn laser, or bad belt. From **R650**.
- **Overheating / fan noise** \u2014 thermal paste + fan service. **R450\u2013R650**.
- **No power / blue light of death** \u2014 board-level diagnosis required.
- **Controller drift** \u2014 stick replacement, **R350** per controller.

## Why not just buy a new one?
A used PS5 still costs R10,000+ in 2026. A R950 HDMI repair makes sense.

## Drop-off
Bring your console to **202 Marine Drive, Ramsgate**. We'll diagnose within 24 hours and quote before any work starts. **No fix, no fee** on diagnostic.
`,
  },
  {
    slug: 'mac-repairs-ramsgate-macbook-imac',
    title: 'Mac Repairs in Ramsgate: MacBook & iMac Service Without Flying to JHB',
    excerpt: 'You no longer need to ship your Mac to Johannesburg. Here\u2019s what we repair locally on the South Coast.',
    category: 'Repairs',
    tags: ['Mac repair', 'MacBook', 'iMac', 'Apple'],
    coverImage: '/images/blog/mac-repair.jpg',
    content: `
# Mac Repairs in Ramsgate \u2014 No JHB Trip Required

Apple service centres are clustered in Joburg and Cape Town. We do local Mac work on the South Coast so you keep your laptop in your hand, not in a courier bag.

## What we repair
- MacBook battery replacement (all models incl. Apple Silicon)
- Keyboard and trackpad swaps
- Liquid damage assessment & board-level repair
- SSD upgrades on supported models
- iMac display, fan, and PSU replacement
- macOS reinstall, recovery, data migration

## Apple Silicon (M1/M2/M3/M4) caveat
Some Apple Silicon repairs require Apple's proprietary calibration tools that only authorised service providers have. We're transparent: if a repair needs an Apple-only tool, we'll tell you up front and refer you to the closest authorised centre.

## Drop-off
**202 Marine Drive, Ramsgate** \u2014 walk-ins welcome. We diagnose within 24 hours.
`,
  },
  {
    slug: 'best-budget-laptop-south-africa-2026',
    title: 'Best Budget Laptops Under R10,000 in South Africa (2026)',
    excerpt: 'Our shortlist of dependable laptops under R10,000 for students, home office and light business use \u2014 with honest pros and cons.',
    category: 'Buying Guides',
    tags: ['laptop', 'budget', 'South Africa', 'buying guide'],
    coverImage: '/images/blog/budget-laptops.jpg',
    content: `
# Best Budget Laptops Under R10,000 in South Africa (2026)

Cheap laptops can be a trap \u2014 here are the models we actually recommend after testing in our [Ramsgate workshop](/locations/ramsgate).

## What to look for under R10k
- **8GB RAM minimum** (16GB if you can stretch budget)
- **256GB SSD minimum** \u2014 never buy a HDD-only laptop in 2026
- **Full HD (1920\u00d71080) display** \u2014 avoid 1366\u00d7768 panels
- **At least one USB-C port** for future-proofing

## Our shortlist
1. **HP 250 G10 (Intel N200)** \u2014 lightweight admin & study machine. ~R8,500.
2. **Lenovo IdeaPad 1 (Ryzen 5)** \u2014 best all-rounder around R9,500.
3. **Acer Aspire 3 (i3-1215U)** \u2014 reliable office workhorse. ~R9,200.

Browse our current [laptop range](/products?category=laptops) for live pricing.

## Need help choosing?
Call **082 556 9875** or [request a business quote](/business/quote) for 5+ units.
`,
  },
  {
    slug: 'small-business-network-setup-checklist',
    title: 'Small Business Network Setup Checklist (KZN South Coast)',
    excerpt: 'A practical checklist for setting up reliable WiFi, switches, and fibre for a small business or retail shop in South Africa.',
    category: 'Networking',
    tags: ['networking', 'small business', 'WiFi', 'fibre'],
    coverImage: '/images/blog/network-setup.jpg',
    content: `
# Small Business Network Setup Checklist

A flaky network costs more in lost sales than the network itself. Here's what every small business should have.

## 1. A real router (not the ISP freebie)
ISP-supplied routers are budget consumer kit. Replace with a proper SMB unit \u2014 MikroTik, Ubiquiti, or TP-Link Omada \u2014 to get VLANs, guest WiFi isolation and proper logging.

## 2. WiFi 6 access points
Your phone, POS, scanner and stock-take device all share spectrum. WiFi 6 (802.11ax) handles dense client counts far better than older WiFi 5.

## 3. Managed switch
Even an 8-port managed switch lets you separate POS traffic from guest WiFi and CCTV. Critical for [PCI-DSS compliance](/blog/cctv-installation-cost-south-africa-2026).

## 4. UPS on the rack
Load-shedding will kill an unprotected switch within months. Budget R1,500\u2013R3,500 for a 1kVA line-interactive UPS.

## 5. Documentation
Label every cable. Store a network diagram in the cloud. Future-you will thank present-you.

## Need a quote?
We do networking installs across [Margate, Port Shepstone, Hibberdene and Scottburgh](/locations/margate). [Request a quote](/business/quote) or call **082 556 9875**.
`,
  },
  {
    slug: 'load-shedding-proof-your-it-setup',
    title: 'Load-Shedding Proof Your IT Setup (UPS, Inverter & Surge Guide)',
    excerpt: 'How to keep your computers, router and CCTV running during stage 4+ load-shedding without frying the hardware.',
    category: 'Power & Backup',
    tags: ['load shedding', 'UPS', 'inverter', 'surge protection'],
    coverImage: '/images/blog/load-shedding.jpg',
    content: `
# Load-Shedding Proof Your IT Setup

After 7 years of load-shedding, the rules are clear. Here's the minimum every home and small office needs.

## The 3-layer rule
1. **Surge protection** at the wall (R150\u2013R400) \u2014 takes the spike that kills your PSU
2. **Line-interactive UPS** for desktops, router and modem (R1,200\u2013R3,500)
3. **Inverter or solar** for anything you need running through the full slot

## What size UPS?
A typical desktop + 24" monitor + ONT pulls about 200W. A 1kVA / 600W UPS gives you ~30 minutes \u2014 enough for stage 6 with comfortable margin.

## Don't forget the CCTV
A NVR + 4 cameras + PoE switch is roughly 80W continuous. A small dedicated UPS keeps your security live during outages \u2014 the time burglars love most.

## Buy locally
Browse our [UPS range](/products?category=power) or pop into our [Ramsgate branch](/locations/ramsgate) for advice.
`,
  },
  {
    slug: 'how-to-choose-cctv-camera-south-africa',
    title: 'How to Choose a CCTV Camera in South Africa (2026 Buyer\u2019s Guide)',
    excerpt: 'Resolution, IP rating, night vision and POE \u2014 the only camera spec guide you\u2019ll need before buying.',
    category: 'CCTV',
    tags: ['CCTV', 'security cameras', 'buying guide', 'South Africa'],
    coverImage: '/images/blog/cctv-buyers-guide.jpg',
    content: `
# How to Choose a CCTV Camera in South Africa

Cheap cameras with great Amazon reviews often disappoint after 6 months in SA's sun and humidity. Here's what actually matters.

## Resolution
- **2MP (1080p)** is the realistic minimum for facial ID at 5\u201310m
- **4MP / 5MP** is the sweet spot for most homes and shops in 2026
- **8MP / 4K** only matters for parking lots and large yards

## IP rating
Outdoor cameras must be **IP66 minimum** for KZN coastal humidity and salt air. IP67 if mounted within 50m of the beach.

## Night vision
- **IR LEDs (black & white at night)** \u2014 cheaper, fine for back yards
- **Colour night vision (with white-light)** \u2014 better for entrances and driveways

## POE vs WiFi
Always pick **POE (Power-over-Ethernet)** for a fixed install \u2014 one cable for power and data, far more reliable than WiFi cameras.

## Installation
We install across the South Coast: [Margate](/locations/margate), [Port Shepstone](/locations/port-shepstone), [Hibberdene](/locations/hibberdene) and [Scottburgh](/locations/scottburgh). See our full [CCTV installation service](/services/cctv-installation) or [request a quote](/business/quote).
`,
  },
];

async function main() {
  loadEnvLocal();
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing FIREBASE_ADMIN_* env vars in .env.local');
  }
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }
  const db = admin.firestore();
  const now = new Date().toISOString();

  let created = 0;
  let skipped = 0;

  for (const p of POSTS) {
    const ref = db.collection('blog').doc(p.slug);
    const existing = await ref.get();
    if (existing.exists) {
      console.log('SKIP (already exists):', p.slug);
      skipped++;
      continue;
    }
    const doc = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content.trim(),
      category: p.category,
      tags: p.tags,
      coverImage: p.coverImage,
      author: 'Unlimited IT Solutions',
      authorEmail: 'info@unlimitedits.co.za',
      published: true,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      readTime: Math.max(2, Math.round(p.content.split(/\s+/).length / 200)),
    };
    await ref.set(doc);
    console.log('CREATED:', p.slug);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
