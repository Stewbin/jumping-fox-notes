import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYIFhBAqMaM4GQJTc6EaekQXsq5KiWBDE",
  authDomain: "jumping-fox-notes.firebaseapp.com",
  projectId: "jumping-fox-notes",
  storageBucket: "jumping-fox-notes.firebasestorage.app",
  messagingSenderId: "986976785621",
  appId: "1:986976785621:web:a406d6801721cd2717fe5c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export default app;
