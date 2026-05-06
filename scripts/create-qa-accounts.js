/**
 * One-shot script to provision QA test accounts in Firebase Auth.
 * Reads service account credentials from .env.local.
 * Safe to re-run: if the user exists, the password is reset and emailVerified set true.
 *
 * Run: node scripts/create-qa-accounts.js
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Lightweight .env.local loader (no dotenv dependency required)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_ADMIN_* env vars in .env.local');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
});

const accounts = [
  {
    email: 'qa.customer@unlimitedits.co.za',
    password: process.argv[2] || 'kNkhcDU#g%7T2%tNvde%',
    displayName: 'QA Customer',
    role: 'customer',
  },
  {
    email: 'qa.admin@unlimitedits.co.za',
    password: process.argv[3] || 'Jx@RjoGirPx$$fZ3FMgG',
    displayName: 'QA Admin',
    role: 'admin',
  },
];

async function ensureUser({ email, password, displayName, role }) {
  let user;
  try {
    user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password, displayName, emailVerified: true, disabled: false });
    console.log(`[updated] ${email} (uid=${user.uid})`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      user = await admin.auth().createUser({ email, password, displayName, emailVerified: true });
      console.log(`[created] ${email} (uid=${user.uid})`);
    } else {
      throw err;
    }
  }
  await admin.auth().setCustomUserClaims(user.uid, { role });

  // Mirror to Firestore so any role-based reads work
  const db = admin.firestore();
  await db.collection('users').doc(user.uid).set(
    {
      email,
      displayName,
      role,
      isAdmin: role === 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      qaAccount: true,
    },
    { merge: true }
  );
  return user.uid;
}

(async () => {
  for (const acct of accounts) {
    try {
      await ensureUser(acct);
    } catch (err) {
      console.error(`Failed for ${acct.email}:`, err.message);
      process.exitCode = 1;
    }
  }
  process.exit(process.exitCode || 0);
})();
