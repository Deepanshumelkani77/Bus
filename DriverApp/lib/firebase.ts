// Firebase configuration for React Native
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfkBbdYUuH4pnF7273rZtcifhFECvC1vs",
  authDomain: "bustrac-16074.firebaseapp.com",
  projectId: "bustrac-16074",
  storageBucket: "bustrac-16074.firebasestorage.app",
  messagingSenderId: "1022022711841",
  appId: "1:1022022711841:web:9e1f90752cb26d18c94160",
  measurementId: "G-RC8VVJ8914"
};

// Initialize Firebase only if it hasn't been initialized
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics (only on web platforms)
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
