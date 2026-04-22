// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ✅ ADD THIS LINE
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbl2LZr3KGSGMZN1ow6eWiyumO_a4RM9I",
  authDomain: "campussphere-4b7a4.firebaseapp.com",
  projectId: "campussphere-4b7a4",
  storageBucket: "campussphere-4b7a4.firebasestorage.app",
  messagingSenderId: "615732178955",
  appId: "1:615732178955:web:ee68d330e09105e01f570e",
  measurementId: "G-VECHMLZDG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ THIS IS THE MAIN FIX
export const auth = getAuth(app);