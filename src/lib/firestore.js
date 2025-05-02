import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

const notesRootPromise = new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      // reject(new Error("No user logged in."));
      console.warn("No user logged in.");
      return;
    }
    const ref = collection(db, "users", user.uid, "notesRoot");
    resolve(ref);
    unsubscribe(); // stop listening after first resolution
  });
});

/**
 * Writes to the document at `notesRoot/id`. If no document exists, one will be created.
 * If `id` is an empty string, then an ID will be auto-generated.
 * @param {string} id ID of Note
 * @param {Object} newNote `{ name: string, content: string, tags: string[], timestamp: Date }`
 * @returns {string} The (possibly auto-generated) id of the pushed document
 */
export async function pushNote(newNote, id) {
  try {
    const notesRoot = await notesRootPromise;
    const noteRef = id ? doc(notesRoot, id) : doc(notesRoot);
    setDoc(noteRef, newNote, {
      merge: true,
    });
    return noteRef.id;
  } catch (error) {
    console.warn(error);
    return "";
  }
}

/**
 * Returns the note `id` if it exists in the User's collection.
 * Else, it returns `null`.
 * @param {string} id ID of Note (Equivalent to name)
 * @returns Promise<DocumentSnapshot | null>
 */
export async function pullNote(id) {
  try {
    const notesRoot = await notesRootPromise;
    return getDoc(doc(notesRoot, id));
  } catch (error) {
    console.warn(error);
    return null;
  }
}

/**
 * Retrieves an array of all Notes the User has. The array may be empty.
 * @returns Promise<QueryDocumentSnapshot[]>
 */
export async function pullNotes() {
  try {
    const notesRoot = await notesRootPromise;
    return getDocs(notesRoot).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(data);
      return data;
    });
  } catch (error) {
    console.warn(error);
    return [];
  }
}
