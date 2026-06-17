"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getApp_() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export const auth = getAuth(getApp_());

let _db: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
  if (!_db) {
    const app = getApp_();
    try {
      _db = getFirestore(app);
    } catch {
      _db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });
    }
  }
  return _db;
}

export function getStorageBucket() {
  return getStorage(getApp_());
}

export default getApp_();
