import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App;
let db: Firestore;

function getAdminApp(): App {
  if (!app) {
    if (getApps().length === 0) {
      // On Firebase App Hosting, default credentials are available automatically
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        app = initializeApp({
          credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        });
      } else {
        app = initializeApp();
      }
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

export function getAdminDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}
