// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn_PNzg52rAFehUYdXMuwygGmCrG_nO7g",
  authDomain: "python-project-e27fa.firebaseapp.com",
  projectId: "python-project-e27fa",
  storageBucket: "python-project-e27fa.firebasestorage.app",
  messagingSenderId: "962966899193",
  appId: "1:962966899193:web:580b1dedd7b6350afa1528",
  measurementId: "G-Q8XZBFR8HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore instance
export { db };
