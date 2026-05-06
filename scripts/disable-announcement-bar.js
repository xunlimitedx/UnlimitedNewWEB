/**
 * One-shot remediation: disable the "Shop is Under Construction" banner that's
 * stored in Firestore at settings/theme. This banner appears on every page and
 * is a major conversion blocker for an active e-commerce site.
 *
 * Usage: node scripts/disable-announcement-bar.js
 *
 * The admin can re-enable it any time via /admin/theme.
 */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function loadEnvLocal() {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

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
  const ref = db.collection('settings').doc('theme');
  const snap = await ref.get();
  const before = snap.exists ? snap.data() : {};
  console.log('Current announcementBar:', before.announcementBar);
  console.log('Current announcementBarEnabled:', before.announcementBarEnabled);
  await ref.set(
    { announcementBarEnabled: false, announcementBar: '' },
    { merge: true }
  );
  console.log('OK: announcement bar disabled.');
}

main().catch((e) => { console.error(e); process.exit(1); });
