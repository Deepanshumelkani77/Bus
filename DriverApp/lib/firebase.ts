import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { Platform } from 'react-native';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfkBbdYUuH4pnF7273rZtcifhFECvC1vs",
  authDomain: "bustrac-16074.firebaseapp.com",
  projectId: "bustrac-16074",
  storageBucket: "bustrac-16074.firebasestorage.app",
  messagingSenderId: "1022022711841",
  appId: "1:1022022711841:web:9e1f90752cb26d18c94160",
  measurementId: "G-RC8VVJ8914"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics (only on web platform)
let analytics;
if (Platform.OS === 'web') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
