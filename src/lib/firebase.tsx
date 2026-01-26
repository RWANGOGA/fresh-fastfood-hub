// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-MTmvYncl4S8b3FlLITswseTqH8QOxu4",
  authDomain: "fresh-fastfood-hub-ab741.firebaseapp.com",
  projectId: "fresh-fastfood-hub-ab741",
  storageBucket: "fresh-fastfood-hub-ab741.firebasestorage.app",
  messagingSenderId: "269816113334",
  appId: "1:269816113334:web:00dbd36eea409223875e17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll use
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;