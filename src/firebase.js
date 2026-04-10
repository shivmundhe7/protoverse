import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQEi4jFEEaHMOSOw65RJNETmY_22Jz5L0",
  authDomain: "notes-sharing-4c525.firebaseapp.com",
  projectId: "notes-sharing-4c525",
  storageBucket: "notes-sharing-4c525.firebasestorage.app",
  messagingSenderId: "210739900669",
  appId: "1:210739900669:web:096c75f34e755a8a180e94",
  measurementId: "G-NZKQ2GBHFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
