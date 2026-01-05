// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase config (you already pasted this earlier)
const firebaseConfig = {
  apiKey: "AIzaSyCAjJM2JAjIgKAVys1ZVMWF719yiFudwPU",
  authDomain: "ronald-trading-app.firebaseapp.com",
  projectId: "ronald-trading-app",
  storageBucket: "ronald-trading-app.firebasestorage.app",
  messagingSenderId: "680242599286",
  appId: "1:680242599286:web:0c9f2c50cfe04fcefe5657",
  measurementId: "G-C97MB53KRM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
