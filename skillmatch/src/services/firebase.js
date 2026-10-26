import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

// ค่าทั้งหมดอ่านจากไฟล์ .env (ไม่ commit ขึ้น GitHub)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL
)

const app = initializeApp(
  isFirebaseConfigured
    ? firebaseConfig
    : { apiKey: 'missing', databaseURL: 'https://missing-default-rtdb.firebaseio.com', projectId: 'missing', appId: 'missing' }
)

export const db = getDatabase(app)
export const auth = getAuth(app)
