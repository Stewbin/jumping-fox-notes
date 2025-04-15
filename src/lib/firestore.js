import app from "./firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore/lite";

const db = getFirestore(app);
const auth = getAuth(app);

const user = auth.currentUser;
const notesRoot = collection(db, "users", user.uid, "notesRoot");

export async function setNote(cwd, name, newNote) {
  setDoc(doc(notesRoot, cwd, name), newNote, {
    merge: true,
  });
}

export async function getNote(cwd, name) {
  if (user) {
    return getDoc(doc(notesRoot, cwd, name));
  } else {
    alert("No user logged in.");
    return null;
  }
}

export async function getNotebook(cwd, name) {
  if (user) {
    return getDocs(collection(notesRoot, cwd, name));
  } else {
    alert("No user logged in.");
    return null;
  }
}
