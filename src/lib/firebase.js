// Import all required Firebase services
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  connectFirestoreEmulator,

} from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);

// If using emulators
// connectAuthEmulator(auth, "http://127.0.0.1:9099");
// connectFirestoreEmulator(db, "127.0.0.1", 8080);

const logOut = () => signOut(auth); // Signs out the current user

// Export everything your components need
export {
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  logOut,
};

export async function saveDrawing(drawingId, rawElements) {
  await setDoc(doc(db, "drawings", drawingId), {
    elements: rawElements,
  });
}

export async function loadDrawing(drawingId) {
  const docRef = doc(db, "drawings", drawingId);
  const docSnap = await (getDoc(docRef));
  if (docSnap.exists()) {
    console.log("Stored Drawings:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such Drawing!");
  }
}
