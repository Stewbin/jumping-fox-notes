import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

let notesRoot = null;
let waitingResolvers = [];

onAuthStateChanged(auth, (user) => {
  if (user) {
    notesRoot = collection(db, "users", user.uid, "notesRoot");
    // Pass root to each callback
    waitingResolvers.forEach(({ resolve }) => resolve(notesRoot));
    waitingResolvers = []; // clear after resolving
  } else {
    notesRoot = null;
    // Reject any pending promises when user is logged out
    waitingResolvers.forEach(({ reject }) =>
      reject(new Error("No user is logged in"))
    );
    waitingResolvers = [];
  }
});

/**
 * Call this anywhere to await a ready notesRoot.
 * It resolves immediately if already available, or waits for login.
 */
export function getNotesRoot() {
  if (notesRoot) return Promise.resolve(notesRoot);

  // Queue call back for notesRoot
  return new Promise((resolve, reject) => {
    waitingResolvers.push({ resolve, reject });
  });
}

/**
 * Writes to the document at `notesRoot/id`. If no document exists, one will be created.
 *
 * If `id` is an empty string, then an ID will be auto-generated.
 * @param {string} id ID of Note
 * @param {Object} newNote `{ id: string, name: string, content: string, ... }`
 * @returns {string} The (possibly auto-generated) id of the pushed document
 */
export async function pushNote(newNote, id) {
  try {
    const notesRoot = await getNotesRoot();
    const noteRef = id ? doc(notesRoot, id) : doc(notesRoot);
    setDoc(noteRef, newNote, {
      merge: true,
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns the note given by `id` if it exists in the User's collection.
 * Else, it returns `null`.
 * @param {string} id ID of Note
 * @returns Promise<DocumentSnapshot | null>
 */
export async function pullNote(id) {
  try {
    const notesRoot = await getNotesRoot();
    return getDoc(doc(notesRoot, id));
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Retrieves an array of all Notes the User has. The array may be empty.
 * @returns Promise<QueryDocumentSnapshot[]>
 */
export async function pullNotes() {
  try {
    const notesRoot = await getNotesRoot();
    return getDocs(notesRoot).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return data;
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Deletes doc specified by `id`. Doc need not exist.
 * @param {string} id ID of document
 */
export async function deleteNote(id) {
  try {
    const notesRoot = await getNotesRoot();
    deleteDoc(doc(notesRoot, id));
  } catch (error) {
    console.error(error);
  }
}
