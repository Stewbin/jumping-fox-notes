// Import all required Firebase services
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Your Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyCYIFhBAqMaM4GQJTc6EaekQXsq5KiWBDE",
  authDomain: "jumping-fox-notes.firebaseapp.com",
  projectId: "jumping-fox-notes",
  storageBucket: "jumping-fox-notes.firebasestorage.app",
  messagingSenderId: "986976785621",
  appId: "1:986976785621:web:a406d6801721cd2717fe5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// If using emulators
/*
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
*/

// Export everything your components need
export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
};
